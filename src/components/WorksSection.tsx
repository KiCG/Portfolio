import { useEffect, useRef, useState, useCallback } from 'react'

const WORKS = [
  {
    id: '01', title: 'Emotional Monster Maker',    category: 'Blender · Gemini API · 3D Print',  year: '2026',
    image: 'Emotional_Monster_Maker.png', featured: true,
    description: 'ユーザーの感情入力から Gemini API でモンスターのコンセプトを生成し、Tripo API で 3D 化、さらに 3Dプリンタで物理出力するインタラクティブ作品。Kyoto Micro Maker Faire 2026にて伊藤研究室のプロジェクトとして出展。',
    github: 'https://github.com/KiCG/Emotional-Monster-Maker', live: '', notion: 'https://www.notion.so/Emotional-Monster-Marker-348c905aa6c18068bd59c784ff65f0ae',
  },
  {
    id: '02', title: 'Ichigo Ichie',                category: 'React',                            year: '2026',
    image: 'Ichigo_Ichie.png', featured: false,
    description: '以前に撮影した写真と同じ画角で撮影すると、過去に自分が残したメッセージを読むことができる、思い出追体験アプリ。個人で使えば自分宛のタイムカプセルとして機能する。複数人で使う場合、メッセージを完全に閲覧するには投稿者と同じ場所・画角を体験する必要があり、傍観者になりがちな現代のSNSに対するアンチテーゼでもある。',
    github: 'https://github.com/KiCG/Ichigo-Ichie', live: '', notion: '',
  },
  {
    id: '03', title: 'Konamono Master',             category: 'Flask · Gemini API · Python',      year: '2025',
    image: 'judge_app.png', featured: true,
    description: 'どんなモノでも粉物であるとこじつけてくれるジョークアプリ。KC3 Hack 2025に出展。バックエンドのGemini API部分を担当。',
    github: 'https://github.com/kc3hack/2025_14', live: '', notion: 'https://www.notion.so/KonamonoMaster-KC3Hack2025-27fc905aa6c18024b7e9f1bc0a9df86e',
  },
  {
    id: '04', title: 'Project Bundler',             category: 'Blender Add-on · Python',          year: '2026',
    image: 'Project_Bundler.png', featured: false,
    description: '現在使用しているBlenderファイル + 外部参照テクスチャ等の依存ファイルを1つにまとめて配布・アーカイブできるBlenderアドオン。外部参照テクスチャ群を アンダースコア(_)までの接頭辞でフォルダにまとめるなど、いくつかのルールベースでスマートフォルダ機能を持つ。',
    github: 'https://github.com/KiCG/ProjectBundler', live: '', notion: '',
  },
  {
    id: '05', title: 'まるで檻のような',    category: 'Blender',                          year: '2025',
    image: 'vocacolle.png', featured: true,
    description: 'BlenderとDaVinci Resolveで制作したMV。ボカコレ2025夏に「まるで檻のような」として投稿。作詞作曲から全てチームで作成しており、3DCG部分を全て担当。',
    github: '', live: 'https://www.nicovideo.jp/watch/sm45321424', notion: '',
  },
  {
    id: '06', title: 'Castle',                      category: 'Blender',                          year: '2025',
    image: 'castle.png', featured: false,
    description: 'Blenderで制作した城のモデリング・レンダリング作品。雪が完全に積もった雪山ではなく、部分的にしか積もっていない不完全な雪山を作ることにこだわっている。それを実現するために、法線ベクトルの垂直成分を抽出しプロシージャルマスクを作成し、雪の積もり方をプロシージャルにコントロールしている。',
    github: '', live: '', notion: 'https://app.notion.com/p/Castle-27fc905aa6c18051ad4cc793ef889d70',
  },
  {
    id: '07', title: 'GeoAnimation',                category: 'Blender',                          year: '2025',
    image: 'geoanim.png', featured: false,
    description: 'Blenderのジオメトリノードを活用したプロシージャルアニメーション作品。インスタンスとして配置している立方体のスケールを、波テクスチャ(Sin波)とノイズテクスチャのハイブリッドでコントロールしており、規則性の中に現れる不規則性によりビジュアルとして面白いものになるように設計している。',
    github: '', live: '', notion: 'https://www.notion.so/GeoAnimation-2f1c905aa6c1801781c4e2decef39df7',
  },
  {
    id: '08', title: 'Valentine Cake',              category: 'Blender',                          year: '2026',
    image: 'cake.png', featured: false,
    description: 'Blenderで制作したバレンタインケーキのモデリング・レンダリング作品。クランチの作成に、ボロノイ分割した立方体をインスタンスとして配置している。また、クランチのカラーバリエーションをつけるために、インスタンスごとに割り振られた0~1の乱数とベースカラーを乗算している。',
    github: '', live: '', notion: 'https://www.notion.so/Valentine-2f1c905aa6c180168ea0d8525081f599',
  },
  {
    id: '09', title: 'Phantom Mirror',               category: 'Unreal Engine · Blender',          year: '2025',
    image: 'PhantomMirror.png', featured: true,
    description: 'Unreal EngineとBlenderで制作したゲーム「Phantom Mirror」。Bitsummit 2025に出展。プロップと敵キャラクターのモデリング、アニメーションを担当。',
    github: '', live: 'https://bitsummit-gamejam.itch.io/phantommirror', notion: 'https://www.notion.so/PhantomMirror-BitSummit2025-27fc905aa6c1801b9fe3d7c6a7da775a',
  },
  {
    id: '10', title: 'K-step Getter',               category: 'Blender · DaVinci Resolve',        year: '2026',
    image: 'gacha.png', featured: false,
    description: 'BlenderとDaVinci Resolveで制作したガチャ画面のイメージ。階段を登ることによってガチャを引けるというコンセプトのアプリを想定して作成。',
    github: '', live: '', notion: '',
  },
  // {
  //   id: '11', title: 'Reflecting Cubes',            category: 'Houdini · VEX',                    year: '2024',
  //   image: 'Reflecting_Cubes.png', featured: false,
  //   description: 'HoudiniのVEXを使用して制作した反射するキューブのプロシージャルシミュレーション。',
  //   github: '', live: 'https://vimeo.com/1123445679', notion: '',
  // },
  {
    id: '12', title: 'Lantern',         category: '3D Print · Laser · UV Print',      year: '2024',
    image: 'lantern.png', featured: false,
    description: '3Dプリント・レーザーカット・UVプリントを組み合わせたデジタルファブリケーション作品。中に市販のLEDキャンドルをセッティングし、お手軽な照明器具として利用できる。',
    github: '', live: '', notion: '',
  },
  {
    id: '13', title: 'Pumpkin',         category: '3D Print',      year: '2023',
    image: 'pumpkin.png', featured: false,
    description: '3Dプリントを用いたデジタルファブリケーション作品。ジャック・オ・ランタンをモチーフにシンプルなオブジェクトを作成。ギミックとして、真ん中部分にジョイントが作成してあり、上半分と下半分を取り外すことができる。',
    github: '', live: '', notion: '',
  },
  {
    id: '14', title: 'New Year',         category: 'Laser Cutter',      year: '2023',
    image: 'newyear.png', featured: false,
    description: 'レーザーカッターを用いたデジタルファブリケーション作品。お正月や初日の出をモチーフに作成。3枚のMDF板をコルク板にジョイントすることで、一枚の立体的な絵のような作品になっている。',
    github: '', live: '', notion: '',
  },
]

