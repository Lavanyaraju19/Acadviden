import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, Tables } from '@/integrations/supabase/types';

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  mode: 'online' | 'offline';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateRegistration = (data: RegistrationData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  const phoneRegex = /^[+]?[\d\s-]{10,}$/;
  if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number (at least 10 digits)';
  }

  if (!data.mode || !['online', 'offline'].includes(data.mode)) {
    errors.mode = 'Please select a valid mode (online or offline)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const createRegistration = async (data: RegistrationData): Promise<{
  success: boolean;
  data?: Tables<'registrations'>;
  error?: string;
}> => {
  try {
    const validation = validateRegistration(data);
    if (!validation.isValid) {
      return { success: false, error: Object.values(validation.errors).join(', ') };
    }

    const { data: existingReg, error: checkError } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('email', data.email.toLowerCase())
      .single();

    if (existingReg) {
      if (existingReg.status === 'pending') {
        return { success: false, error: 'A registration with this email is already pending' };
      }
      if (existingReg.status === 'confirmed') {
        return { success: false, error: 'This email is already registered. Please login.' };
      }
    }

    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        mode: data.mode,
        status: 'pending',
        source: 'website'
      })
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to create registration. Please try again.' };
    }

    return { success: true, data: registration };
  } catch (err) {
    console.error('Registration error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const confirmRegistration = async (registrationId: string, adminId: string): Promise<{
  success: boolean;
  studentId?: string;
  password?: string;
  error?: string;
}> => {
  try {
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single();

    if (fetchError || !registration) {
      return { success: false, error: 'Registration not found' };
    }

    if (registration.status !== 'pending') {
      return { success: false, error: 'Registration is not in pending status' };
    }

    const studentId = `STU${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const tempPassword = `${registration.name.split(' ')[0]}@${Math.random().toString(36).substring(2, 8)}`;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: registration.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: registration.name,
        phone: registration.phone,
        student_id: studentId
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: registration.email,
        password: tempPassword,
        options: {
          data: {
            name: registration.name,
            phone: registration.phone,
            student_id: studentId
          }
        }
      });

      if (signUpError) {
        return { success: false, error: 'Failed to create user account' };
      }
    }

    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmed_by: adminId
      })
      .eq('id', registrationId);

    if (updateError) {
      return { success: false, error: 'Failed to update registration status' };
    }

    return { success: true, studentId, password: tempPassword };
  } catch (err) {
    console.error('Confirmation error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getRegistrations = async (status?: string): Promise<{
  success: boolean;
  data?: Tables<'registrations'>[];
  error?: string;
}> => {
  try {
    let query = supabase.from('registrations').select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Fetch registrations error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};
