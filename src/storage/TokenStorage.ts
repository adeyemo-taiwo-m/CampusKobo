import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { TOKEN_KEYS } from '../constants/api';

const isWeb = Platform.OS === 'web';

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    if (!isWeb) {
      await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    } else {
      await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    }
  } catch (error) {
    console.warn('Storage failed:', error);
    if (!isWeb) {
      try {
        await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
      } catch (asyncError) {
        console.error('AsyncStorage fallback also failed:', asyncError);
      }
    }
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    if (!isWeb) {
      let token = await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
      if (!token) {
        token = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      }
      return token;
    }
    return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    if (!isWeb) {
      let token = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
      if (!token) {
        token = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
      }
      return token;
    }
    return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    if (!isWeb) {
      await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
    }
    await AsyncStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

export const hasValidTokens = async (): Promise<boolean> => {
  try {
    const token = await getAccessToken();
    return !!(token && token.length > 0);
  } catch (error) {
    return false;
  }
};
