import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppRouter from './AppRouter'
import { registerSW } from 'virtual:pwa-register'

export function renderEntry(title: string) {
  registerSW({ immediate: true })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AppRouter title={title} />
      </BrowserRouter>
    </StrictMode>,
  )
}
