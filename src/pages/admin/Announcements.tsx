import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { useBlog, Announcement, AnnouncementInput } from '../../contexts/BlogContext'
import { useNotification } from '../../contexts/NotificationContext'
import { useConfirm } from '../../contexts/ConfirmContext'
import './Announcements.css'

type AnnouncementFormState = {
  title: string
  message: string
  startAt: string
  endAt: string
  isActive: boolean
  isBanner: boolean
  priority: number
  theme: AnnouncementInput['theme']
}

const getLocalDateInput = (value: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

const toISODate = (value: string) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

const getDefaultForm = (): AnnouncementFormState => ({
  title: '',
  message: '',
  startAt: getLocalDateInput(new Date().toISOString()),
  endAt: '',
  isActive: true,
  isBanner: true,
  priority: 1,
  theme: 'accent'
})

export default function AdminAnnouncements() {
  const {
    announcements,
    loadAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    deleteAllAnnouncements
  } = useBlog()
  const { showNotification } = useNotification()
  const { confirm } = useConfirm()

  const [formState, setFormState] = useState<AnnouncementFormState>(getDefaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadAnnouncements()
  }, [loadAnnouncements])

  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority
        return new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
      }),
    [announcements]
  )

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'priority' ? Number(value) : value
    }))
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setFormState((prev) => ({
      ...prev,
      [name]: checked
    }))
  }

  const resetForm = () => {
    setFormState(getDefaultForm())
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!formState.title.trim() || !formState.message.trim() || !formState.startAt) {
      showNotification({
        type: 'error',
        message: '請完整填寫公告標題、內容與開始時間'
      })
      return
    }

    if (formState.endAt && new Date(formState.endAt).getTime() < new Date(formState.startAt).getTime()) {
      showNotification({
        type: 'error',
        message: '結束時間不得早於開始時間'
      })
      return
    }

    const payload: AnnouncementInput = {
      title: formState.title.trim(),
      message: formState.message.trim(),
      startAt: toISODate(formState.startAt) || new Date().toISOString(),
      endAt: toISODate(formState.endAt),
      isActive: formState.isActive,
      isBanner: formState.isBanner,
      priority: formState.priority,
      theme: formState.theme
    }

    try {
      setIsSubmitting(true)
      if (editingId) {
        await updateAnnouncement(editingId, payload)
        showNotification({
          type: 'success',
          message: '公告已更新'
        })
      } else {
        await addAnnouncement(payload)
        showNotification({
          type: 'success',
          message: '公告已新增'
        })
      }
      resetForm()
    } catch {
      showNotification({
        type: 'error',
        message: '操作失敗，請稍後再試'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id)
    setFormState({
      title: announcement.title,
      message: announcement.message,
      startAt: getLocalDateInput(announcement.startAt),
      endAt: getLocalDateInput(announcement.endAt),
      isActive: announcement.isActive,
      isBanner: announcement.isBanner,
      priority: announcement.priority,
      theme: announcement.theme
    })
  }

  const handleDelete = async (id: string) => {
    const result = await confirm({
      title: '刪除公告',
      message: '確定要刪除這則公告嗎？',
      confirmText: '刪除',
      cancelText: '取消'
    })
    if (!result) return
    try {
      await deleteAnnouncement(id)
      showNotification({
        type: 'success',
        message: '公告已刪除'
      })
      if (editingId === id) {
        resetForm()
      }
    } catch {
      showNotification({
        type: 'error',
        message: '操作失敗，請稍後再試'
      })
    }
  }

  const handleDeleteAll = async () => {
    if (announcements.length === 0) {
      showNotification({
        type: 'error',
        message: '目前沒有公告可刪除'
      })
      return
    }
    const result = await confirm({
      title: '刪除所有公告',
      message: `將刪除 ${announcements.length} 則公告，此操作無法復原，是否繼續？`,
      confirmText: '確定刪除',
      cancelText: '取消'
    })
    if (!result) return
    try {
      await deleteAllAnnouncements()
      showNotification({
        type: 'success',
        message: '所有公告已刪除'
      })
      resetForm()
    } catch {
      showNotification({
        type: 'error',
        message: '操作失敗，請稍後再試'
      })
    }
  }

  const themeOptions: AnnouncementInput['theme'][] = ['accent', 'warning', 'success', 'info']

  return (
    <div className="admin-announcements">
      <div className="page-header">
        <div>
          <h1>公告管理</h1>
          <p className="page-subtitle">僅開發者可操作，所有公告將同步至前台頂部橫幅</p>
        </div>
        <div className="page-header-actions">
          {announcements.length > 0 && (
            <button type="button" className="ghost-button" onClick={handleDeleteAll}>
              <span className="material-icons">delete_sweep</span>
              清除所有公告
            </button>
          )}
        </div>
      </div>

      <div className="announcement-grid">
        <section className="announcement-form-card">
          <div className="section-title">
            <span className="material-icons">edit_note</span>
            <div>
              <h2>{editingId ? '編輯公告' : '新增公告'}</h2>
              <p>設定公告標題、訊息、展示期間與優先權限</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="announcement-form">
            <label className="form-field">
              <span>公告標題</span>
              <input
                type="text"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                placeholder="輸入簡潔有力的標題"
              />
            </label>
            <label className="form-field">
              <span>公告內容</span>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="描述要傳達的訊息"
              />
            </label>
            <div className="form-row">
              <label className="form-field">
                <span>開始時間</span>
                <input
                  type="datetime-local"
                  name="startAt"
                  value={formState.startAt}
                  onChange={handleInputChange}
                />
              </label>
              <label className="form-field">
                <span>結束時間</span>
                <input
                  type="datetime-local"
                  name="endAt"
                  value={formState.endAt}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-row">
              <label className="form-field">
                <span>優先序</span>
                <input
                  type="number"
                  name="priority"
                  min={0}
                  max={99}
                  value={formState.priority}
                  onChange={handleInputChange}
                />
              </label>
              <label className="form-field">
                <span>主題色</span>
                <select name="theme" value={formState.theme} onChange={handleInputChange}>
                  {themeOptions.map((theme) => (
                    <option value={theme} key={theme}>
                      {theme.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="toggle-row">
              <label className="toggle-field">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formState.isActive}
                  onChange={handleCheckboxChange}
                />
                <span>啟用公告</span>
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  name="isBanner"
                  checked={formState.isBanner}
                  onChange={handleCheckboxChange}
                />
                <span>顯示在頂部橫幅</span>
              </label>
            </div>
            <div className="form-actions">
              {editingId && (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  <span className="material-icons">restart_alt</span>
                  取消編輯
                </button>
              )}
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                <span className="material-icons">{editingId ? 'check' : 'send'}</span>
                {editingId ? '儲存修改' : '建立公告'}
              </button>
            </div>
          </form>
        </section>

        <section className="announcement-list-card">
          <div className="section-title">
            <span className="material-icons">view_list</span>
            <div>
              <h2>現有公告</h2>
              <p>依優先序由高到低排列，僅開發者能調整</p>
            </div>
          </div>
          {sortedAnnouncements.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">campaign</span>
              <p>目前沒有公告，新增後即可在前台顯示。</p>
            </div>
          ) : (
            <div className="announcement-list">
              {sortedAnnouncements.map((announcement) => (
                <div key={announcement.id} className="announcement-item">
                  <div className="item-main">
                    <div className="item-title">
                      <span className={`status-dot ${announcement.isActive ? 'active' : 'inactive'}`} />
                      <h3>{announcement.title}</h3>
                    </div>
                    <p className="item-message">{announcement.message}</p>
                    <div className="item-meta">
                      <span className="meta-chip">優先序 {announcement.priority}</span>
                      <span className="meta-chip">主題 {announcement.theme.toUpperCase()}</span>
                      <span className="meta-chip">
                        {announcement.isBanner ? '前台橫幅' : '僅內部'}
                      </span>
                    </div>
                    <p className="item-time">
                      {new Date(announcement.startAt).toLocaleString('zh-TW')}
                      {announcement.endAt ? ` ~ ${new Date(announcement.endAt).toLocaleString('zh-TW')}` : ' 起'}
                    </p>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="ghost-button" onClick={() => handleEdit(announcement)}>
                      <span className="material-icons">edit</span>
                      編輯
                    </button>
                    <button type="button" className="ghost-button danger" onClick={() => handleDelete(announcement.id)}>
                      <span className="material-icons">delete</span>
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

