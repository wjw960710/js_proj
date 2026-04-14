import { Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import VitePage from './VitePage'

interface AppRouterProps {
  title: string
}

export const AppRouter = ({ title }: AppRouterProps) => {
  return (
    <Routes>
      <Route path="/" element={<App title={title} />} />
      <Route path="/index" element={<App title={title} />} />
      <Route path="/admin" element={<App title={title} />} />
      <Route path="/client" element={<App title={title} />} />
      <Route path="/vite" element={<VitePage entryTitle={title} />} />
    </Routes>
  )
}

export default AppRouter
