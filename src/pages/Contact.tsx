import { useState } from 'react'
import { useNotification } from '../contexts/NotificationContext'
import { useBlog } from '../contexts/BlogContext'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const { showNotification } = useNotification()
  const { addContactMessage } = useBlog()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showNotification({
        type: 'error',
        message: '請填寫所有必填欄位'
      })
      return
    }

    addContactMessage(formData)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    showNotification({
      type: 'success',
      message: '訊息已送出，我們會盡快回覆您'
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="contact">
      <div className="container">
        <div className="contact-header">
          <h1>聯絡我們</h1>
          <p>有任何問題或建議，歡迎與我們聯繫</p>
        </div>
        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">姓名 <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">電子郵件 <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">主旨</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">訊息內容 <span className="required">*</span></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={8}
                required
              />
            </div>
            <button type="submit" className="btn-submit">
              送出訊息
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

