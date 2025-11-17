import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql, initDatabase } from './db.js'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await initDatabase()

  if (req.method === 'GET') {
    try {
      const posts = await sql`
        SELECT * FROM posts
        ORDER BY "createdAt" DESC
      `
      return res.status(200).json(posts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      return res.status(500).json({ error: 'Failed to fetch posts' })
    }
  }

  if (req.method === 'POST') {
    try {
      const post = req.body
      await sql`
        INSERT INTO posts (id, title, content, excerpt, category, author, "createdAt", "viewCount")
        VALUES (${post.id}, ${post.title}, ${post.content}, ${post.excerpt}, ${post.category}, ${post.author}, ${post.createdAt}, ${post.viewCount || 0})
      `
      return res.status(201).json(post)
    } catch (error) {
      console.error('Failed to create post:', error)
      return res.status(500).json({ error: 'Failed to create post' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'Post ID is required' })
      }

      const currentPost = await sql`SELECT * FROM posts WHERE id = ${id}`
      if (currentPost.length === 0) {
        return res.status(404).json({ error: 'Post not found' })
      }

      const updatedPost = {
        title: updateData.title ?? currentPost[0].title,
        content: updateData.content ?? currentPost[0].content,
        excerpt: updateData.excerpt ?? currentPost[0].excerpt,
        category: updateData.category ?? currentPost[0].category,
        author: updateData.author ?? currentPost[0].author,
        viewCount: updateData.viewCount ?? currentPost[0].viewCount
      }

      const result = await sql`
        UPDATE posts 
        SET 
          title = ${updatedPost.title},
          content = ${updatedPost.content},
          excerpt = ${updatedPost.excerpt},
          category = ${updatedPost.category},
          author = ${updatedPost.author},
          "viewCount" = ${updatedPost.viewCount}
        WHERE id = ${id}
      `
      
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to update post:', error)
      return res.status(500).json({ error: 'Failed to update post' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Post ID is required' })
      }
      const result = await sql`DELETE FROM posts WHERE id = ${id}`
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Post not found' })
      }
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to delete post:', error)
      return res.status(500).json({ error: 'Failed to delete post' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
