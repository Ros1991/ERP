import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-600',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          borderColor: 'border-yellow-200',
        };
      case 'info':
        return {
          iconColor: 'text-blue-600',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200',
        };
      default:
        return {
          iconColor: 'text-red-600',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200',
        };
    }
  };

  const styles = getVariantStyles();

  const getIcon = () => {
    if (variant === 'danger') {
      return <Trash2 className={`h-6 w-6 ${styles.iconColor}`} />;
    }
    return <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-2 ${styles.borderColor}`}>
          {/* Header */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-opacity-10 ${styles.iconColor.replace('text-', 'bg-')}`}>
                  {getIcon()}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="sm:w-auto w-full border border-gray-300 hover:bg-gray-50"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              isLoading={isLoading}
              className={`sm:w-auto w-full text-white ${styles.confirmBg} border-transparent`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for easier usage
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const showConfirm = (config: {
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
  }) => {
    setDialogState({
      isOpen: true,
      title: config.title,
      message: config.message,
      onConfirm: async () => {
        try {
          setIsLoading(true);
          await config.onConfirm();
          setDialogState(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Confirmation action failed:', error);
        } finally {
          setIsLoading(false);
        }
      },
      confirmText: config.confirmText,
      cancelText: config.cancelText,
      variant: config.variant,
    });
  };

  const hideConfirm = () => {
    if (!isLoading) {
      setDialogState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={hideConfirm}
      onConfirm={dialogState.onConfirm || (() => {})}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      variant={dialogState.variant}
      isLoading={isLoading}
    />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: ConfirmDialogComponent,
    isLoading,
  };
}
