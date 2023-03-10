import ReactDOM from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './routes/app-routes'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
)
