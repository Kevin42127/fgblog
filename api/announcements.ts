import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql, initDatabase } from './db.js'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await initDatabase()

  if (req.method === 'GET') {
    try {
      const { activeOnly } = req.query
      const now = new Date().toISOString()

      if (activeOnly === 'true') {
        const activeAnnouncements = await sql`
          SELECT * FROM announcements
          WHERE "isActive" = TRUE
            AND "startAt" <= ${now}
            AND ("endAt" IS NULL OR "endAt" >= ${now})
          ORDER BY priority DESC, "startAt" DESC
        `
        return res.status(200).json(activeAnnouncements)
      }

      const announcements = await sql`
        SELECT * FROM announcements
        ORDER BY priority DESC, "createdAt" DESC
      `
      return res.status(200).json(announcements)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
      return res.status(500).json({ error: 'Failed to fetch announcements' })
    }
  }

  if (req.method === 'POST') {
    try {
      const announcement = req.body

      if (!announcement?.id || !announcement?.title || !announcement?.message || !announcement?.startAt) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      await sql`
        INSERT INTO announcements (
          id, title, message, "startAt", "endAt", "isActive", "isBanner",
          priority, theme, "createdAt", "updatedAt"
        )
        VALUES (
          ${announcement.id},
          ${announcement.title},
          ${announcement.message},
          ${announcement.startAt},
          ${announcement.endAt || null},
          ${announcement.isActive ?? true},
          ${announcement.isBanner ?? true},
          ${announcement.priority ?? 0},
          ${announcement.theme || 'accent'},
          ${announcement.createdAt},
          ${announcement.updatedAt}
        )
      `

      return res.status(201).json(announcement)
    } catch (error) {
      console.error('Failed to create announcement:', error)
      return res.status(500).json({ error: 'Failed to create announcement' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Announcement ID is required' })
      }

      const [current] = await sql`SELECT * FROM announcements WHERE id = ${id}`
      if (!current) {
        return res.status(404).json({ error: 'Announcement not found' })
      }

      const updatedAnnouncement = {
        title: updateData.title ?? current.title,
        message: updateData.message ?? current.message,
        startAt: updateData.startAt ?? current.startAt,
        endAt: updateData.endAt ?? current.endAt,
        isActive: updateData.isActive ?? current.isActive,
        isBanner: updateData.isBanner ?? current.isBanner,
        priority: typeof updateData.priority === 'number' ? updateData.priority : current.priority,
        theme: updateData.theme ?? current.theme,
        updatedAt: updateData.updatedAt ?? current.updatedAt
      }

      await sql`
        UPDATE announcements
        SET
          title = ${updatedAnnouncement.title},
          message = ${updatedAnnouncement.message},
          "startAt" = ${updatedAnnouncement.startAt},
          "endAt" = ${updatedAnnouncement.endAt || null},
          "isActive" = ${updatedAnnouncement.isActive},
          "isBanner" = ${updatedAnnouncement.isBanner},
          priority = ${updatedAnnouncement.priority},
          theme = ${updatedAnnouncement.theme},
          "updatedAt" = ${updatedAnnouncement.updatedAt}
        WHERE id = ${id}
      `

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to update announcement:', error)
      return res.status(500).json({ error: 'Failed to update announcement' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Announcement ID is required' })
      }

      const existing = await sql`SELECT id FROM announcements WHERE id = ${id}`
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Announcement not found' })
      }

      await sql`DELETE FROM announcements WHERE id = ${id}`
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to delete announcement:', error)
      return res.status(500).json({ error: 'Failed to delete announcement' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

