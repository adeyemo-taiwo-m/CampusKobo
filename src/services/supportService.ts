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
 * Returns an array of FAQ objects directly from Supabase.
 */
export const getFAQs = async (): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from('faq_items')
    .select(`
      id,
      question,
      answer,
      category:faq_categories(name)
    `)
    .eq('is_published', true);

  if (error) {
    console.error('❌ Supabase Fetch FAQs Error:', error);
    throw error;
  }

  // Flatten the category from the join
  return (data || []).map(item => ({
    ...item,
    category: (item as any).category?.name || 'General'
  })) as FAQ[];
};

/**
 * Sends a support message directly to Supabase.
 */
export const sendMessage = async (data: SupportMessageRequest): Promise<any> => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  console.log('📤 Sending support message to Supabase:', { ...data, id: uuid });
  try {
    const { error, data: insertedData } = await supabase
      .from('support_messages')
      .insert([
        {
          id: uuid,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          user_id: data.user_id || null,
          status: 'open'
        }
      ])
      .select();

    if (error) {
      console.error('❌ Supabase Support Message Error:', error);
      throw new Error(error.message || 'Failed to send message to database');
    }
    
    console.log('✅ Supabase Support Message Success:', insertedData);
    return { success: true, data: insertedData };
  } catch (err: any) {
    console.error('❌ Error in sendMessage:', err);
    throw err;
  }
};

export const supportService = {
  getFAQs,
  sendMessage,
  sendSupportMessage: sendMessage,
};

export default supportService;
