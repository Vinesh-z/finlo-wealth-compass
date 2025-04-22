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
      fixed_deposits: {
        Row: {
          bank_name: string | null
          created_at: string | null
          id: string
          interest_rate: number
          maturity_date: string
          name: string
          notes: string | null
          principal_amount: number
          start_date: string
          user_id: string | null
        }
        Insert: {
          bank_name?: string | null
          created_at?: string | null
          id?: string
          interest_rate: number
          maturity_date: string
          name: string
          notes?: string | null
          principal_amount: number
          start_date: string
          user_id?: string | null
        }
        Update: {
          bank_name?: string | null
          created_at?: string | null
          id?: string
          interest_rate?: number
          maturity_date?: string
          name?: string
          notes?: string | null
          principal_amount?: number
          start_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      insurance: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          name: string
          notes: string | null
          policy_number: string | null
          premium_amount: number | null
          premium_frequency: string | null
          provider: string
          start_date: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          name: string
          notes?: string | null
          policy_number?: string | null
          premium_amount?: number | null
          premium_frequency?: string | null
          provider: string
          start_date: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          policy_number?: string | null
          premium_amount?: number | null
          premium_frequency?: string | null
          provider?: string
          start_date?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      insurance_documents: {
        Row: {
          file_name: string
          file_path: string
          file_type: string
          id: string
          insurance_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_type: string
          id?: string
          insurance_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          insurance_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_documents_insurance_id_fkey"
            columns: ["insurance_id"]
            isOneToOne: false
            referencedRelation: "insurance"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          created_at: string
          current_value: number
          id: string
          initial_value: number
          name: string
          notes: string | null
          purchase_date: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value: number
          id?: string
          initial_value: number
          name: string
          notes?: string | null
          purchase_date: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number
          id?: string
          initial_value?: number
          name?: string
          notes?: string | null
          purchase_date?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      precious_metals: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          purchase_date: string
          purchase_price_per_unit: number
          quantity: number
          type: string
          unit: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          purchase_date: string
          purchase_price_per_unit: number
          quantity: number
          type: string
          unit: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          purchase_date?: string
          purchase_price_per_unit?: number
          quantity?: number
          type?: string
          unit?: string
          user_id?: string | null
        }
        Relationships: []
      }
      provident_funds: {
        Row: {
          created_at: string | null
          current_balance: number
          id: string
          interest_rate: number
          name: string
          notes: string | null
          start_date: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_balance: number
          id?: string
          interest_rate: number
          name: string
          notes?: string | null
          start_date: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_balance?: number
          id?: string
          interest_rate?: number
          name?: string
          notes?: string | null
          start_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_completed: boolean | null
          reminder_date: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          reminder_date: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          reminder_date?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          type: string
          user_id?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          currency: string | null
          last_updated: string | null
          theme: string | null
          user_id: string
        }
        Insert: {
          currency?: string | null
          last_updated?: string | null
          theme?: string | null
          user_id: string
        }
        Update: {
          currency?: string | null
          last_updated?: string | null
          theme?: string | null
          user_id?: string
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
