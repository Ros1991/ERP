import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '400px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#10b981',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: '#ef4444',
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ message }) => (
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <span className="text-sm font-medium">{message}</span>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
                aria-label="Fechar notificação"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
