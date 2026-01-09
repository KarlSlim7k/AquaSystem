import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import './App.css'
import App from './App.jsx'

// Registrar Service Worker para PWA - DESHABILITADO TEMPORALMENTE
// El Service Worker se generará automáticamente en producción con vite-plugin-pwa
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
      },
      (error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      }
    );
  });
}
*/

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
