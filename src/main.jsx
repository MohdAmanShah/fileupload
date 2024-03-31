import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { web } from './Keys/Keys.json'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={web.client_id}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
)
