import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { APIProvider } from './context/api-context'
import { AuthProvider } from './context/auth-context'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <APIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </APIProvider>
  </React.StrictMode>,
)