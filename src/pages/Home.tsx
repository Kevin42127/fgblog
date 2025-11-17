import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBlog } from '../contexts/BlogContext'
import './Home.css'

export default function Home() {
  const { posts, loadPosts } = useBlog()

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="home">
      <div className="container">
        <div className="home-header">
          <h1>最新文章</h1>
        </div>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>還沒有任何文章</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-meta">
                  <span className="post-category">{post.category}</span>
                  <div className="post-meta-info">
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                    {post.viewCount !== undefined && post.viewCount > 0 && (
                      <span className="post-views">
                        <span className="material-icons">visibility</span>
                        {post.viewCount} 次瀏覽
                      </span>
                    )}
                  </div>
                </div>
                <h2 className="post-title">
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </h2>
                <Link to={`/post/${post.id}`} className="post-link">
                  閱讀更多
                  <span className="material-icons">arrow_forward</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

