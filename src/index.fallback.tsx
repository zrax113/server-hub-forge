import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.fallback.tsx'
import './styles.css'

// Use this as main.tsx fallback if TanStack Start fails
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
