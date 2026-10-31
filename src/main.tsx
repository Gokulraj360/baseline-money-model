import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './store/AppStore';
import { ToastProvider } from './components/ui';
import App from './App';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Baseline needs a #root element');

createRoot(root).render(
  <StrictMode>
    <AppProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  </StrictMode>
);
