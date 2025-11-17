import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import { useNotification } from '../../contexts/NotificationContext'
import { useBlog } from '../../contexts/BlogContext'
import CustomSelect from '../../components/CustomSelect'
import './PostEditor.css'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  createdAt: string
}

export default function AdminPostEditor() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { categories, getPostById, addPost, updatePost, loadCategories } = useBlog()
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '開發者'
  })

  useEffect(() => {
    loadCategories()

    if (id) {
      const foundPost = getPostById(id)
      if (foundPost) {
        setPost(foundPost)
      }
    }
  }, [id, getPostById, loadCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!post.title || !post.content || !post.category) {
      showNotification({
        type: 'error',
        message: '請填寫所有必填欄位'
      })
      return
    }
    
    try {
      if (id) {
        await updatePost(id, {
          ...post,
          author: post.author || '開發者'
        })
        showNotification({
          type: 'success',
          message: '文章已更新'
        })
      } else {
        const newPost: Post = {
          ...post as Post,
          id: Math.random().toString(36).substr(2, 9),
          author: post.author || '開發者',
          createdAt: new Date().toISOString()
        }
        await addPost(newPost)
        showNotification({
          type: 'success',
          message: '文章已建立'
        })
      }
      navigate('/admin/posts')
    } catch (error) {
      showNotification({
        type: 'error',
        message: '操作失敗，請稍後再試'
      })
    }
  }

  const handleContentChange = (content: string) => {
    setPost({ ...post, content })
  }

  return (
    <div className="post-editor">
      <div className="page-header">
        <h1>{id ? '編輯文章' : '新增文章'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label htmlFor="title">標題 *</label>
          <input
            type="text"
            id="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="輸入文章標題"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">分類 *</label>
            <CustomSelect
              id="category"
              value={post.category || ''}
              onChange={(value) => setPost({ ...post, category: value })}
              options={[
                { value: '', label: '選擇分類' },
                ...categories.map(cat => ({ value: cat, label: cat }))
              ]}
              placeholder="選擇分類"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">作者</label>
            <input
              type="text"
              id="author"
              value={post.author || '開發者'}
              onChange={(e) => setPost({ ...post, author: e.target.value || '開發者' })}
              placeholder="開發者"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">內容 *</label>
          <ReactQuill
            theme="snow"
            value={post.content}
            onChange={handleContentChange}
            placeholder="輸入文章內容"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['blockquote', 'code-block'],
                ['clean']
              ]
            }}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/posts')} className="btn-secondary">
            取消
          </button>
          <button type="submit" className="btn-primary">
            {id ? '更新文章' : '發布文章'}
          </button>
        </div>
      </form>
    </div>
  )
}

