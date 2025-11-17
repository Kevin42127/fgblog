import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <span className="material-icons">error_outline</span>
          </div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">頁面不存在</h2>
          <p className="not-found-description">
            抱歉，您訪問的頁面不存在或已被移除。
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn-primary">
              <span className="material-icons">home</span>
              返回首頁
            </Link>
            <Link to="/contact" className="btn-secondary">
              <span className="material-icons">mail</span>
              聯絡我們
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

