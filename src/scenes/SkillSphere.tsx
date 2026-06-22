import { useMemo, useRef, useState, useCallback } from 'react'
import { type ThreeEvent, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import {
  AdditiveBlending,
  Color,
  Euler,
  Matrix4,
  MathUtils,
  type Group,
  type Mesh,
} from 'three'

export type HoveredRing = {
  category: string
  skills: string[]
  color: string
}

type RingData = HoveredRing & {
  text: string
  tilt: [number, number, number]
  baseSpeed: number
}

export const RINGS: RingData[] = [
  {
    category: 'Web & Creative Coding',
    text: ' tcaeR ・ tpircSepyT ・',
    skills: ['React', 'TypeScript'],
    tilt: [0, 0, 0],
    baseSpeed: 0.28,
    color: '#ffffff',
  },
  {
    category: '3DCG & Motion',
    text: ' ・ evloseR icniVaD ・ iniduoH ・ rednelB',
    skills: ['Blender', 'Houdini', 'DaVinci Resolve'],
    tilt: [MathUtils.degToRad(58), 0, MathUtils.degToRad(15)],
    baseSpeed: -0.22,
    color: '#7ad7ff',
  },
  {
    category: 'Digital Fabrication',
    text: ' ・ retnirP VU ・ rettuC resaL ・ retnirP D3',
    skills: ['3D Printer', 'Laser Cutter', 'UV Printer'],
    tilt: [MathUtils.degToRad(-55), 0, MathUtils.degToRad(-18)],
    baseSpeed: 0.19,
    color: '#ffb37a',
  },
  {
    category: 'Backend & AI',
    text: ' ・ gnireenignE tpmorP ・ IPA opirT ・ IPA inimeG ・ ksalF ・ nohtyP',
    skills: ['Python', 'Flask', 'Gemini API', 'Tripo API', 'Prompt Engineering'],
    tilt: [MathUtils.degToRad(32), 0, MathUtils.degToRad(72)],
    baseSpeed: -0.16,
    color: '#b3ffa0',
  },
]

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

type RingProps = {
  data: RingData
  radius: number
  isHovered: boolean
}

function SkillTextRing({ data, radius, isHovered }: RingProps) {
  const outerRef = useRef<Group>(null!)
  const groupRef = useRef<Group>(null!)
  const speedRef = useRef(data.baseSpeed)
  const scaleRef = useRef(1.0)

  const chars = useMemo(() => Array.from(data.text), [data.text])
  const angleStep = useMemo(() => (Math.PI * 2) / chars.length, [chars.length])

  useFrame((_, delta) => {
    speedRef.current = MathUtils.lerp(speedRef.current, isHovered ? 0 : data.baseSpeed, 0.06)
    groupRef.current.rotation.y += delta * speedRef.current

    scaleRef.current = MathUtils.lerp(scaleRef.current, isHovered ? 1.07 : 1.0, 0.08)
    outerRef.current.scale.setScalar(scaleRef.current)
  })

  return (
    <group ref={outerRef} rotation={data.tilt}>
      <group ref={groupRef}>
        {chars.map((char, i) => {
          const theta = i * angleStep
          const x = radius * Math.cos(theta)
          const z = radius * Math.sin(theta)
          return (
            <Text
              key={i}
              position={[x, 0, z]}
              rotation={[0, Math.PI / 2 - theta, 0]}
              fontSize={0.3}
              color={isHovered ? '#ff7a2a' : data.color}
              outlineWidth={isHovered ? 0.018 : 0}
              outlineColor={data.color}
              anchorX="center"
              anchorY="middle"
            >
              {char}
            </Text>
          )
        })}
      </group>
    </group>
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
    meshRef.current.rotation.y += delta * 0.008
  })

  return (
    // raycast no-op so torus meshes are not occluded by the sphere
    <mesh ref={meshRef} raycast={() => {}}>
      <sphereGeometry args={[2.4, 96, 96]} />
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

type Props = {
  onHoverChange: (ring: HoveredRing | null) => void
}

export function SkillSphere({ onHoverChange }: Props) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const hoveredRef = useRef<string | null>(null)

  // 各リングの tilt の逆行列を事前計算
  const invMatrices = useMemo(() =>
    RINGS.map(ring => {
      const m = new Matrix4()
      m.makeRotationFromEuler(new Euler(...ring.tilt))
      return m.invert()
    }), [])

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()

    // ヒット点を各リング平面に投影し、最も近いリングを選ぶ
    let bestIdx = 0
    let minDist = Infinity
    for (let i = 0; i < RINGS.length; i++) {
      const local = e.point.clone().applyMatrix4(invMatrices[i])
      const dist = Math.abs(local.y)
      if (dist < minDist) { minDist = dist; bestIdx = i }
    }

    const ring = RINGS[bestIdx]
    if (ring.category !== hoveredRef.current) {
      hoveredRef.current = ring.category
      setHoveredCategory(ring.category)
      onHoverChange({ category: ring.category, skills: ring.skills, color: ring.color })
      document.body.style.cursor = 'pointer'
    }
  }, [invMatrices, onHoverChange])

  const handlePointerLeave = useCallback(() => {
    hoveredRef.current = null
    setHoveredCategory(null)
    onHoverChange(null)
    document.body.style.cursor = 'default'
  }, [onHoverChange])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 4]} intensity={1.2} />
      <pointLight position={[-4, -2, -4]} intensity={0.6} color="#5fb9ff" />

      <FresnelSphere />

      {/* 共有ヒットスフィア — リング全体を包む単一の不可視メッシュ */}
      <mesh onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <sphereGeometry args={[2.78, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {RINGS.map((ring) => (
        <SkillTextRing
          key={ring.category}
          data={ring}
          radius={2.64}
          isHovered={hoveredCategory === ring.category}
        />
      ))}

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.25}
          mipmapBlur
          kernelSize={KernelSize.LARGE}
        />
      </EffectComposer>
    </>
  )
}
