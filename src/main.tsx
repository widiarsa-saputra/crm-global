import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './auth/context/AuthProvider';
import { Toaster } from 'sonner';
import AppRouter from './router/AppRouter';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './i18n';
import { NotificationProvider } from './shared/components/notification/context/NotificationContext';
import { ChatProvider } from './shared/components/facebook-style-chat/context/ChatContext';
import { TopbarActionProvider } from './shared/context/TopbarActionContext';

import { queryClient } from './lib/queryClient';

// RE-FETCH /ME ON WINDOW FOCUS
// Memastikan hak akses paling update saat user kembali ke tab ini
window.addEventListener('focus', () => {
  queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              error: 'text-danger',
              success: 'text-success',
              warning: 'text-warning',
              info: 'text-info',
            },
          }} />
        <NotificationProvider>
          <ChatProvider>
            <TopbarActionProvider>
              <AppRouter />
            </TopbarActionProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
