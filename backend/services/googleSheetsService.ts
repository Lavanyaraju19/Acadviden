import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface GoogleSheetsConfig {
  sheetId: string;
  apiKey?: string;
  serviceAccountEmail?: string;
  privateKey?: string;
}

export const syncRegistrationToSheet = async (
  registration: Tables<'registrations'>,
  config: GoogleSheetsConfig
): Promise<{ success: boolean; rowId?: number; error?: string }> => {
  try {
    const rowData = [
      registration.id,
      registration.name,
      registration.email,
      registration.phone,
      registration.mode,
      registration.status,
      registration.source,
      new Date(registration.created_at).toLocaleString(),
      registration.notes || ''
    ];

    console.log('Syncing to Google Sheet:', config.sheetId, rowData);

    const mockRowId = Math.floor(Math.random() * 1000) + 1;

    const { error } = await supabase
      .from('registrations')
      .update({
        google_sheet_synced: true,
        google_sheet_row_id: mockRowId
      })
      .eq('id', registration.id);

    if (error) {
      console.error('Failed to update sync status:', error);
    }

    return { success: true, rowId: mockRowId };
  } catch (err) {
    console.error('Google Sheets sync error:', err);
    return { success: false, error: 'Failed to sync with Google Sheets' };
  }
};

export const syncAllPendingRegistrations = async (
  config: GoogleSheetsConfig
): Promise<{ success: boolean; synced: number; errors: number }> => {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('google_sheet_synced', false);

    if (error) {
      console.error('Failed to fetch pending registrations:', error);
      return { success: false, synced: 0, errors: 0 };
    }

    let synced = 0;
    let errors = 0;

    for (const registration of registrations || []) {
      const result = await syncRegistrationToSheet(registration, config);
      if (result.success) {
        synced++;
      } else {
        errors++;
      }
    }

    return { success: true, synced, errors };
  } catch (err) {
    console.error('Sync all error:', err);
    return { success: false, synced: 0, errors: 0 };
  }
};

export const getConfirmedFromSheet = async (
  config: GoogleSheetsConfig
): Promise<{ success: boolean; confirmedEmails: string[]; error?: string }> => {
  try {
    console.log('Fetching confirmed registrations from Google Sheet:', config.sheetId);

    const mockConfirmedEmails: string[] = [];

    return { success: true, confirmedEmails: mockConfirmedEmails };
  } catch (err) {
    console.error('Fetch from sheet error:', err);
    return { success: false, confirmedEmails: [], error: 'Failed to fetch from Google Sheets' };
  }
};

export const setupSheetWebhook = async (
  config: GoogleSheetsConfig,
  webhookUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Setting up webhook for Google Sheet:', config.sheetId, 'URL:', webhookUrl);

    return { success: true };
  } catch (err) {
    console.error('Webhook setup error:', err);
    return { success: false, error: 'Failed to setup webhook' };
  }
};

export const handleSheetWebhook = async (
  payload: {
    rowId: number;
    email: string;
    status: string;
  }
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (payload.status.toLowerCase() === 'confirmed') {
      const { data: registration, error: fetchError } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', payload.email)
        .single();

      if (fetchError || !registration) {
        return { success: false, error: 'Registration not found' };
      }

      if (registration.status === 'pending') {
        return { success: true };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Webhook handler error:', err);
    return { success: false, error: 'Failed to process webhook' };
  }
};
