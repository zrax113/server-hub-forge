#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

console.log('\n🔍 Verifying build output for Vercel deployment...\n')

const checkPath = (p, name) => {
  const exists = fs.existsSync(p)
  const status = exists ? '✅' : '❌'
  console.log(`${status} ${name}`)
  if (exists && fs.statSync(p).isDirectory()) {
    const files = fs.readdirSync(p).slice(0, 5)
    console.log(`   └─ Files: ${files.join(', ')}${files.length > 5 ? '...' : ''}`)
  }
  return exists
}

const root = process.cwd()
const distClient = path.join(root, 'dist', 'client')
const distServer = path.join(root, 'dist', 'server')
const indexHtml = path.join(distClient, 'index.html')
const assets = path.join(distClient, 'assets')
const publicHtml = path.join(root, 'public', 'index.html')

console.log('📁 Directory Structure:')
checkPath(distClient, 'dist/client')
checkPath(distServer, 'dist/server')
checkPath(assets, 'dist/client/assets')
checkPath(publicHtml, 'public/index.html')

console.log('\n📄 Critical Files:')
const hasIndexHtml = checkPath(indexHtml, 'dist/client/index.html')

if (hasIndexHtml) {
  const size = fs.statSync(indexHtml).size
  console.log(`   Size: ${(size / 1024).toFixed(2)} KB`)
}

console.log('\n✅ Build verification complete.\n')

if (!hasIndexHtml) {
  console.error('⚠️  WARNING: dist/client/index.html not found!')
  console.error('   This is required for Vercel deployment.')
  process.exit(1)
}

process.exit(0)
