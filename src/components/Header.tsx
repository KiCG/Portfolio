function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Header() {
  return (
    <header className="site-header">
      <button
        className="site-header-logo"
        onClick={() => scrollTo('top')}
      >
        Ryusei Kishi
      </button>
      <nav className="site-header-nav">
        <button className="site-header-link" onClick={() => scrollTo('about')}>About</button>
        <button className="site-header-link" onClick={() => scrollTo('projects')}>Projects</button>
        <button className="site-header-link" onClick={() => scrollTo('contact')}>Contact</button>
      </nav>
    </header>
  )
}
