import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ valid: false, error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return res.status(200).json({ valid: true, user: decoded })
  } catch (error) {
    return res.status(401).json({ valid: false, error: 'Invalid token' })
  }
}

