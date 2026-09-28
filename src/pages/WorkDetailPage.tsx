import { useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmotionalMonsterMaker, { frontmatter as emmMeta } from '../works/emotional-monster-maker.mdx'
import { WorkDetailLayout, mdxComponents, type WorkDetailMeta } from '../components/works/WorkDetailLayout'

type Entry = {
  meta: WorkDetailMeta
  Content: typeof EmotionalMonsterMaker
}

const WORK_PAGES: Record<string, Entry> = {
  'emotional-monster-maker': { meta: emmMeta, Content: EmotionalMonsterMaker },
}

export function WorkDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const entry = WORK_PAGES[slug]

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(raf)
  }, [slug])

  if (!entry) {
    return (
      <div className="work-detail">
        <p>作品が見つかりませんでした。</p>
        <Link to="/" className="work-detail-back">← Back to home</Link>
      </div>
    )
  }

  const { meta, Content } = entry

  return (
    <>
      <WorkDetailLayout {...meta}>
        <Content components={mdxComponents} />
      </WorkDetailLayout>
      <div className="work-detail-footer">
        <Link to="/#projects" className="work-detail-back">Back to Projects</Link>
      </div>
    </>
  )
}
