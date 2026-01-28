import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type TableName = 'courses' | 'modules' | 'videos' | 'pdfs' | 'tools' | 'profiles' | 'enrollments' | 'payments';

export const createEntity = async <T extends TableName>(
  table: T,
  data: TablesInsert<T>
): Promise<{ success: boolean; data?: Tables<T>; error?: string }> => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data as any)
      .select()
      .single();

    if (error) {
      console.error(`Create ${table} error:`, error);
      return { success: false, error: error.message };
    }

    return { success: true, data: result as Tables<T> };
  } catch (err) {
    console.error(`Create ${table} error:`, err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const updateEntity = async <T extends TableName>(
  table: T,
  id: string,
  data: TablesUpdate<T>
): Promise<{ success: boolean; data?: Tables<T>; error?: string }> => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Update ${table} error:`, error);
      return { success: false, error: error.message };
    }

    return { success: true, data: result as Tables<T> };
  } catch (err) {
    console.error(`Update ${table} error:`, err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const deleteEntity = async <T extends TableName>(
  table: T,
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Delete ${table} error:`, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error(`Delete ${table} error:`, err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getEntities = async <T extends TableName>(
  table: T,
  options?: {
    filters?: Record<string, any>;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
  }
): Promise<{ success: boolean; data?: Tables<T>[]; error?: string }> => {
  try {
    let query = supabase.from(table).select('*');

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Fetch ${table} error:`, error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Tables<T>[] };
  } catch (err) {
    console.error(`Fetch ${table} error:`, err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getEntityById = async <T extends TableName>(
  table: T,
  id: string
): Promise<{ success: boolean; data?: Tables<T>; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Fetch ${table} by id error:`, error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Tables<T> };
  } catch (err) {
    console.error(`Fetch ${table} by id error:`, err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getCourseWithContent = async (courseId: string): Promise<{
  success: boolean;
  data?: {
    course: Tables<'courses'>;
    modules: (Tables<'modules'> & {
      videos: Tables<'videos'>[];
      pdfs: Tables<'pdfs'>[];
      tools: Tables<'tools'>[];
    })[];
  };
  error?: string;
}> => {
  try {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError) {
      return { success: false, error: courseError.message };
    }

    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (modulesError) {
      return { success: false, error: modulesError.message };
    }

    const modulesWithContent = await Promise.all(
      (modules || []).map(async (module) => {
        const [videosRes, pdfsRes, toolsRes] = await Promise.all([
          supabase.from('videos').select('*').eq('module_id', module.id).order('order_index'),
          supabase.from('pdfs').select('*').eq('module_id', module.id).order('order_index'),
          supabase.from('tools').select('*').eq('module_id', module.id)
        ]);

        return {
          ...module,
          videos: videosRes.data || [],
          pdfs: pdfsRes.data || [],
          tools: toolsRes.data || []
        };
      })
    );

    return {
      success: true,
      data: {
        course,
        modules: modulesWithContent
      }
    };
  } catch (err) {
    console.error('Get course with content error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getStudentStats = async (): Promise<{
  success: boolean;
  data?: {
    totalStudents: number;
    confirmedStudents: number;
    pendingRegistrations: number;
    totalEnrollments: number;
    activeEnrollments: number;
    totalPayments: number;
    completedPayments: number;
  };
  error?: string;
}> => {
  try {
    const [
      profilesRes,
      registrationsRes,
      enrollmentsRes,
      paymentsRes
    ] = await Promise.all([
      supabase.from('profiles').select('id, is_confirmed', { count: 'exact' }).eq('role', 'student'),
      supabase.from('registrations').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('enrollments').select('id, status', { count: 'exact' }),
      supabase.from('payments').select('id, status', { count: 'exact' })
    ]);

    const profiles = profilesRes.data || [];
    const totalStudents = profilesRes.count || 0;
    const confirmedStudents = profiles.filter(p => p.is_confirmed).length;
    const pendingRegistrations = registrationsRes.count || 0;
    
    const enrollments = enrollmentsRes.data || [];
    const totalEnrollments = enrollmentsRes.count || 0;
    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
    
    const payments = paymentsRes.data || [];
    const totalPayments = paymentsRes.count || 0;
    const completedPayments = payments.filter(p => p.status === 'completed').length;

    return {
      success: true,
      data: {
        totalStudents,
        confirmedStudents,
        pendingRegistrations,
        totalEnrollments,
        activeEnrollments,
        totalPayments,
        completedPayments
      }
    };
  } catch (err) {
    console.error('Get student stats error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};
