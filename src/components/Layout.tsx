import { useEffect, useRef, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import './Layout.css'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuOpen) return
      const target = event.target as Node
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span>FG_飛龍</span>
          </Link>
          <button
            ref={toggleRef}
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="選單"
          >
            <span className="material-icons">{menuOpen ? 'close' : 'menu'}</span>
          </button>
          <nav ref={navRef} className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link to="/" onClick={closeMenu}>首頁</Link>
            <Link to="/contact" onClick={closeMenu}>聯絡我們</Link>
            <Link to="/privacy" onClick={closeMenu}>隱私條款</Link>
            <Link to="/terms" onClick={closeMenu}>服務條款</Link>
            <Link to="/admin/login" onClick={closeMenu}>開發者登入</Link>
            <a
              href="https://www.dcard.tw/@abc_0"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-link"
              onClick={closeMenu}
            >
              Dcard
            </a>
            <a
              href="https://github.com/Kevin42127/fgblog"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-link"
              onClick={closeMenu}
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>
              <span>©</span> FG_飛龍
            </p>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  )
}

