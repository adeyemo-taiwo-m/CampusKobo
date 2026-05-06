import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { supabase } from '../lib/supabase';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface SupportMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string;
}

/**
 * Returns an array of FAQ objects.
 */
export const getFAQs = async (): Promise<FAQ[]> => {
  const response = await apiClient.get(API_ENDPOINTS.FAQS);
  return response as unknown as FAQ[];
};

/**
 * Sends a support message directly to Supabase.
 */
export const sendMessage = async (data: SupportMessageRequest): Promise<any> => {
  const { error } = await supabase
    .from('support_messages')
    .insert([
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        user_id: data.user_id || null,
        status: 'pending' // Default status
      }
    ]);

  if (error) throw error;
  return { success: true };
};

export const supportService = {
  getFAQs,
  sendMessage,
  sendSupportMessage: sendMessage,
};

export default supportService;
