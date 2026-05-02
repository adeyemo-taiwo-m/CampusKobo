import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Checks if the device is currently online with a reachable internet connection.
 */
export const isOnline = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && state.isInternetReachable);
  } catch (error) {
    console.error('Error checking network status:', error);
    return false;
  }
};

/**
 * React hook to subscribe to network status changes.
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then((state) => {
      setIsOnline(!!(state.isConnected && state.isInternetReachable));
    });

    // Subscribe to updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!(state.isConnected && state.isInternetReachable));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isOnline };
};
