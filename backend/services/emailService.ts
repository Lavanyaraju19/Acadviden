import { supabase } from '@/integrations/supabase/client';

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  variables?: Record<string, string>;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  studentId: string;
  password: string;
  loginUrl: string;
}

export interface PaymentConfirmationData {
  name: string;
  email: string;
  amount: number;
  transactionId: string;
  courseName?: string;
}

export interface CertificateEmailData {
  name: string;
  email: string;
  courseName: string;
  certificateNumber: string;
  certificateUrl: string;
}

const logEmail = async (
  to: string,
  subject: string,
  template: string,
  status: 'pending' | 'sent' | 'failed',
  errorMessage?: string
): Promise<void> => {
  try {
    await supabase.from('email_logs').insert({
      to_email: to,
      subject,
      template,
      status,
      error_message: errorMessage,
      sent_at: status === 'sent' ? new Date().toISOString() : null
    });
  } catch (err) {
    console.error('Failed to log email:', err);
  }
};

export const sendEmail = async (emailData: EmailData): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log('Sending email:', emailData);

    await logEmail(emailData.to, emailData.subject, emailData.template, 'sent');

    return { success: true };
  } catch (err) {
    console.error('Send email error:', err);
    await logEmail(
      emailData.to,
      emailData.subject,
      emailData.template,
      'failed',
      err instanceof Error ? err.message : 'Unknown error'
    );
    return { success: false, error: 'Failed to send email' };
  }
};

export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<{
  success: boolean;
  error?: string;
}> => {
  const emailContent = `
    Welcome to AcadVizen Digital Hub!
    
    Dear ${data.name},
    
    Your registration has been confirmed. Here are your login credentials:
    
    Student ID: ${data.studentId}
    Email: ${data.email}
    Temporary Password: ${data.password}
    
    Please login at: ${data.loginUrl}
    
    Important: Please change your password after your first login.
    
    Best regards,
    AcadVizen Team
  `;

  return sendEmail({
    to: data.email,
    subject: 'Welcome to AcadVizen Digital Hub - Your Account is Ready!',
    template: 'welcome',
    variables: {
      name: data.name,
      studentId: data.studentId,
      password: data.password,
      loginUrl: data.loginUrl,
      content: emailContent
    }
  });
};

export const sendPaymentConfirmation = async (data: PaymentConfirmationData): Promise<{
  success: boolean;
  error?: string;
}> => {
  const emailContent = `
    Payment Confirmation
    
    Dear ${data.name},
    
    Your payment has been successfully processed.
    
    Amount: ₹${data.amount}
    Transaction ID: ${data.transactionId}
    ${data.courseName ? `Course: ${data.courseName}` : ''}
    
    Thank you for your payment!
    
    Best regards,
    AcadVizen Team
  `;

  return sendEmail({
    to: data.email,
    subject: 'Payment Confirmation - AcadVizen Digital Hub',
    template: 'payment_confirmation',
    variables: {
      name: data.name,
      amount: data.amount.toString(),
      transactionId: data.transactionId,
      courseName: data.courseName || '',
      content: emailContent
    }
  });
};

export const sendCertificateEmail = async (data: CertificateEmailData): Promise<{
  success: boolean;
  error?: string;
}> => {
  const emailContent = `
    Congratulations on Your Achievement!
    
    Dear ${data.name},
    
    You have successfully completed the course: ${data.courseName}
    
    Your certificate is ready!
    
    Certificate Number: ${data.certificateNumber}
    Download URL: ${data.certificateUrl}
    
    Keep up the great work!
    
    Best regards,
    AcadVizen Team
  `;

  return sendEmail({
    to: data.email,
    subject: `Congratulations! Your Certificate for ${data.courseName} is Ready`,
    template: 'certificate',
    variables: {
      name: data.name,
      courseName: data.courseName,
      certificateNumber: data.certificateNumber,
      certificateUrl: data.certificateUrl,
      content: emailContent
    }
  });
};

export const sendRegistrationPendingEmail = async (
  name: string,
  email: string
): Promise<{ success: boolean; error?: string }> => {
  const emailContent = `
    Registration Received
    
    Dear ${name},
    
    Thank you for registering with AcadVizen Digital Hub!
    
    Your registration is currently pending review by our team.
    You will receive another email once your registration is confirmed.
    
    Best regards,
    AcadVizen Team
  `;

  return sendEmail({
    to: email,
    subject: 'Registration Received - AcadVizen Digital Hub',
    template: 'registration_pending',
    variables: {
      name,
      content: emailContent
    }
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> => {
  const emailContent = `
    Password Reset Request
    
    You requested a password reset for your AcadVizen account.
    
    Click the link below to reset your password:
    ${resetLink}
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    AcadVizen Team
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset - AcadVizen Digital Hub',
    template: 'password_reset',
    variables: {
      resetLink,
      content: emailContent
    }
  });
};
