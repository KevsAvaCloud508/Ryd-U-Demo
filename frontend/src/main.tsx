import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from './app/providers';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento #root en index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);
