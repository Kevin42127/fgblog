import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '00770100321'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      success: true,
      token
    })
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials'
  })
}

