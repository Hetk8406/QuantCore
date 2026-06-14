import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Dynamically set API base URL so phone/PC both work
axios.defaults.baseURL = `http://${window.location.hostname}:8000`;

createRoot(document.getElementById('root')).render(
  <App />
)

