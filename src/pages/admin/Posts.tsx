import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotification } from '../../contexts/NotificationContext'
import { useBlog } from '../../contexts/BlogContext'
import { useConfirm } from '../../contexts/ConfirmContext'
import './Posts.css'

export default function AdminPosts() {
  const { posts, loadPosts, deletePost, deleteAllPosts } = useBlog()
  const { showNotification } = useNotification()
  const { confirm } = useConfirm()

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleDelete = async (id: string) => {
    const result = await confirm({
      title: '刪除文章',
      message: '確定要刪除這篇文章嗎？',
      confirmText: '刪除',
      cancelText: '取消'
    })
    if (result) {
      try {
        await deletePost(id)
        showNotification({
          type: 'success',
          message: '文章已刪除'
        })
      } catch (error) {
        showNotification({
          type: 'error',
          message: '操作失敗，請稍後再試'
        })
      }
    }
  }

  const handleDeleteAll = async () => {
    if (posts.length === 0) {
      showNotification({
        type: 'error',
        message: '沒有可刪除的文章'
      })
      return
    }
    const result = await confirm({
      title: '刪除所有文章',
      message: `確定要刪除所有 ${posts.length} 篇文章嗎？此操作無法復原！`,
      confirmText: '確定刪除',
      cancelText: '取消'
    })
    if (result) {
      try {
        await deleteAllPosts()
        showNotification({
          type: 'success',
          message: '所有文章已刪除'
        })
      } catch (error) {
        showNotification({
          type: 'error',
          message: '操作失敗，請稍後再試'
        })
      }
    }
  }

  return (
    <div className="admin-posts">
      <div className="page-header">
        <h1>文章管理</h1>
        <div className="header-actions">
          {posts.length > 0 && (
            <button onClick={handleDeleteAll} className="btn-delete-all">
              <span className="material-icons">delete_sweep</span>
              一鍵刪除全部
            </button>
          )}
          <Link to="/admin/posts/new" className="btn-primary">
            <span className="material-icons">add</span>
            新增文章
          </Link>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">article</span>
          <p>還沒有任何文章</p>
          <Link to="/admin/posts/new" className="btn-primary">
            建立第一篇文章
          </Link>
        </div>
      ) : (
        <div className="posts-table">
          <table>
            <thead>
              <tr>
                <th>標題</th>
                <th>分類</th>
                <th>建立日期</th>
                <th>作者</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/admin/posts/edit/${post.id}`} className="post-title-link">
                      {post.title}
                    </Link>
                  </td>
                  <td>
                    <span className="category-badge">{post.category}</span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString('zh-TW')}</td>
                  <td>{post.author}</td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/admin/posts/edit/${post.id}`} 
                        className="action-btn edit"
                      >
                        <span className="material-icons">edit</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="action-btn delete"
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

