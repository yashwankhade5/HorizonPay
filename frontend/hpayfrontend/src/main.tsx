// Buffer polyfill — required by @solana/web3.js in the browser
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
