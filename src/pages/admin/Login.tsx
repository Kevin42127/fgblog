import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, login } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        showNotification({
          type: 'success',
          message: '登入成功'
        })
        navigate('/admin')
      } else {
        showNotification({
          type: 'error',
          message: '帳號或密碼錯誤'
        })
      }
    } catch (error) {
      showNotification({
        type: 'error',
        message: '登入失敗，請稍後再試'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="material-icons">lock</span>
          <h1>後台登入</h1>
          <p>請輸入您的帳號密碼</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <span className="material-icons">person</span>
              帳號
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="輸入帳號"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <span className="material-icons">lock</span>
              密碼
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="輸入密碼"
              required
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-icons">hourglass_empty</span>
                登入中...
              </>
            ) : (
              <>
                <span className="material-icons">login</span>
                登入
              </>
            )}
          </button>
        </form>
        <div className="login-footer">
          <a href="/">返回首頁</a>
        </div>
      </div>
    </div>
  )
}

