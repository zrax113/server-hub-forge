#!/usr/bin/env node

/**
 * Vercel Deploy Script
 * Handles all 3 deployment methods with fallbacks
 * Usage: node scripts/deploy.cjs [method]
 * Methods: primary (default), fallback, simple, verify
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const root = process.cwd()
const method = process.argv[2] || 'primary'

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  step: (num, msg) => console.log(`\n→ Step ${num}: ${msg}`),
}

const run = (cmd, silent = false) => {
  try {
    if (!silent) log.info(`Running: ${cmd}`)
    execSync(cmd, { stdio: 'inherit', cwd: root })
    return true
  } catch (e) {
    if (!silent) log.error(`Command failed: ${cmd}`)
    return false
  }
}

const verify = () => {
  const indexHtml = path.join(root, 'dist', 'client', 'index.html')
  if (!fs.existsSync(indexHtml)) {
    log.error('dist/client/index.html not found!')
    return false
  }
  log.success('dist/client/index.html verified ✓')
  return true
}

const deployPrimary = () => {
  log.step(1, 'Attempting primary TanStack Start build')
  if (run('npm run build') && verify()) {
    log.success('Primary deployment ready!')
    return true
  }
  log.warn('Primary build failed, trying fallback...')
  return false
}

const deployFallback = () => {
  log.step(2, 'Attempting fallback with directory copy')
  if (run('npm run build:backup') && verify()) {
    log.success('Fallback deployment ready!')
    return true
  }
  log.warn('Fallback failed, trying simple build...')
  return false
}

const deploySimple = () => {
  log.step(3, 'Attempting simple Vite React build')
  if (run('npm run build:simple') && verify()) {
    log.success('Simple deployment ready!')
    return true
  }
  log.error('All build methods failed!')
  return false
}

const main = () => {
  console.log('\n🚀 Vercel Deployment Script\n')

  switch (method.toLowerCase()) {
    case 'primary':
      if (deployPrimary()) process.exit(0)
      if (deployFallback()) process.exit(0)
      if (deploySimple()) process.exit(0)
      process.exit(1)
      break

    case 'fallback':
      if (deployFallback()) process.exit(0)
      if (deploySimple()) process.exit(0)
      process.exit(1)
      break

    case 'simple':
      if (deploySimple()) process.exit(0)
      process.exit(1)
      break

    case 'verify':
      if (verify()) process.exit(0)
      process.exit(1)
      break

    default:
      log.error(`Unknown method: ${method}`)
      console.log('Available methods: primary, fallback, simple, verify')
      process.exit(1)
  }
}

main()
