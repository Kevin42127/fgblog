import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  createdAt: string
  viewCount?: number
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

interface BlogContextType {
  posts: Post[]
  categories: string[]
  contactMessages: ContactMessage[]
  loadPosts: () => void
  loadCategories: () => void
  loadContactMessages: () => void
  addPost: (post: Post) => void
  updatePost: (id: string, post: Partial<Post>) => void
  deletePost: (id: string) => void
  deleteAllPosts: () => void
  addCategory: (category: string) => void
  deleteCategory: (category: string) => void
  deleteAllCategories: () => void
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void
  markContactMessageAsRead: (id: string) => void
  deleteContactMessage: (id: string) => void
  deleteAllContactMessages: () => void
  getPostById: (id: string) => Post | undefined
  incrementViewCount: (id: string) => void
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

const STORAGE_KEYS = {
  POSTS: 'blogPosts',
  CATEGORIES: 'blogCategories',
  CONTACT_MESSAGES: 'blogContactMessages'
}

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])

  const loadPosts = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPosts(parsed.sort((a: Post, b: Post) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
      } catch (error) {
        console.error('Failed to load posts:', error)
        setPosts([])
      }
    } else {
      setPosts([])
    }
  }, [])

  const loadCategories = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCategories(parsed)
      } catch (error) {
        console.error('Failed to load categories:', error)
        setCategories([])
      }
    } else {
      setCategories([])
    }
  }, [])


  const addPost = useCallback((post: Post) => {
    setPosts(currentPosts => {
      const newPosts = [...currentPosts, post]
      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts))
        window.dispatchEvent(new CustomEvent('blogPostsUpdated'))
      } catch (error) {
        console.error('Failed to save posts:', error)
      }
      return newPosts.sort((a: Post, b: Post) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
  }, [])

  const updatePost = useCallback((id: string, updatedPost: Partial<Post>) => {
    setPosts(currentPosts => {
      const newPosts = currentPosts.map(post => 
        post.id === id ? { ...post, ...updatedPost } : post
      )
      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts))
        window.dispatchEvent(new CustomEvent('blogPostsUpdated'))
      } catch (error) {
        console.error('Failed to save posts:', error)
      }
      return newPosts.sort((a: Post, b: Post) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
  }, [])

  const deletePost = useCallback((id: string) => {
    setPosts(currentPosts => {
      const newPosts = currentPosts.filter(post => post.id !== id)
      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts))
        window.dispatchEvent(new CustomEvent('blogPostsUpdated'))
      } catch (error) {
        console.error('Failed to save posts:', error)
      }
      return newPosts.sort((a: Post, b: Post) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
  }, [])

  const deleteAllPosts = useCallback(() => {
    setPosts([])
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]))
      window.dispatchEvent(new CustomEvent('blogPostsUpdated'))
    } catch (error) {
      console.error('Failed to save posts:', error)
    }
  }, [])

  const addCategory = useCallback((category: string) => {
    setCategories(currentCategories => {
      if (!currentCategories.includes(category)) {
        const newCategories = [...currentCategories, category]
        try {
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories))
          window.dispatchEvent(new CustomEvent('blogCategoriesUpdated'))
        } catch (error) {
          console.error('Failed to save categories:', error)
        }
        return newCategories
      }
      return currentCategories
    })
  }, [])

  const deleteCategory = useCallback((category: string) => {
    setCategories(currentCategories => {
      const newCategories = currentCategories.filter(cat => cat !== category)
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories))
        window.dispatchEvent(new CustomEvent('blogCategoriesUpdated'))
      } catch (error) {
        console.error('Failed to save categories:', error)
      }
      return newCategories
    })
  }, [])

  const deleteAllCategories = useCallback(() => {
    setCategories([])
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]))
      window.dispatchEvent(new CustomEvent('blogCategoriesUpdated'))
    } catch (error) {
      console.error('Failed to save categories:', error)
    }
  }, [])

  const loadContactMessages = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setContactMessages(parsed.sort((a: ContactMessage, b: ContactMessage) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
      } catch (error) {
        console.error('Failed to load contact messages:', error)
        setContactMessages([])
      }
    } else {
      setContactMessages([])
    }
  }, [])

  const addContactMessage = useCallback((message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false
    }
    setContactMessages(currentMessages => {
      const newMessages = [newMessage, ...currentMessages]
      try {
        localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(newMessages))
        window.dispatchEvent(new CustomEvent('blogContactMessagesUpdated'))
      } catch (error) {
        console.error('Failed to save contact messages:', error)
      }
      return newMessages
    })
  }, [])

  const markContactMessageAsRead = useCallback((id: string) => {
    setContactMessages(currentMessages => {
      const newMessages = currentMessages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      )
      try {
        localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(newMessages))
        window.dispatchEvent(new CustomEvent('blogContactMessagesUpdated'))
      } catch (error) {
        console.error('Failed to save contact messages:', error)
      }
      return newMessages
    })
  }, [])

  const deleteContactMessage = useCallback((id: string) => {
    setContactMessages(currentMessages => {
      const newMessages = currentMessages.filter(msg => msg.id !== id)
      try {
        localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(newMessages))
        window.dispatchEvent(new CustomEvent('blogContactMessagesUpdated'))
      } catch (error) {
        console.error('Failed to save contact messages:', error)
      }
      return newMessages
    })
  }, [])

  const deleteAllContactMessages = useCallback(() => {
    setContactMessages([])
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify([]))
      window.dispatchEvent(new CustomEvent('blogContactMessagesUpdated'))
    } catch (error) {
      console.error('Failed to save contact messages:', error)
    }
  }, [])

  const getPostById = useCallback((id: string) => {
    return posts.find(post => post.id === id)
  }, [posts])

  const incrementViewCount = useCallback((id: string) => {
    setPosts(currentPosts => {
      const newPosts = currentPosts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            viewCount: (post.viewCount || 0) + 1
          }
        }
        return post
      })
      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts))
        window.dispatchEvent(new CustomEvent('blogPostsUpdated'))
      } catch (error) {
        console.error('Failed to save posts:', error)
      }
      return newPosts
    })
  }, [])

  useEffect(() => {
    loadPosts()
    loadCategories()
    loadContactMessages()

    const handleStorageChange = () => {
      loadPosts()
      loadCategories()
      loadContactMessages()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('blogPostsUpdated', handleStorageChange)
    window.addEventListener('blogCategoriesUpdated', handleStorageChange)
    window.addEventListener('blogContactMessagesUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('blogPostsUpdated', handleStorageChange)
      window.removeEventListener('blogCategoriesUpdated', handleStorageChange)
      window.removeEventListener('blogContactMessagesUpdated', handleStorageChange)
    }
  }, [loadPosts, loadCategories, loadContactMessages])

  return (
    <BlogContext.Provider value={{
      posts,
      categories,
      contactMessages,
      loadPosts,
      loadCategories,
      loadContactMessages,
      addPost,
      updatePost,
      deletePost,
      deleteAllPosts,
      addCategory,
      deleteCategory,
      deleteAllCategories,
      addContactMessage,
      markContactMessageAsRead,
      deleteContactMessage,
      deleteAllContactMessages,
      getPostById,
      incrementViewCount
    }}>
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider')
  }
  return context
}

