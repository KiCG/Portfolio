import type { ReactNode } from 'react'

export type WorkDetailMeta = {
  title: string
  tools: string[]
  category: string
  year?: string | number
}

type LayoutProps = WorkDetailMeta & {
  children: ReactNode
}

export function WorkDetailLayout({ title, tools, category, year, children }: LayoutProps) {
  return (
    <article className="work-detail">
      <header className="work-detail-header">
        <h1 className="work-detail-title">{title}</h1>
        <dl className="work-detail-meta">
          <div className="work-detail-meta-row">
            <dt>Category</dt>
            <dd>{category}</dd>
          </div>
          <div className="work-detail-meta-row">
            <dt>Tools</dt>
            <dd>{tools.join(' / ')}</dd>
          </div>
          {year !== undefined && (
            <div className="work-detail-meta-row">
              <dt>Year</dt>
              <dd>{year}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="work-detail-body">{children}</div>
    </article>
  )
}

export function TwoColumn({ children }: { children: ReactNode }) {
  return <div className="work-detail-two-col">{children}</div>
}

export function Column({ children }: { children: ReactNode }) {
  return <div className="work-detail-two-col-item">{children}</div>
}

export const mdxComponents = {
  TwoColumn,
  Column,
}