const FEATURED = WORKS.filter(w => w.featured)
const MORE     = WORKS.filter(w => !w.featured)

type Work = typeof WORKS[number]

function WorkModal({ work, onClose }: { work: Work; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const hasLinks = work.github || work.live || work.notion

  return (
    <div className="works-modal-overlay" onClick={onClose}>
      <div className="works-modal" onClick={e => e.stopPropagation()}>
        <button className="works-modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
        <div className="works-modal-scroll">
          {work.image && (
            <div className="works-modal-image">
              <img src={work.image} alt={work.title} />
            </div>
          )}
          <div className="works-modal-body">
            <div className="works-modal-meta">
              <span className="works-modal-id">{work.id}</span>
              <span className="works-modal-year">{work.year}</span>
            </div>
            <h2 className="works-modal-title">{work.title}</h2>
            <p className="works-modal-category">{work.category}</p>
            {work.description && (
              <p className="works-modal-desc">{work.description}</p>
            )}
            {hasLinks && (
              <div className="works-modal-links">
                {work.notion && (
                  <a href={work.notion} target="_blank" rel="noopener noreferrer" className="works-modal-link works-modal-link--primary">
                    詳細<span className="works-modal-link-arrow"> ↗</span>
                  </a>
                )}
                {work.live && (
                  <a href={work.live} target="_blank" rel="noopener noreferrer" className="works-modal-link">
                    Live<span className="works-modal-link-arrow"> ↗</span>
                  </a>
                )}
                {work.github && (
                  <a href={work.github} target="_blank" rel="noopener noreferrer" className="works-modal-link">
                    GitHub<span className="works-modal-link-arrow"> ↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkCard({
  work,
  cardRef,
  index,
  onClick,
}: {
  work: Work
  cardRef: (el: HTMLLIElement | null) => void
  index: number
  onClick: () => void
}) {
  const { id, title, category, year, image } = work
  return (
    <li
      ref={cardRef}
      className="works-card"
      style={{ transitionDelay: `${index * 60}ms` }}
      onClick={onClick}
    >
      <div className="works-card-image">
        {image
          ? <img src={image} alt={title} />
          : <span className="works-card-image-placeholder">{id}</span>
        }
      </div>
      <div className="works-card-footer">
        <div className="works-card-body">
          <h3 className="works-card-title">{title}</h3>
          <p className="works-card-meta">
            <span className="works-card-category">{category}</span>
            <span className="works-card-year">{year}</span>
          </p>
        </div>
        <span className="works-card-arrow">↗</span>
      </div>
    </li>
  )
}

export function WorksSection() {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  const handleClose = useCallback(() => setSelectedWork(null), [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).style.opacity = '1'
            ;(entry.target as HTMLElement).style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.15 },
    )
    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="works" id="projects">
      <header className="works-header">
        <p className="works-label">Selected Works</p>
        <h2 className="works-title">Projects</h2>
      </header>

      <p className="works-subtitle">Featured</p>
      <ul className="works-grid works-grid--featured">
        {FEATURED.map((w, i) => (
          <WorkCard
            key={w.id}
            work={w}
            index={i}
            cardRef={(el) => { itemRefs.current[i] = el }}
            onClick={() => setSelectedWork(w)}
          />
        ))}
      </ul>

      <p className="works-subtitle works-subtitle--more">More Works</p>
      <ul className="works-grid works-grid--compact">
        {MORE.map((w, i) => (
          <WorkCard
            key={w.id}
            work={w}
            index={i}
            cardRef={(el) => { itemRefs.current[FEATURED.length + i] = el }}
            onClick={() => setSelectedWork(w)}
          />
        ))}
      </ul>

      {selectedWork && (
        <WorkModal work={selectedWork} onClose={handleClose} />
      )}
    </section>
  )
}
