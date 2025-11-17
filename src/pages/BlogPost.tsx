import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useBlog } from '../contexts/BlogContext'
import './BlogPost.css'

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()
  const { posts, getPostById, loadPosts, incrementViewCount } = useBlog()
  const post = id ? getPostById(id) : undefined
  const hasIncremented = useRef(false)

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  useEffect(() => {
    hasIncremented.current = false
  }, [id])

  useEffect(() => {
    if (id && post && !hasIncremented.current) {
      incrementViewCount(id).catch(console.error)
      hasIncremented.current = true
    }
  }, [id, post, incrementViewCount])

  if (!post) {
    return (
      <div className="blog-post">
        <div className="container">
          <div className="not-found">
            <span className="material-icons">error_outline</span>
            <h2>文章不存在</h2>
            <p>找不到這篇文章</p>
          </div>
        </div>
      </div>
    )
  }

  const currentIndex = posts.findIndex(item => item.id === post.id)
  const previousPost = currentIndex !== -1 && currentIndex < posts.length - 1
    ? posts[currentIndex + 1]
    : undefined
  const nextPost = currentIndex > 0
    ? posts[currentIndex - 1]
    : undefined

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="blog-post">
      <article className="post-content">
        <div className="post-header">
          <span className="post-category">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>{post.author}</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.viewCount !== undefined && post.viewCount > 0 && (
              <span className="post-views">
                <span className="material-icons">visibility</span>
                {post.viewCount} 次瀏覽
              </span>
            )}
          </div>
        </div>
        <div 
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      {(previousPost || nextPost) && (
        <div className="post-navigation">
          {previousPost && (
            <Link
              to={`/post/${previousPost.id}`}
              className="nav-circle prev"
              aria-label={`上一篇：${previousPost.title}`}
            >
              <span className="material-icons">arrow_back</span>
            </Link>
          )}
          {nextPost && (
            <Link
              to={`/post/${nextPost.id}`}
              className="nav-circle next"
              aria-label={`下一篇：${nextPost.title}`}
            >
              <span className="material-icons">arrow_forward</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

