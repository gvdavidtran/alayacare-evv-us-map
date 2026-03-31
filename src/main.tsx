import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { EvvOverridesProvider } from './context/EvvOverridesContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EvvOverridesProvider>
      <App />
    </EvvOverridesProvider>
  </StrictMode>,
)
