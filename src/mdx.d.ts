declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { MDXProps } from 'mdx/types'

  export type WorkFrontmatter = {
    title: string
    tools: string[]
    category: string
    thumbnail: string
    year?: string | number
  }

  export const frontmatter: WorkFrontmatter
  const MDXComponent: ComponentType<MDXProps>
  export default MDXComponent
}
