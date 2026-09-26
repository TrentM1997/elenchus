export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          created_at: string
          email: string | null
          id: number
          password: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          password?: string | null
          user_id?: string
          user_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          password?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          article_url: string
          authors: string[] | null
          bias: string | null
          country: string | null
          created_at: string
          date_published: string
          factual_reporting: string | null
          full_text: string
          id: number
          image_url: string | null
          normalizedUrl: string | null
          provider: string
          summary: string | null
          title: string
          urlHash: string | null
        }
        Insert: {
          article_url: string
          authors?: string[] | null
          bias?: string | null
          country?: string | null
          created_at?: string
          date_published: string
          factual_reporting?: string | null
          full_text: string
          id?: number
          image_url?: string | null
          normalizedUrl?: string | null
          provider: string
          summary?: string | null
          title: string
          urlHash?: string | null
        }
        Update: {
          article_url?: string
          authors?: string[] | null
          bias?: string | null
          country?: string | null
          created_at?: string
          date_published?: string
          factual_reporting?: string | null
          full_text?: string
          id?: number
          image_url?: string | null
          normalizedUrl?: string | null
          provider?: string
          summary?: string | null
          title?: string
          urlHash?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          article_id: number
          created_at: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          article_id: number
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          article_id?: number
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      investigation_sources: {
        Row: {
          article_id: number
          created_at: string
          id: string
          investigation_id: number
        }
        Insert: {
          article_id: number
          created_at?: string
          id?: string
          investigation_id: number
        }
        Update: {
          article_id?: number
          created_at?: string
          id?: string
          investigation_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "investigation_sources_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investigation_sources_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
        ]
      }
      investigations: {
        Row: {
          biases: string | null
          changed_opinion: boolean | null
          created_at: string
          ending_perspective: string | null
          expertise: string | null
          had_merit: boolean | null
          id: number
          idea: string
          initial_perspective: string | null
          new_concepts: boolean | null
          premises: string | null
          sources: string[] | null
          takeaway: string | null
          user_id: string | null
          wikipedia_extracts: Json[] | null
        }
        Insert: {
          biases?: string | null
          changed_opinion?: boolean | null
          created_at?: string
          ending_perspective?: string | null
          expertise?: string | null
          had_merit?: boolean | null
          id?: number
          idea: string
          initial_perspective?: string | null
          new_concepts?: boolean | null
          premises?: string | null
          sources?: string[] | null
          takeaway?: string | null
          user_id?: string | null
          wikipedia_extracts?: Json[] | null
        }
        Update: {
          biases?: string | null
          changed_opinion?: boolean | null
          created_at?: string
          ending_perspective?: string | null
          expertise?: string | null
          had_merit?: boolean | null
          id?: number
          idea?: string
          initial_perspective?: string | null
          new_concepts?: boolean | null
          premises?: string | null
          sources?: string[] | null
          takeaway?: string | null
          user_id?: string | null
          wikipedia_extracts?: Json[] | null
        }
        Relationships: []
      }
      sources: {
        Row: {
          bias: string | null
          bias_rating_url: string | null
          country: string | null
          domain: string | null
          factual_rating_url: string | null
          factual_reporting: string | null
          id: string
          last_synced: string | null
          logo_url: string | null
          name: string
          notes: string | null
        }
        Insert: {
          bias?: string | null
          bias_rating_url?: string | null
          country?: string | null
          domain?: string | null
          factual_rating_url?: string | null
          factual_reporting?: string | null
          id?: string
          last_synced?: string | null
          logo_url?: string | null
          name: string
          notes?: string | null
        }
        Update: {
          bias?: string | null
          bias_rating_url?: string | null
          country?: string | null
          domain?: string | null
          factual_rating_url?: string | null
          factual_reporting?: string | null
          id?: string
          last_synced?: string | null
          logo_url?: string | null
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
