import { useLocation, useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const goToAnchor = (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate(`/#${id}`)
  }

  return (
    <header className="site-header">
      <button
        className="site-header-logo"
        onClick={() => goToAnchor('top')}
      >
        Ryusei Kishi
      </button>
      <nav className="site-header-nav">
        <button className="site-header-link" onClick={() => goToAnchor('about')}>About</button>
        <button className="site-header-link" onClick={() => goToAnchor('projects')}>Projects</button>
        <button className="site-header-link" onClick={() => goToAnchor('contact')}>Contact</button>
      </nav>
    </header>
  )
}
