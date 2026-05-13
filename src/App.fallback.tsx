import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './styles.css'

// Fallback simple React app - use if TanStack Start deployment fails
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6">
          <Link to="/" className="font-bold">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/status">Status</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Server Hub Forge</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Modern Minecraft server management platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Community" desc="Connect with players worldwide" />
          <Card title="Survival" desc="Classic survival gameplay mode" />
          <Card title="Dungeons" desc="Explore challenging dungeons" />
        </div>
      </main>
    </div>
  )
}

function Features() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-3xl font-bold p-4">Features</h1>
      <p>Feature list coming soon...</p>
    </div>
  )
}

function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-3xl font-bold p-4">FAQ</h1>
      <p>FAQ coming soon...</p>
    </div>
  )
}

function Status() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-3xl font-bold p-4">Status</h1>
      <p>Server status coming soon...</p>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <Link to="/" className="text-blue-500 hover:underline">Go Home</Link>
      </div>
    </div>
  )
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  )
}
