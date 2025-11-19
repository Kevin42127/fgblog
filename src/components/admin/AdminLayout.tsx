import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import './AdminLayout.css'

export default function AdminLayout() {
  const location = useLocation()
  const { logout } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    showNotification({
      type: 'success',
      message: '已登出'
    })
    navigate('/admin/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="material-icons">dashboard</span>
          <h2>管理後台</h2>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${isActive('/admin') && !isActive('/admin/posts') && !isActive('/admin/categories') && !isActive('/admin/contacts') && !isActive('/admin/announcements') ? 'active' : ''}`}
          >
            <span>儀表板</span>
          </Link>
          <Link 
            to="/admin/posts" 
            className={`nav-item ${isActive('/admin/posts') ? 'active' : ''}`}
          >
            <span>文章管理</span>
          </Link>
          <Link 
            to="/admin/categories" 
            className={`nav-item ${isActive('/admin/categories') ? 'active' : ''}`}
          >
            <span>分類管理</span>
          </Link>
          <Link 
            to="/admin/announcements" 
            className={`nav-item ${isActive('/admin/announcements') ? 'active' : ''}`}
          >
            <span>公告管理</span>
          </Link>
          <Link 
            to="/admin/contacts" 
            className={`nav-item ${isActive('/admin/contacts') ? 'active' : ''}`}
          >
            <span>聯絡訊息</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="back-link">
            <span className="material-icons">arrow_back</span>
            <span>返回前台</span>
          </Link>
          <button onClick={handleLogout} className="logout-button">
            <span className="material-icons">logout</span>
            <span>登出</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

