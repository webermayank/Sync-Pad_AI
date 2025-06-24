import React,{useEffect, useState} from "react";

import '../styles/ToastNotification.css';

export interface ToastProps{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
}
const ToastNotification: React.FC<ToastProps> = ({
    message,
    type,
    duration = 4000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    return (
        <div className={`toast-notification toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
            <div className="toast-icon">
                {getIcon()}
            </div>
            <div className="toast-content">
                <p>{message}</p>
            </div>
            <button className="toast-close" onClick={handleClose}>
                ×
            </button>
        </div>
    );
};

export default ToastNotification;