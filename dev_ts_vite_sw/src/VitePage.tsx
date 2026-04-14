import React from 'react'
import { useNavigate } from 'react-router-dom'

interface VitePageProps {
  entryTitle: string
}

const VitePage: React.FC<VitePageProps> = ({ entryTitle }) => {
  const navigate = useNavigate()

  // 將 "Main Entry", "Admin Dashboard", "Client Portal" 轉換成 "main", "admin", "client"
  const getDisplayTitle = (title: string) => {
    if (title.includes('Main')) return 'main'
    if (title.includes('Admin')) return 'admin'
    if (title.includes('Client')) return 'client'
    return title
  }

  const backText = `Back to ${getDisplayTitle(entryTitle)}`

  return (
    <div className="full-screen-iframe" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          backgroundColor: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          fontFamily: 'var(--sans)',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        ← {backText}
      </button>
      <iframe
        src="https://vite.dev"
        title="Vite Official Website"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  )
}

export default VitePage
