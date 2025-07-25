export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
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
                    date_published: string | null
                    factual_reporting: string | null
                    full_text: string | null
                    id: number
                    image_url: string | null
                    normalizedUrl: string | null
                    provider: string | null
                    summary: string | null
                    title: string | null
                    urlHash: string | null
                    user_id: string | null
                }
                Insert: {
                    article_url: string
                    authors?: string[] | null
                    bias?: string | null
                    country?: string | null
                    created_at?: string
                    date_published?: string | null
                    factual_reporting?: string | null
                    full_text?: string | null
                    id?: number
                    image_url?: string | null
                    normalizedUrl?: string | null
                    provider?: string | null
                    summary?: string | null
                    title?: string | null
                    urlHash?: string | null
                    user_id?: string | null
                }
                Update: {
                    article_url?: string
                    authors?: string[] | null
                    bias?: string | null
                    country?: string | null
                    created_at?: string
                    date_published?: string | null
                    factual_reporting?: string | null
                    full_text?: string | null
                    id?: number
                    image_url?: string | null
                    normalizedUrl?: string | null
                    provider?: string | null
                    summary?: string | null
                    title?: string | null
                    urlHash?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            investigations: {
                Row: {
                    biases: string | null
                    changed_opinion: boolean | null
                    created_at: string
                    ending_perspective: string | null
                    had_merit: boolean | null
                    id: number
                    idea: string | null
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
                    had_merit?: boolean | null
                    id?: number
                    idea?: string | null
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
                    had_merit?: boolean | null
                    id?: number
                    idea?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
