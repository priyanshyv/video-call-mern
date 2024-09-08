import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { SocketProvide } from './context/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SocketProvide>
    <App />
    </SocketProvide>
    </BrowserRouter>
  </StrictMode>,
)
