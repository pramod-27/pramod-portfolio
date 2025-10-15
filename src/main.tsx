import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import './index.css'

// Simple placeholders (not used in main flow)
function AuthPage({ redirectAfterAuth }: { redirectAfterAuth: string }) {
  return <div className="p-8 text-green-400">Auth Page (placeholder)</div>
}
function NotFound() {
  return <div className="p-8 text-green-400">404 - Not Found</div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage redirectAfterAuth="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)