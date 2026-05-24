varying vec3 vNormal;
varying float vIntensity;
varying float vFogDepth;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

void main() {
  vec3 N = normalize(vNormal);

  // Stronger key light + softer fills for contrast
  vec3 L1 = normalize(vec3( 0.4,  0.9, -0.3));
  vec3 L2 = normalize(vec3(-0.4,  0.4,  0.5));
  vec3 L3 = normalize(vec3( 0.0, -0.7,  0.0));

  float diff = max(dot(N, L1), 0.0) * 0.75
             + max(dot(N, L2), 0.0) * 0.35
             + max(dot(N, L3), 0.0) * 0.18;

  vec3 base = mix(uColorA, uColorB, clamp(vIntensity, 0.0, 1.0));
  vec3 col = base * (diff * 0.75 + 0.35);

  float fogFactor = clamp((vFogDepth - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
  col = mix(col, uFogColor, fogFactor);

  gl_FragColor = vec4(col, 1.0);
}
