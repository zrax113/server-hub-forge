import { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // For SPA, serve index.html for all non-file routes
  const clientPath = path.join(process.cwd(), 'dist', 'client', 'index.html')
  
  try {
    if (fs.existsSync(clientPath)) {
      const content = fs.readFileSync(clientPath, 'utf-8')
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=3600')
      return res.status(200).send(content)
    }
  } catch (error) {
    console.error('Failed to read index.html:', error)
  }

  // Fallback 404
  res.status(404).json({ error: 'Not found' })
}
