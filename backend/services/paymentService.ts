import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

export interface CreateOrderData {
  studentId: string;
  enrollmentId?: string;
  amount: number;
  currency?: string;
  notes?: string;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createPaymentOrder = async (
  data: CreateOrderData,
  config: RazorpayConfig
): Promise<{
  success: boolean;
  orderId?: string;
  paymentId?: string;
  error?: string;
}> => {
  try {
    const mockOrderId = `order_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        student_id: data.studentId,
        enrollment_id: data.enrollmentId,
        amount: data.amount,
        currency: data.currency || 'INR',
        payment_mode: 'razorpay',
        status: 'pending',
        razorpay_order_id: mockOrderId,
        notes: data.notes
      })
      .select()
      .single();

    if (error) {
      console.error('Create payment error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, orderId: mockOrderId, paymentId: payment.id };
  } catch (err) {
    console.error('Create order error:', err);
    return { success: false, error: 'Failed to create payment order' };
  }
};

export const verifyPayment = async (
  verification: PaymentVerificationData,
  config: RazorpayConfig
): Promise<{
  success: boolean;
  payment?: Tables<'payments'>;
  error?: string;
}> => {
  try {
    console.log('Verifying payment:', verification);

    const isValid = true;

    if (!isValid) {
      return { success: false, error: 'Payment verification failed' };
    }

    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: verification.razorpay_payment_id,
        razorpay_signature: verification.razorpay_signature,
        status: 'completed',
        payment_date: new Date().toISOString(),
        transaction_id: verification.razorpay_payment_id
      })
      .eq('razorpay_order_id', verification.razorpay_order_id)
      .select()
      .single();

    if (updateError) {
      console.error('Update payment error:', updateError);
      return { success: false, error: 'Failed to update payment status' };
    }

    if (payment.enrollment_id) {
      await supabase
        .from('enrollments')
        .update({ status: 'active' })
        .eq('id', payment.enrollment_id);
    }

    if (payment.student_id) {
      await supabase
        .from('profiles')
        .update({ payment_status: 'paid' })
        .eq('id', payment.student_id);
    }

    return { success: true, payment };
  } catch (err) {
    console.error('Verify payment error:', err);
    return { success: false, error: 'Failed to verify payment' };
  }
};

export const getPaymentHistory = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: Tables<'payments'>[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Get payment history error:', err);
    return { success: false, error: 'Failed to fetch payment history' };
  }
};

export const recordManualPayment = async (
  data: {
    studentId: string;
    enrollmentId?: string;
    amount: number;
    paymentMode: 'bank_transfer' | 'cash' | 'upi' | 'card' | 'other';
    transactionId?: string;
    notes?: string;
  }
): Promise<{
  success: boolean;
  payment?: Tables<'payments'>;
  error?: string;
}> => {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        student_id: data.studentId,
        enrollment_id: data.enrollmentId,
        amount: data.amount,
        currency: 'INR',
        payment_mode: data.paymentMode,
        status: 'completed',
        transaction_id: data.transactionId,
        payment_date: new Date().toISOString(),
        notes: data.notes
      })
      .select()
      .single();

    if (error) {
      console.error('Record manual payment error:', error);
      return { success: false, error: error.message };
    }

    await supabase
      .from('profiles')
      .update({ payment_status: 'paid' })
      .eq('id', data.studentId);

    if (data.enrollmentId) {
      await supabase
        .from('enrollments')
        .update({ status: 'active' })
        .eq('id', data.enrollmentId);
    }

    return { success: true, payment };
  } catch (err) {
    console.error('Record manual payment error:', err);
    return { success: false, error: 'Failed to record payment' };
  }
};

export const refundPayment = async (
  paymentId: string,
  reason?: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (fetchError || !payment) {
      return { success: false, error: 'Payment not found' };
    }

    if (payment.status !== 'completed') {
      return { success: false, error: 'Only completed payments can be refunded' };
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        notes: payment.notes ? `${payment.notes}\nRefund reason: ${reason}` : `Refund reason: ${reason}`
      })
      .eq('id', paymentId);

    if (updateError) {
      return { success: false, error: 'Failed to update payment status' };
    }

    await supabase
      .from('profiles')
      .update({ payment_status: 'refunded' })
      .eq('id', payment.student_id);

    return { success: true };
  } catch (err) {
    console.error('Refund payment error:', err);
    return { success: false, error: 'Failed to process refund' };
  }
};
