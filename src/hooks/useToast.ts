import { useState, useCallback } from 'react';
import { ToastType } from '../components/Toast';

export const useToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');

  const showToast = useCallback((msg: string, toastType: ToastType = 'success') => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
  }, []);

  const onHide = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    showToast,
    toastProps: {
      visible,
      message,
      type,
      onHide,
    },
  };
};
