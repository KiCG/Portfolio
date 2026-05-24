import { useEffect, useRef } from 'react'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/KiCG', icon: '↗' },
  { label: 'Twitter / X', href: 'https://x.com/Kicg_0609', icon: '↗' },
  { label: 'Instagram', href: 'https://www.instagram.com/ryusei_6743/?hl=ja', icon: '↗' },
]

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('contact--visible')
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="contact" ref={sectionRef} id="contact">
      <header className="contact-header">
        <p className="contact-label">Get In Touch</p>
        <h2 className="contact-title">Contact</h2>
      </header>

      <div className="contact-body">
        <div className="contact-left">
          <p className="contact-desc">                                                            
          WebGL・3DCG・デジタルファブリケーションを組み合わせた表現に取り組んでいます。<br />   
          お気軽にご連絡ください。                                                              
          </p> 
          <a className="contact-email" href="mailto:kishi.ryusei69@gmail.com">
            kishi.ryusei69@gmail.com
          </a>
        </div>

        <ul className="contact-links">
          {LINKS.map(({ label, href, icon }) => (
            <li key={label} className="contact-link-item">
              <a className="contact-link" href={href} target="_blank" rel="noopener noreferrer">
                <span className="contact-link-label">{label}</span>
                <span className="contact-link-icon">{icon}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
