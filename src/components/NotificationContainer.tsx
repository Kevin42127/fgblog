import { useEffect, useRef } from 'react'
import './NotificationContainer.css'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export default function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const lastNotification = container.lastElementChild as HTMLElement
      if (lastNotification) {
        setTimeout(() => {
          lastNotification.style.transform = 'translateX(0)'
          lastNotification.style.opacity = '1'
        }, 10)
      }
    }
  }, [notifications])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check_circle'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'info'
    }
  }

  return (
    <div ref={containerRef} className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => onRemove(notification.id)}
        >
          <span className="material-icons">{getIcon(notification.type)}</span>
          <span className="notification-message">{notification.message}</span>
          <button className="notification-close" onClick={(e) => {
            e.stopPropagation()
            onRemove(notification.id)
          }}>
            <span className="material-icons">close</span>
          </button>
        </div>
      ))}
    </div>
  )
}

