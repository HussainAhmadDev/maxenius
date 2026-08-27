import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes/index.tsx';
import ThemeProvider from './theme/index.tsx';
import App from './App.tsx';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ThemeProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
      <App />
    </ThemeProvider>
  </>,
);
