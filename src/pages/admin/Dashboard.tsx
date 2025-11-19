import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBlog } from '../../contexts/BlogContext'
import './Dashboard.css'

export default function AdminDashboard() {
  const { posts, categories, loadPosts, loadCategories } = useBlog()

  useEffect(() => {
    loadPosts()
    loadCategories()
  }, [loadPosts, loadCategories])

  const recentPosts = posts.slice(0, 5)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>儀表板</h1>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>總文章數</h3>
            <p className="stat-number">{posts.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>分類數</h3>
            <p className="stat-number">{categories.length}</p>
          </div>
        </div>
      </div>
      <div className="recent-section">
        <div className="section-header">
          <h2>最近文章</h2>
          <Link to="/admin/posts/new" className="btn-primary">
            <span className="material-icons">add</span>
            新增文章
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="empty-state">
            <p>還沒有任何文章</p>
            <Link to="/admin/posts/new" className="btn-primary">
              建立第一篇文章
            </Link>
          </div>
        ) : (
          <div className="recent-posts">
            {recentPosts.map((post) => (
              <div key={post.id} className="recent-post-item">
                <div className="post-info">
                  <h3>{post.title}</h3>
                  <p className="post-meta">
                    {new Date(post.createdAt).toLocaleDateString('zh-TW')} • {post.category}
                  </p>
                </div>
                <Link to={`/admin/posts/edit/${post.id}`} className="edit-btn">
                  <span className="material-icons">edit</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

