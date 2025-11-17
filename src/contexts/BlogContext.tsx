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
  loadPosts: () => Promise<void>
  loadCategories: () => Promise<void>
  loadContactMessages: () => Promise<void>
  addPost: (post: Post) => Promise<void>
  updatePost: (id: string, post: Partial<Post>) => Promise<void>
  deletePost: (id: string) => Promise<void>
  deleteAllPosts: () => Promise<void>
  addCategory: (category: string) => Promise<void>
  deleteCategory: (category: string) => Promise<void>
  deleteAllCategories: () => Promise<void>
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => Promise<void>
  markContactMessageAsRead: (id: string) => Promise<void>
  deleteContactMessage: (id: string) => Promise<void>
  deleteAllContactMessages: () => Promise<void>
  getPostById: (id: string) => Post | undefined
  incrementViewCount: (id: string) => Promise<void>
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data.sort((a: Post, b: Post) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (error) {
      console.error('Failed to load posts:', error)
      setPosts([])
    }
  }, [])

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    }
  }, [])

  const loadContactMessages = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`)
      if (!response.ok) throw new Error('Failed to fetch contact messages')
      const data = await response.json()
      setContactMessages(data.sort((a: ContactMessage, b: ContactMessage) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (error) {
      console.error('Failed to load contact messages:', error)
      setContactMessages([])
    }
  }, [])

  const addPost = useCallback(async (post: Post) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })
      if (!response.ok) throw new Error('Failed to create post')
      await loadPosts()
    } catch (error) {
      console.error('Failed to add post:', error)
      throw error
    }
  }, [loadPosts])

  const updatePost = useCallback(async (id: string, updatedPost: Partial<Post>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedPost })
      })
      if (!response.ok) throw new Error('Failed to update post')
      await loadPosts()
    } catch (error) {
      console.error('Failed to update post:', error)
      throw error
    }
  }, [loadPosts])

  const deletePost = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?id=${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete post')
      await loadPosts()
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }, [loadPosts])

  const deleteAllPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/delete-all`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete all posts')
      await loadPosts()
    } catch (error) {
      console.error('Failed to delete all posts:', error)
      throw error
    }
  }, [loadPosts])

  const addCategory = useCallback(async (category: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category })
      })
      if (!response.ok) throw new Error('Failed to create category')
      await loadCategories()
    } catch (error) {
      console.error('Failed to add category:', error)
      throw error
    }
  }, [loadCategories])

  const deleteCategory = useCallback(async (category: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories?name=${encodeURIComponent(category)}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete category')
      await loadCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    }
  }, [loadCategories])

  const deleteAllCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/delete-all`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete all categories')
      await loadCategories()
    } catch (error) {
      console.error('Failed to delete all categories:', error)
      throw error
    }
  }, [loadCategories])

  const addContactMessage = useCallback(async (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    try {
      const newMessage = {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        read: false
      }
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      })
      if (!response.ok) throw new Error('Failed to create contact message')
      await loadContactMessages()
    } catch (error) {
      console.error('Failed to add contact message:', error)
      throw error
    }
  }, [loadContactMessages])

  const markContactMessageAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true })
      })
      if (!response.ok) throw new Error('Failed to update contact message')
      await loadContactMessages()
    } catch (error) {
      console.error('Failed to mark contact message as read:', error)
      throw error
    }
  }, [loadContactMessages])

  const deleteContactMessage = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts?id=${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete contact message')
      await loadContactMessages()
    } catch (error) {
      console.error('Failed to delete contact message:', error)
      throw error
    }
  }, [loadContactMessages])

  const deleteAllContactMessages = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/delete-all`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete all contact messages')
      await loadContactMessages()
    } catch (error) {
      console.error('Failed to delete all contact messages:', error)
      throw error
    }
  }, [loadContactMessages])

  const getPostById = useCallback((id: string) => {
    return posts.find(post => post.id === id)
  }, [posts])

  const incrementViewCount = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/increment-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) throw new Error('Failed to increment view count')
      await loadPosts()
    } catch (error) {
      console.error('Failed to increment view count:', error)
    }
  }, [loadPosts])

  useEffect(() => {
    loadPosts()
    loadCategories()
    loadContactMessages()
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
