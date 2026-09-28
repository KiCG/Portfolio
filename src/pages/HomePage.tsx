import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { FlowingSphereText } from '../scenes/FlowingSphereText'
import { AboutSection } from '../components/AboutSection'
import { WorksSection } from '../components/WorksSection'
import { ContactSection } from '../components/ContactSection'

export function HomePage() {
  const isMobile = window.innerWidth < 768
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    // 遷移直後は該当セクションが未マウントなことがあるので次フレームで待つ
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [location.hash])

  return (
    <>
      <section className="hero" id="top">
        <Canvas
          camera={{ position: [0, 1.2, isMobile ? 10 : 6], fov: 50, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#05060c']} />
          <fog attach="fog" args={['#05060c', 8, 22]} />
          <FlowingSphereText />
        </Canvas>

        <div className="scroll-hint">
          <span>scroll</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M8 2v12M3 9l5 5 5-5" />
          </svg>
        </div>
      </section>

      <AboutSection />
      <WorksSection />
      <ContactSection />
    </>
  )
}
