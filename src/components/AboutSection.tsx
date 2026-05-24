import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { SkillSphere, RINGS, type HoveredRing } from '../scenes/SkillSphere'

const CAREER = [
  { period: '2026',            role: 'Kyoto Micro Maker Faire 2026',      place: 'Emotional Monster Marker 出展 (研究室プロジェクト）' },
  { period: '2025',            role: 'TeraCoder 2025',                    place: 'CyberAgent賞 受賞' },
  { period: '2025 — Present',  role: '伊藤慎一郎研究室',                    place: 'インクルーシブデザイン・デジタルファブリケーション' },
  { period: '2025',            role: 'ボカコレ 2025 夏',                    place: 'まるで檻のような 投稿' },
  { period: '2025',            role: 'Bitsummit 2025',                    place: 'Phantom Mirror 出展' },
  { period: '2025',            role: 'KC3 Hack 2025',                     place: 'Konamono Master 出展' },
  { period: '2023 — Present',  role: '電子計算機応用部',                     place: 'CG班 チーフ / モデリングコンテスト 2025春 優勝' },
  { period: '2023 — Present',  role: '京都産業大学 情報理工学部',             place: '入学' },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null!)
  const [hoveredRing, setHoveredRing] = useState<HoveredRing | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) sectionRef.current.classList.add('about--visible')
      },
      { threshold: 0.1 },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const isMobile = window.innerWidth < 768

  const handleHoverChange = useCallback((ring: HoveredRing | null) => {
    setHoveredRing(ring)
  }, [])

  return (
    <section ref={sectionRef} className="about" id="about">
      <header className="about-header">
        <p className="about-label">About</p>
        <h2 className="about-title">Who I am</h2>
      </header>

      <div className="about-body">
        {/* ── Left ── */}
        <div className="about-left">
          <div className="about-photo">
            {/* 写真を <img src="..." alt="..." /> に差し替えてください */}
              <div className="about-photo">
                <img src="/photo.png" alt="Ryusei Kishi" />
              </div>
          </div>
          <div className="about-identity">
            <p className="about-name">Ryusei Kishi</p>
            <p className="about-role">Creative Technologist</p>
            <p className="about-comment">
              "技術の『合理』とアートの『非合理』を編み上げ、体験をデザインする"
            </p>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="about-right">
          <div className="about-block">
            <p className="about-block-label">History</p>
            <ul className="about-career">
              {CAREER.map(({ period, role, place }) => (
                <li key={period} className="about-career-item">
                  <span className="about-career-period">{period}</span>
                  <span className="about-career-role">{role}</span>
                  <span className="about-career-place">{place}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-block">
            <p className="about-block-label">Profile</p>
            <p className="about-profile">
                大学では「プログラミング」と「3DCG」を軸に活動しています。授業では触れられない <br />          
                3DCGを独学で（Blenderを中心に）習得する一方、競技プログラミング（AtCoder 茶色）やPythonを用いた <br />         
                ツール・プロダクト開発にも取り組んできました。 <br />                                       
                <br />
                情報系のバックグラウンドを持ちながらアート制作にも深く携わってきた経験から、 <br />           
                エンジニアリングとクリエイティブの両側面を持つプロダクト開発を得意としています。 <br />
            </p>
          </div>
        </div>
      </div>

      {/* ── Skill Set ── */}
      <div className="about-skills">
        <p className="about-block-label about-block-label--white">Skill Set</p>
        <div className="about-skill-wrap">

          <Canvas
            className="about-skill-canvas"
            camera={{ position: [1.4, 0, isMobile ? 10 : 6.5], fov: 50, near: 0.1, far: 60 }}
            dpr={[1, 2]}
          >
            <color attach="background" args={['#05060c']} />
            <SkillSphere onHoverChange={handleHoverChange} />
          </Canvas>

          <div className="skill-panel">
            {RINGS.map((ring) => {
              const isActive  = hoveredRing?.category === ring.category
              const isDimmed  = hoveredRing !== null && !isActive
              return (
                <div
                  key={ring.category}
                  className={`skill-group ${isActive ? 'skill-group--active' : ''} ${isDimmed ? 'skill-group--dimmed' : ''}`}
                >
                  <p className="skill-group-category" style={{ color: ring.color }}>
                    {ring.category}
                  </p>
                  <ul className="skill-group-tags">
                    {ring.skills.map((s) => (
                      <li
                        key={s}
                        className="skill-group-tag"
                        style={{ borderColor: `${ring.color}26` }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
