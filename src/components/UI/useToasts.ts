import { useState } from 'react';

export default () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (title: string, description: string, type: 'success' | 'error') => {
    const newToast = {
      id: Date.now(),
      title,
      type,
      description,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return { showToast, toasts, removeToast };
};
