import { useEffect, useMemo, useState } from 'react'
import { useBlog, Announcement } from '../contexts/BlogContext'
import './AnnouncementBanner.css'

const STORAGE_KEY = 'fg_announcement_dismissed'

const getLocalValue = (value: string | null) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

const getActiveAnnouncement = (announcements: Announcement[], dismissedId: string | null) => {
  const now = Date.now()
  return announcements
    .filter((item) => {
      if (!item.isActive || !item.isBanner) return false
      if (dismissedId && item.id === dismissedId) return false
      const start = getLocalValue(item.startAt) ?? 0
      const end = getLocalValue(item.endAt)
      if (start > now) return false
      if (end && end < now) return false
      return true
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      const startA = getLocalValue(a.startAt) ?? 0
      const startB = getLocalValue(b.startAt) ?? 0
      return startB - startA
    })[0] || null
}

export default function AnnouncementBanner() {
  const { announcements } = useBlog()
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    setDismissedId(stored)
  }, [])

  const activeAnnouncement = useMemo(
    () => getActiveAnnouncement(announcements, dismissedId),
    [announcements, dismissedId]
  )

  if (!activeAnnouncement) {
    return null
  }

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, activeAnnouncement.id)
    }
    setDismissedId(activeAnnouncement.id)
  }

  return (
    <div className={`announcement-banner theme-${activeAnnouncement.theme}`}>
      <div className="banner-content">
        <div className="banner-icon">
          <span className="material-icons">campaign</span>
        </div>
        <div className="banner-text">
          <p className="banner-title">{activeAnnouncement.title}</p>
          <p className="banner-message">{activeAnnouncement.message}</p>
        </div>
        <button
          type="button"
          className="banner-close"
          onClick={handleDismiss}
          aria-label="關閉公告"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  )
}

