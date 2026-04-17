import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ParentDashboard from './components/screens/ParentDashboard'
import './styles.css'
import { registerServiceWorker } from './pwa'

const isParent = window.location.pathname === '/parent'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isParent ? <ParentDashboard /> : <App />}
  </React.StrictMode>,
)

registerServiceWorker()
