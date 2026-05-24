attribute float aInstanceId;

uniform float uTime;
uniform float uTunnelOffset;
uniform float uHalfW;
uniform float uHalfH;
uniform float uTunnelLength;
uniform float uNw;
uniform float uNz;
uniform float uBaseLength;
uniform float uBaseThickness;
uniform float uBaseDepth;
uniform float uWaveFreq;
uniform float uNoiseFreq;
uniform float uMixWeight;

varying vec3 vNormal;
varying float vIntensity;
varying float vFogDepth;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
         + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Sample wave + noise with a given parameter set → blended [0,1]
float sampleT(float u, float z, float wall, float wavePhase, float noiseOffset,
              float waveFreq, float noiseFreq) {
  float wave = sin(z * 0.4 + uTime * 1.2 + wavePhase)
             * cos(u * waveFreq + uTime * 0.5);
  wave = wave * 0.5 + 0.5;
  float noise = snoise(vec2(u * noiseFreq, z * 0.3)
              + vec2(wall * 17.3 + noiseOffset, uTime * 0.15));
  noise = noise * 0.5 + 0.5;
  return mix(wave, noise, uMixWeight);
}

void main() {
  float perWall = uNw * uNz;
  float id = aInstanceId;
  float wall = floor(id / perWall);
  float local = mod(id, perWall);
  float i = mod(local, uNw);
  float j = floor(local / uNw);

  float u = (i + 0.5) / uNw - 0.5;
  float zRaw = (j / (uNz - 1.0) - 0.5) * uTunnelLength;
  float z = mod(zRaw + uTunnelOffset + uTunnelLength * 0.5, uTunnelLength)
          - uTunnelLength * 0.5;

  // Wall basis
  vec3 wallNormal, wallTangent, wallCenter;
  if (wall < 0.5) {
    wallNormal  = vec3(-1.0, 0.0, 0.0);
    wallTangent = vec3( 0.0, 1.0, 0.0);
    wallCenter  = vec3( uHalfW, u * uHalfH * 2.0, z);
  } else if (wall < 1.5) {
    wallNormal  = vec3(0.0, -1.0, 0.0);
    wallTangent = vec3(1.0,  0.0, 0.0);
    wallCenter  = vec3(u * uHalfW * 2.0,  uHalfH, z);
  } else if (wall < 2.5) {
    wallNormal  = vec3(1.0, 0.0, 0.0);
    wallTangent = vec3(0.0, 1.0, 0.0);
    wallCenter  = vec3(-uHalfW, u * uHalfH * 2.0, z);
  } else {
    wallNormal  = vec3(0.0, 1.0, 0.0);
    wallTangent = vec3(1.0, 0.0, 0.0);
    wallCenter  = vec3(u * uHalfW * 2.0, -uHalfH, z);
  }
  vec3 wallBitangent = vec3(0.0, 0.0, 1.0);

  // Three decorrelated samples → length / thickness / depth vary independently
  float tL = sampleT(u, z, wall, wall * 1.3,  0.0,  uWaveFreq,        uNoiseFreq);
  float tT = sampleT(u, z, wall, wall * 2.1, 31.2,  uWaveFreq * 1.3,  uNoiseFreq * 1.6);
  float tD = sampleT(u, z, wall, wall * 3.3,  7.7,  uWaveFreq * 0.7,  uNoiseFreq * 0.8);

  // Outlier mask: ~8% of instances become dramatically larger (thickness + depth)
  float r = snoise(vec2(u * 11.0, z * 0.9) + vec2(wall * 53.1, 0.0));
  float outlier = smoothstep(0.55, 0.75, r);

  float lengthScale    = uBaseLength    * (0.3 + tL * 1.8);
  float thicknessScale = uBaseThickness * (0.25 + tT * 1.4) * (1.0 + outlier * 2.2);
  float depthScale     = uBaseDepth     * (0.5  + tD * 2.0) * (1.0 + outlier * 1.6);

  // Transform local box into wall frame
  vec3 offset = (position.x * lengthScale)               * wallTangent
              + ((position.y + 0.5) * thicknessScale)    * wallNormal
              + (position.z * depthScale)                * wallBitangent;
  vec3 worldPos = wallCenter + offset;

  vec3 worldNormal = normal.x * wallTangent
                   + normal.y * wallNormal
                   + normal.z * wallBitangent;

  vec4 viewPos = modelViewMatrix * vec4(worldPos, 1.0);
  vFogDepth = -viewPos.z;
  vNormal = worldNormal;
  vIntensity = (tL + tT) * 0.5 + outlier * 0.2;

  gl_Position = projectionMatrix * viewPos;
}
