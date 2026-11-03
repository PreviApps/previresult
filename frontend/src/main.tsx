import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Typography } from '@heroui/react'
import { AuthProvider } from './components/auth_provider/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Typography.Prose>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Typography.Prose>
  </StrictMode>,
)
