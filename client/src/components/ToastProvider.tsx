import React, { createContext, useContext, useState,type ReactNode } from 'react';
import ToastNotification, {type ToastProps } from './ToastNotification';

interface Toast extends Omit<ToastProps, 'onClose'> {
    id: string;
}

interface ToastContextType {
    showToast: (message: string, type: ToastProps['type'], duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showToast = (message: string, type: ToastProps['type'], duration = 4000) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            id,
            message,
            type,
            duration,
        };

        setToasts(prev => [...prev, newToast]);
    };

    const showSuccess = (message: string, duration?: number) => {
        showToast(message, 'success', duration);
    };

    const showError = (message: string, duration?: number) => {
        showToast(message, 'error', duration);
    };

    const showWarning = (message: string, duration?: number) => {
        showToast(message, 'warning', duration);
    };

    const showInfo = (message: string, duration?: number) => {
        showToast(message, 'info', duration);
    };

    const contextValue: ToastContextType = {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="toast-container">
                {toasts.map((toast, index) => (
                    <div
                        key={toast.id}
                        style={{
                            position: 'fixed',
                            top: `${20 + index * 80}px`,
                            right: '20px',
                            zIndex: 1001 + index,
                        }}
                    >
                        <ToastNotification
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};