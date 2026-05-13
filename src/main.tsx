import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'

// Hydrate the app on the client side
startTransition(() => {
  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  )
})
