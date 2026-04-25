import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export const useToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');

  const showToast = useCallback((msg: string, toastType: ToastType = 'success') => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    toastProps: {
      visible,
      message,
      type,
      onHide: hideToast,
    },
    showToast,
    hideToast,
  };
};
