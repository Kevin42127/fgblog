import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.POSTGRES_URL || '')

export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "viewCount" INTEGER DEFAULT 0
      )
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        name VARCHAR(255) PRIMARY KEY
      )
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        read BOOLEAN DEFAULT FALSE
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        "startAt" TIMESTAMP NOT NULL,
        "endAt" TIMESTAMP,
        "isActive" BOOLEAN DEFAULT TRUE,
        "isBanner" BOOLEAN DEFAULT TRUE,
        priority INTEGER DEFAULT 0,
        theme VARCHAR(32) DEFAULT 'accent',
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      )
    `
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

export { sql }
