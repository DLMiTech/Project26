import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'remixicon/fonts/remixicon.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx'
import './index.scss'
import 'typeface-poppins';
import 'react-loading-skeleton/dist/skeleton.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
