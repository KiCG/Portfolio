import { Canvas } from '@react-three/fiber'
import { FlowingSphereText } from './scenes/FlowingSphereText'
import { AboutSection } from './components/AboutSection'
import { WorksSection } from './components/WorksSection'
import { ContactSection } from './components/ContactSection'
import { Header } from './components/Header'
import './App.css'

export default function App() {
  const isMobile = window.innerWidth < 768
  return (
    <>
      <Header />
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
