import { useMemo, useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { AdditiveBlending, Color, type Group, type Mesh } from 'three'

const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - clamp(dot(vNormal, viewDir), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor * uIntensity * fresnel, fresnel);
  }
`

// Sphere radius (slightly larger than mesh radius to surface the text)
const SPHERE_R = 2.06
// Left edge where characters wrap around
const LEFT     = -10
// Per-character spacing in world units
const SPACING  = 0.42

type StreamProps = {
  text: string
  y: number
  speed: number
  color?: string
  fontSize?: number
}

function TextStream({ text, y, speed, color = '#ffffff', fontSize = 0.27 }: StreamProps) {
  const { chars, span } = useMemo(() => {
    const src = Array.from(text)
    const minCount = Math.ceil(20 / SPACING) + 4
    // テキスト長の倍数に揃えてループ境界で途切れないようにする
    const n = Math.ceil(minCount / src.length) * src.length
    const arr = Array.from({ length: n }, (_, i) => src[i % src.length])
    return { chars: arr, span: n * SPACING }
  }, [text])

  const refs      = useRef<(Group | null)[]>(chars.map(() => null))
  const xs        = useRef(chars.map((_, i) => 4 + i * SPACING))
  const hoveredRef = useRef(false)
  const [hovered, setHovered] = useState(false)

  const onOver = useCallback(() => { hoveredRef.current = true;  setHovered(true)  }, [])
  const onOut  = useCallback(() => { hoveredRef.current = false; setHovered(false) }, [])

  useFrame((_, dt) => {
    if (hoveredRef.current) return  // ホバー中はアニメーション停止

    for (let i = 0; i < chars.length; i++) {
      let x = xs.current[i] - dt * speed
      if (x < LEFT) x += span
      xs.current[i] = x

      const g = refs.current[i]
      if (!g) continue

      const r  = SPHERE_R
      const d2 = x * x + y * y

      if (d2 < r * r) {
        const z = Math.sqrt(r * r - d2)
        g.position.set(x, y, z + 0.02)
        g.rotation.y = Math.atan2(x, z)
      } else {
        g.position.set(x, y, 0)
        g.rotation.y = 0
      }
    }
  })

  const displayColor = hovered ? '#2afff1' : color

  return (
    <>
      {chars.map((char, i) => (
        <group
          key={i}
          ref={el => { refs.current[i] = el }}
          onPointerOver={onOver}
          onPointerOut={onOut}
        >
          <Text
            fontSize={fontSize}
            color={displayColor}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0}
          >
            {char}
          </Text>
        </group>
      ))}
    </>
  )
}

function FresnelSphere() {
  const meshRef = useRef<Mesh>(null!)
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color('#ff7a2a') },
      uPower: { value: 2.8 },
      uIntensity: { value: 2.6 },
    }),
    [],
  )

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.08
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 96, 96]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uniforms={uniforms}
        vertexShader={fresnelVertex}
        fragmentShader={fresnelFragment}
      />
    </mesh>
  )
}

export function FlowingSphereText() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      <pointLight position={[-6, -3, -4]} intensity={0.8} color="#5fb9ff" />
      <pointLight position={[4, -2, 6]} intensity={0.6} color="#ff8a5f" />

      <FresnelSphere />

      <TextStream
        text="   Hello, I`m Ryusei Kishi   "
        y={0}
        speed={1.2}
        fontSize={0.45}
        color="#ffffff"
      />
      {/* <TextStream
        text="  THREE.JS · SHADER · CREATIVE CODING · GLSL ·  "
        y={0.85}
        speed={1.8}
        color="#7ad7ff"
      />
      <TextStream
        text="  IGLOO · STUDIO · MOTION · DESIGN · TYPESCRIPT ·  "
        y={-0.85}
        speed={2.1}
        color="#ffb37a"
      /> */}

      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.25}
          mipmapBlur
          kernelSize={KernelSize.LARGE}
        />
      </EffectComposer>
    </>
  )
}
