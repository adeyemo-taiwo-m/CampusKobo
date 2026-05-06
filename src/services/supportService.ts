import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface SupportMessageRequest {
  name: string;
  email: string;
  message: string;
  subject?: string;
  category?: string;
}

/**
 * Returns an array of FAQ objects.
 */
export const getFAQs = async (): Promise<FAQ[]> => {
  const response = await apiClient.get(API_ENDPOINTS.FAQS);
  return response as unknown as FAQ[];
};

/**
 * Sends a support message to the backend.
 */
export const sendMessage = async (data: SupportMessageRequest): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.SUPPORT_MESSAGES, data);
};

export const supportService = {
  getFAQs,
  sendMessage,
  sendSupportMessage: sendMessage,
};

export default supportService;
