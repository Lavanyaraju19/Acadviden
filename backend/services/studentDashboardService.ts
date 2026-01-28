import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface StudentDashboardData {
  profile: Tables<'profiles'>;
  enrollments: (Tables<'enrollments'> & {
    course: Tables<'courses'>;
  })[];
  certificates: Tables<'certificates'>[];
  recentProgress: Tables<'progress'>[];
  notifications: Tables<'notifications'>[];
}

export const getStudentDashboard = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: StudentDashboardData;
  error?: string;
}> => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (profileError) {
      return { success: false, error: 'Failed to fetch profile' };
    }

    if (!profile.is_confirmed) {
      return { success: false, error: 'Account not confirmed. Please wait for admin approval.' };
    }

    const [enrollmentsRes, certificatesRes, progressRes, notificationsRes] = await Promise.all([
      supabase
        .from('enrollments')
        .select('*, course:courses(*)')
        .eq('student_id', studentId)
        .order('enrolled_at', { ascending: false }),
      supabase
        .from('certificates')
        .select('*')
        .eq('student_id', studentId)
        .order('issued_at', { ascending: false }),
      supabase
        .from('progress')
        .select('*')
        .eq('student_id', studentId)
        .order('updated_at', { ascending: false })
        .limit(10),
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', studentId)
        .order('created_at', { ascending: false })
        .limit(20)
    ]);

    return {
      success: true,
      data: {
        profile,
        enrollments: (enrollmentsRes.data || []) as (Tables<'enrollments'> & { course: Tables<'courses'> })[],
        certificates: certificatesRes.data || [],
        recentProgress: progressRes.data || [],
        notifications: notificationsRes.data || []
      }
    };
  } catch (err) {
    console.error('Get student dashboard error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getCourseProgress = async (
  studentId: string,
  courseId: string
): Promise<{
  success: boolean;
  data?: {
    enrollment: Tables<'enrollments'>;
    totalModules: number;
    completedModules: number;
    totalVideos: number;
    completedVideos: number;
    totalPdfs: number;
    completedPdfs: number;
    progressPercentage: number;
  };
  error?: string;
}> => {
  try {
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return { success: false, error: 'Not enrolled in this course' };
    }

    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId);

    const moduleIds = (modules || []).map(m => m.id);
    const totalModules = moduleIds.length;

    let totalVideos = 0;
    let completedVideos = 0;
    let totalPdfs = 0;
    let completedPdfs = 0;

    if (moduleIds.length > 0) {
      const [videosRes, pdfsRes, progressRes] = await Promise.all([
        supabase.from('videos').select('id').in('module_id', moduleIds),
        supabase.from('pdfs').select('id').in('module_id', moduleIds),
        supabase.from('progress').select('*').eq('student_id', studentId).eq('is_completed', true)
      ]);

      totalVideos = (videosRes.data || []).length;
      totalPdfs = (pdfsRes.data || []).length;

      const completedProgress = progressRes.data || [];
      completedVideos = completedProgress.filter(p => p.video_id).length;
      completedPdfs = completedProgress.filter(p => p.pdf_id).length;
    }

    const totalItems = totalVideos + totalPdfs;
    const completedItems = completedVideos + completedPdfs;
    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    const completedModules = 0;

    return {
      success: true,
      data: {
        enrollment,
        totalModules,
        completedModules,
        totalVideos,
        completedVideos,
        totalPdfs,
        completedPdfs,
        progressPercentage
      }
    };
  } catch (err) {
    console.error('Get course progress error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const updateProgress = async (
  studentId: string,
  moduleId: string,
  contentId: string,
  contentType: 'video' | 'pdf',
  progressData: {
    isCompleted?: boolean;
    watchTimeSeconds?: number;
    lastPositionSeconds?: number;
  }
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const existingQuery = supabase
      .from('progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('module_id', moduleId);

    if (contentType === 'video') {
      existingQuery.eq('video_id', contentId);
    } else {
      existingQuery.eq('pdf_id', contentId);
    }

    const { data: existing } = await existingQuery.single();

    const progressUpdate = {
      student_id: studentId,
      module_id: moduleId,
      [contentType === 'video' ? 'video_id' : 'pdf_id']: contentId,
      is_completed: progressData.isCompleted ?? existing?.is_completed ?? false,
      watch_time_seconds: progressData.watchTimeSeconds ?? existing?.watch_time_seconds ?? 0,
      last_position_seconds: progressData.lastPositionSeconds ?? existing?.last_position_seconds ?? 0,
      completed_at: progressData.isCompleted ? new Date().toISOString() : existing?.completed_at
    };

    if (existing) {
      const { error } = await supabase
        .from('progress')
        .update(progressUpdate)
        .eq('id', existing.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from('progress')
        .insert(progressUpdate);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Update progress error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const markNotificationRead = async (
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Mark notification read error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const checkStudentAccess = async (
  studentId: string
): Promise<{
  hasAccess: boolean;
  reason?: string;
}> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_confirmed, payment_status, role')
      .eq('id', studentId)
      .single();

    if (error || !profile) {
      return { hasAccess: false, reason: 'Profile not found' };
    }

    if (profile.role !== 'student') {
      return { hasAccess: true };
    }

    if (!profile.is_confirmed) {
      return { hasAccess: false, reason: 'Account not confirmed by admin' };
    }

    return { hasAccess: true };
  } catch (err) {
    console.error('Check student access error:', err);
    return { hasAccess: false, reason: 'An error occurred' };
  }
};
