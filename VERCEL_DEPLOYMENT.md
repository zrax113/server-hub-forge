# Vercel Deployment Guide

## Quick Start

This project is configured with **3 different build fallbacks** to ensure successful Vercel deployment:

### Primary Method (TanStack Start)
```bash
npm run build
npm run verify-build
```

### Fallback Method (Simple Vite React)
```bash
npm run build:simple
npm run verify-build
```

### Local Testing (TanStack Start)
```bash
npm run dev
```

### Local Testing (Simple Vite React)
```bash
npm run dev:simple
```

---

## Deployment to Vercel

### Automatic (Recommended)
Vercel will automatically use `npm run build:vercel`, which:
1. Tries TanStack Start build
2. Falls back to Simple Vite React build
3. Verifies output structure

### Manual Deployment

**Option 1: TanStack Start (Full SSR)**
```bash
git push origin main
# Vercel auto-deploys using vercel.json scripts
```

**Option 2: Simple Vite React (Simple SPA)**
- If TanStack build fails repeatedly:
  1. Update `vercel.json` to use `"build:simple"` instead
  2. Or rename `vite.config.simple.ts` to `vite.config.ts`
  3. Push and redeploy

---

## File Structure

```
project-root/
├── src/
│   ├── main.tsx          ← Client entry point
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   └── routes/
├── public/
│   └── index.html        ← SPA fallback HTML
├── api/
│   └── catch-all.ts      ← Vercel serverless handler
├── scripts/
│   ├── prepare-vercel.cjs
│   ├── verify-build.cjs
│   └── index.json        ← Build output verification
├── vite.config.ts        ← Primary (TanStack Start)
├── vite.config.simple.ts ← Fallback (Simple Vite React)
└── vercel.json           ← Deployment config
```

---

## Troubleshooting

### Still Getting 404?

1. **Check build output:**
   ```bash
   npm run verify-build
   ```
   This will show if `dist/client/index.html` exists.

2. **Force fallback build:**
   ```bash
   npm run build:simple
   npm run verify-build
   npm start
   ```

3. **Verify Vercel configuration:**
   - Check `vercel.json` is in root
   - Ensure `outputDirectory` is `dist/client`
   - Verify `buildCommand` matches your scripts

4. **Check build logs on Vercel:**
   - Go to Vercel Dashboard → Project → Deployments
   - Click on failed deployment
   - Scroll to "Build" section to see error output

5. **Clear Vercel cache:**
   - Vercel Dashboard → Project Settings → Git
   - Click "Redeploy" with cache clear

### Build Succeeds but Routes Return 404

This means `dist/client/index.html` isn't being served. Solutions:

1. **Update vercel.json routes:**
   Already done in `vercel.json` with catch-all handler

2. **Check public/index.html:** 
   Should exist and reference `/src/main.tsx`

3. **Use API handler:**
   `api/catch-all.ts` catches all routes and serves `index.html`

---

## Production Tips

- **Enable caching:** Set `Cache-Control` headers in `vercel.json`
- **Minimize bundle:** Use `build:simple` for smaller output
- **Monitor performance:** Check Vercel Analytics
- **Use environment variables:** Set in Vercel Dashboard

---

## Support

If issues persist:
1. Check Vercel logs
2. Try `npm run build:simple`
3. Verify `dist/client/index.html` exists locally
4. Ensure Node.js version compatible (14+)

