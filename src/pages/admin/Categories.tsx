import { useState, useEffect } from 'react'
import { useNotification } from '../../contexts/NotificationContext'
import { useBlog } from '../../contexts/BlogContext'
import { useConfirm } from '../../contexts/ConfirmContext'
import './Categories.css'

export default function AdminCategories() {
  const [newCategory, setNewCategory] = useState('')
  const { showNotification } = useNotification()
  const { categories, loadCategories, addCategory, deleteCategory, deleteAllCategories } = useBlog()
  const { confirm } = useConfirm()

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      showNotification({
        type: 'error',
        message: '請輸入分類名稱'
      })
      return
    }

    if (categories.includes(newCategory.trim())) {
      showNotification({
        type: 'error',
        message: '此分類已存在'
      })
      return
    }

    try {
      await addCategory(newCategory.trim())
      setNewCategory('')
      showNotification({
        type: 'success',
        message: '分類已新增'
      })
    } catch (error) {
      showNotification({
        type: 'error',
        message: '操作失敗，請稍後再試'
      })
    }
  }

  const handleDelete = async (category: string) => {
    const result = await confirm({
      title: '刪除分類',
      message: `確定要刪除分類「${category}」嗎？`,
      confirmText: '刪除',
      cancelText: '取消'
    })
    if (result) {
      try {
        await deleteCategory(category)
        showNotification({
          type: 'success',
          message: '分類已刪除'
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
    if (categories.length === 0) {
      showNotification({
        type: 'error',
        message: '沒有可刪除的分類'
      })
      return
    }
    const result = await confirm({
      title: '刪除所有分類',
      message: `確定要刪除所有 ${categories.length} 個分類嗎？此操作無法復原！`,
      confirmText: '確定刪除',
      cancelText: '取消'
    })
    if (result) {
      try {
        await deleteAllCategories()
        showNotification({
          type: 'success',
          message: '所有分類已刪除'
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
    <div className="admin-categories">
      <div className="page-header">
        <h1>分類管理</h1>
        {categories.length > 0 && (
          <button onClick={handleDeleteAll} className="btn-delete-all">
            <span className="material-icons">delete_sweep</span>
            一鍵刪除全部
          </button>
        )}
      </div>
      <div className="categories-content">
        <div className="add-category-section">
          <h2>新增分類</h2>
          <div className="add-form">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="輸入分類名稱"
              className="category-input"
            />
            <button onClick={handleAdd} className="btn-primary">
              <span className="material-icons">add</span>
              新增
            </button>
          </div>
        </div>

        <div className="categories-list-section">
          <h2>現有分類</h2>
          {categories.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">category</span>
              <p>還沒有任何分類</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <button
                    onClick={() => handleDelete(category)}
                    className="delete-btn"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

