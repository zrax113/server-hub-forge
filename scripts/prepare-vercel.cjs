#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const dist = path.join(root, 'dist')
const target = path.join(dist, 'client')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    return
  }

  const stats = fs.statSync(src)
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

if (fs.existsSync(target) && fs.existsSync(path.join(target, 'index.html'))) {
  console.log('Vercel client output already exists at dist/client')
  process.exit(0)
}

if (!fs.existsSync(dist)) {
  console.error('Build output directory "dist" is missing. Run Vite build first.')
  process.exit(1)
}

console.log('Creating dist/client fallback from dist/...')

if (!fs.existsSync(target)) {
  fs.mkdirSync(target, { recursive: true })
}

copyRecursive(dist, target)

console.log('Fallback copy complete. dist/client is ready for Vercel.')
process.exit(0)
