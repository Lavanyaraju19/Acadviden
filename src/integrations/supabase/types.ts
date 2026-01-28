export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          role: 'student' | 'admin' | 'instructor'
          student_id: string | null
          mode: 'online' | 'offline' | null
          is_confirmed: boolean
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          role?: 'student' | 'admin' | 'instructor'
          student_id?: string | null
          mode?: 'online' | 'offline' | null
          is_confirmed?: boolean
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          role?: 'student' | 'admin' | 'instructor'
          student_id?: string | null
          mode?: 'online' | 'offline' | null
          is_confirmed?: boolean
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          slug: string
          thumbnail_url: string | null
          duration_weeks: number
          is_published: boolean
          is_featured: boolean
          price: number
          discount_price: number | null
          mode: 'online' | 'offline' | 'hybrid'
          max_students: number | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          slug: string
          thumbnail_url?: string | null
          duration_weeks?: number
          is_published?: boolean
          is_featured?: boolean
          price?: number
          discount_price?: number | null
          mode?: 'online' | 'offline' | 'hybrid'
          max_students?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          slug?: string
          thumbnail_url?: string | null
          duration_weeks?: number
          is_published?: boolean
          is_featured?: boolean
          price?: number
          discount_price?: number | null
          mode?: 'online' | 'offline' | 'hybrid'
          max_students?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          duration_minutes: number | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index?: number
          duration_minutes?: number | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number
          duration_minutes?: number | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          duration_seconds: number | null
          order_index: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          duration_seconds?: number | null
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          duration_seconds?: number | null
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pdfs: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          file_url: string
          file_size_bytes: number | null
          order_index: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          file_url: string
          file_size_bytes?: number | null
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_size_bytes?: number | null
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          module_id: string | null
          name: string
          description: string | null
          tool_url: string | null
          icon_url: string | null
          category: string | null
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id?: string | null
          name: string
          description?: string | null
          tool_url?: string | null
          icon_url?: string | null
          category?: string | null
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string | null
          name?: string
          description?: string | null
          tool_url?: string | null
          icon_url?: string | null
          category?: string | null
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          status: 'pending' | 'active' | 'completed' | 'suspended' | 'cancelled'
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
          certificate_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          status?: 'pending' | 'active' | 'completed' | 'suspended' | 'cancelled'
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          certificate_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          status?: 'pending' | 'active' | 'completed' | 'suspended' | 'cancelled'
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          certificate_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          student_id: string
          enrollment_id: string | null
          amount: number
          currency: string
          payment_mode: 'razorpay' | 'bank_transfer' | 'cash' | 'upi' | 'card' | 'other' | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          transaction_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          payment_date: string | null
          notes: string | null
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          enrollment_id?: string | null
          amount: number
          currency?: string
          payment_mode?: 'razorpay' | 'bank_transfer' | 'cash' | 'upi' | 'card' | 'other' | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          transaction_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          payment_date?: string | null
          notes?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          enrollment_id?: string | null
          amount?: number
          currency?: string
          payment_mode?: 'razorpay' | 'bank_transfer' | 'cash' | 'upi' | 'card' | 'other' | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          transaction_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          payment_date?: string | null
          notes?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          student_id: string
          module_id: string
          video_id: string | null
          pdf_id: string | null
          is_completed: boolean
          completed_at: string | null
          watch_time_seconds: number
          last_position_seconds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          module_id: string
          video_id?: string | null
          pdf_id?: string | null
          is_completed?: boolean
          completed_at?: string | null
          watch_time_seconds?: number
          last_position_seconds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          module_id?: string
          video_id?: string | null
          pdf_id?: string | null
          is_completed?: boolean
          completed_at?: string | null
          watch_time_seconds?: number
          last_position_seconds?: number
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrollment_id: string
          certificate_number: string
          certificate_url: string | null
          issued_at: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrollment_id: string
          certificate_number: string
          certificate_url?: string | null
          issued_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrollment_id?: string
          certificate_number?: string
          certificate_url?: string | null
          issued_at?: string
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          mode: 'online' | 'offline'
          status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
          source: string
          google_sheet_synced: boolean
          google_sheet_row_id: number | null
          confirmed_at: string | null
          confirmed_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          mode: 'online' | 'offline'
          status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
          source?: string
          google_sheet_synced?: boolean
          google_sheet_row_id?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          mode?: 'online' | 'offline'
          status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
          source?: string
          google_sheet_synced?: boolean
          google_sheet_row_id?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'info' | 'success' | 'warning' | 'error' | 'course' | 'payment' | 'certificate'
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'info' | 'success' | 'warning' | 'error' | 'course' | 'payment' | 'certificate'
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'info' | 'success' | 'warning' | 'error' | 'course' | 'payment' | 'certificate'
          title?: string
          message?: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          to_email: string
          subject: string
          template: string | null
          status: 'pending' | 'sent' | 'failed'
          error_message: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          to_email: string
          subject: string
          template?: string | null
          status?: 'pending' | 'sent' | 'failed'
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          to_email?: string
          subject?: string
          template?: string | null
          status?: 'pending' | 'sent' | 'failed'
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_student_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_certificate_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
