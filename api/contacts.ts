import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql, initDatabase } from './db'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await initDatabase()

  if (req.method === 'GET') {
    try {
      const messages = await sql`
        SELECT * FROM contacts
        ORDER BY "createdAt" DESC
      `
      return res.status(200).json(messages)
    } catch (error) {
      console.error('Failed to fetch contact messages:', error)
      return res.status(500).json({ error: 'Failed to fetch contact messages' })
    }
  }

  if (req.method === 'POST') {
    try {
      const message = req.body
      await sql`
        INSERT INTO contacts (id, name, email, subject, message, "createdAt", read)
        VALUES (${message.id}, ${message.name}, ${message.email}, ${message.subject || null}, ${message.message}, ${message.createdAt}, ${message.read || false})
      `
      return res.status(201).json(message)
    } catch (error) {
      console.error('Failed to create contact message:', error)
      return res.status(500).json({ error: 'Failed to create contact message' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'Contact message ID is required' })
      }

      const currentMessage = await sql`SELECT * FROM contacts WHERE id = ${id}`
      if (currentMessage.length === 0) {
        return res.status(404).json({ error: 'Contact message not found' })
      }

      const updatedMessage = {
        read: updateData.read ?? currentMessage[0].read,
        name: updateData.name ?? currentMessage[0].name,
        email: updateData.email ?? currentMessage[0].email,
        subject: updateData.subject ?? currentMessage[0].subject,
        message: updateData.message ?? currentMessage[0].message
      }

      const result = await sql`
        UPDATE contacts 
        SET 
          read = ${updatedMessage.read},
          name = ${updatedMessage.name},
          email = ${updatedMessage.email},
          subject = ${updatedMessage.subject},
          message = ${updatedMessage.message}
        WHERE id = ${id}
      `
      
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to update contact message:', error)
      return res.status(500).json({ error: 'Failed to update contact message' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Contact message ID is required' })
      }
      const result = await sql`DELETE FROM contacts WHERE id = ${id}`
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Contact message not found' })
      }
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to delete contact message:', error)
      return res.status(500).json({ error: 'Failed to delete contact message' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
