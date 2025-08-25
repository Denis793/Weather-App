// path: src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WithQuery } from './app/providers/query';
import App from './app/App';
import '@/app/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WithQuery>
      <App />
    </WithQuery>
  </React.StrictMode>
);
