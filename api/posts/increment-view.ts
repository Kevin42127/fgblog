import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql, initDatabase } from '../db'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.body
    if (!id) {
      return res.status(400).json({ error: 'Post ID is required' })
    }

    await initDatabase()
    const result = await sql`
      UPDATE posts 
      SET "viewCount" = COALESCE("viewCount", 0) + 1
      WHERE id = ${id}
      RETURNING "viewCount"
    `

    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }

    return res.status(200).json({ success: true, viewCount: result[0].viewCount || 0 })
  } catch (error) {
    console.error('Failed to increment view count:', error)
    return res.status(500).json({ error: 'Failed to increment view count' })
  }
}
