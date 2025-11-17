import { useEffect } from 'react'
import { useBlog } from '../../contexts/BlogContext'
import { useNotification } from '../../contexts/NotificationContext'
import { useConfirm } from '../../contexts/ConfirmContext'
import './Contacts.css'

export default function AdminContacts() {
  const { contactMessages, loadContactMessages, markContactMessageAsRead, deleteContactMessage, deleteAllContactMessages } = useBlog()
  const { showNotification } = useNotification()
  const { confirm } = useConfirm()

  useEffect(() => {
    loadContactMessages()
  }, [loadContactMessages])

  const handleRead = async (id: string) => {
    try {
      await markContactMessageAsRead(id)
      showNotification({
        type: 'success',
        message: '已標記為已讀'
      })
    } catch (error) {
      showNotification({
        type: 'error',
        message: '操作失敗，請稍後再試'
      })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await confirm({
      title: '刪除訊息',
      message: '確定要刪除這則聯絡訊息嗎？',
      confirmText: '刪除',
      cancelText: '取消'
    })
    if (result) {
      try {
        await deleteContactMessage(id)
        showNotification({
          type: 'success',
          message: '訊息已刪除'
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
    if (contactMessages.length === 0) {
      showNotification({
        type: 'error',
        message: '沒有可刪除的訊息'
      })
      return
    }
    const result = await confirm({
      title: '刪除所有訊息',
      message: `確定要刪除所有 ${contactMessages.length} 則聯絡訊息嗎？此操作無法復原！`,
      confirmText: '確定刪除',
      cancelText: '取消'
    })
    if (result) {
      try {
        await deleteAllContactMessages()
        showNotification({
          type: 'success',
          message: '所有訊息已刪除'
        })
      } catch (error) {
        showNotification({
          type: 'error',
          message: '操作失敗，請稍後再試'
        })
      }
    }
  }

  const unreadCount = contactMessages.filter(msg => !msg.read).length

  return (
    <div className="admin-contacts">
      <div className="page-header">
        <div>
          <h1>聯絡訊息</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} 則未讀</span>
          )}
        </div>
        {contactMessages.length > 0 && (
          <button onClick={handleDeleteAll} className="btn-delete-all">
            <span className="material-icons">delete_sweep</span>
            一鍵刪除全部
          </button>
        )}
      </div>
      {contactMessages.length === 0 ? (
        <div className="empty-state">
          <p>還沒有任何聯絡訊息</p>
        </div>
      ) : (
        <div className="contacts-list">
          {contactMessages.map((message) => (
            <div key={message.id} className={`contact-item ${!message.read ? 'unread' : ''}`}>
              <div className="contact-header-info">
                <div className="contact-sender">
                  <h3>{message.name}</h3>
                  <span className="contact-email">{message.email}</span>
                </div>
                <div className="contact-meta">
                  <span className="contact-date">
                    {new Date(message.createdAt).toLocaleString('zh-TW')}
                  </span>
                  {!message.read && <span className="unread-indicator">未讀</span>}
                </div>
              </div>
              {message.subject && (
                <div className="contact-subject">
                  <strong>主旨：</strong>{message.subject}
                </div>
              )}
              <div className="contact-message">
                {message.message}
              </div>
              <div className="contact-actions">
                {!message.read && (
                  <button 
                    onClick={() => handleRead(message.id)}
                    className="btn-mark-read"
                  >
                    標記為已讀
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(message.id)}
                  className="btn-delete"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

