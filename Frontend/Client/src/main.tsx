import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import './i18n'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              borderRadius: '0.75rem',
              padding: '14px 18px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#ffffff',
                secondary: '#10b981',
              },
              style: {
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3), 0 10px 10px -5px rgba(16, 185, 129, 0.2)',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ffffff',
                secondary: '#ef4444',
              },
              style: {
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)',
              },
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
