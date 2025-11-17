import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql, initDatabase } from './db'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await initDatabase()

  if (req.method === 'GET') {
    try {
      const categories = await sql`SELECT name FROM categories ORDER BY name`
      const categoryList = categories.map((cat: any) => cat.name)
      return res.status(200).json(categoryList)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return res.status(500).json({ error: 'Failed to fetch categories' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name } = req.body
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' })
      }

      try {
        await sql`INSERT INTO categories (name) VALUES (${name})`
        return res.status(201).json({ success: true })
      } catch (error: any) {
        if (error.code === '23505') {
          return res.status(200).json({ success: true, message: 'Category already exists' })
        }
        throw error
      }
    } catch (error) {
      console.error('Failed to create category:', error)
      return res.status(500).json({ error: 'Failed to create category' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { name } = req.query
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Category name is required' })
      }
      const result = await sql`DELETE FROM categories WHERE name = ${name}`
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Category not found' })
      }
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to delete category:', error)
      return res.status(500).json({ error: 'Failed to delete category' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
