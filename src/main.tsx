import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Register service worker for complete offline caching
registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('Panatag is ready to work 100% offline without internet!');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
