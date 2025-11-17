import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import './Layout.css'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span>FG_飛龍</span>
          </Link>
          <button className="menu-toggle" onClick={toggleMenu} aria-label="選單">
            <span className="material-icons">{menuOpen ? 'close' : 'menu'}</span>
          </button>
          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link to="/" onClick={closeMenu}>首頁</Link>
            <Link to="/contact" onClick={closeMenu}>聯絡我們</Link>
            <Link to="/privacy" onClick={closeMenu}>隱私條款</Link>
            <Link to="/terms" onClick={closeMenu}>服務條款</Link>
            <Link to="/admin/login" onClick={closeMenu}>開發者登入</Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>
            <span>©</span> FG_飛龍
          </p>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  )
}

