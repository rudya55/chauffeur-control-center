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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounting_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          id: string
          payment_status: string
          reservation_id: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          payment_status?: string
          reservation_id?: string | null
          transaction_date?: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          payment_status?: string
          reservation_id?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounting_transactions_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      airport_packages: {
        Row: {
          active: boolean | null
          airport_zone_id: string
          created_at: string
          description: string | null
          destination_zone_id: string | null
          extra_waiting_price: number | null
          flat_rate: number
          id: string
          included_waiting_time: number | null
          package_name: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          active?: boolean | null
          airport_zone_id: string
          created_at?: string
          description?: string | null
          destination_zone_id?: string | null
          extra_waiting_price?: number | null
          flat_rate: number
          id?: string
          included_waiting_time?: number | null
          package_name: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          active?: boolean | null
          airport_zone_id?: string
          created_at?: string
          description?: string | null
          destination_zone_id?: string | null
          extra_waiting_price?: number | null
          flat_rate?: number
          id?: string
          included_waiting_time?: number | null
          package_name?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "airport_packages_airport_zone_id_fkey"
            columns: ["airport_zone_id"]
            isOneToOne: false
            referencedRelation: "geographic_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airport_packages_destination_zone_id_fkey"
            columns: ["destination_zone_id"]
            isOneToOne: false
            referencedRelation: "geographic_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_documents: {
        Row: {
          document_name: string
          document_type: string
          document_url: string
          id: string
          rejection_reason: string | null
          status: string | null
          uploaded_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          document_url: string
          id?: string
          rejection_reason?: string | null
          status?: string | null
          uploaded_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          document_url?: string
          id?: string
          rejection_reason?: string | null
          status?: string | null
          uploaded_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      geographic_zones: {
        Row: {
          coordinates: Json
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          zone_type: string
        }
        Insert: {
          coordinates: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          zone_type: string
        }
        Update: {
          coordinates?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          zone_type?: string
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          active: boolean | null
          base_price: number
          created_at: string
          id: string
          is_flat_rate: boolean | null
          name: string
          price_per_km: number | null
          price_per_minute: number | null
          updated_at: string
          vehicle_type: string
          zone_from_id: string | null
          zone_to_id: string | null
        }
        Insert: {
          active?: boolean | null
          base_price: number
          created_at?: string
          id?: string
          is_flat_rate?: boolean | null
          name: string
          price_per_km?: number | null
          price_per_minute?: number | null
          updated_at?: string
          vehicle_type: string
          zone_from_id?: string | null
          zone_to_id?: string | null
        }
        Update: {
          active?: boolean | null
          base_price?: number
          created_at?: string
          id?: string
          is_flat_rate?: boolean | null
          name?: string
          price_per_km?: number | null
          price_per_minute?: number | null
          updated_at?: string
          vehicle_type?: string
          zone_from_id?: string | null
          zone_to_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_zone_from_id_fkey"
            columns: ["zone_from_id"]
            isOneToOne: false
            referencedRelation: "geographic_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_rules_zone_to_id_fkey"
            columns: ["zone_to_id"]
            isOneToOne: false
            referencedRelation: "geographic_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          fcm_token: string | null
          full_name: string | null
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          fcm_token?: string | null
          full_name?: string | null
          id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          fcm_token?: string | null
          full_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          actual_pickup_time: string | null
          amount: number
          client_name: string
          comment: string | null
          commission: number
          created_at: string
          date: string
          destination: string
          dispatcher: string
          dispatcher_logo: string | null
          distance: string | null
          driver_amount: number
          driver_id: string | null
          dropoff_time: string | null
          duration: string | null
          flight_number: string | null
          id: string
          luggage: number
          passengers: number
          payment_type: string
          phone: string
          pickup_address: string
          rating: number | null
          route: Json | null
          status: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          actual_pickup_time?: string | null
          amount: number
          client_name: string
          comment?: string | null
          commission: number
          created_at?: string
          date: string
          destination: string
          dispatcher: string
          dispatcher_logo?: string | null
          distance?: string | null
          driver_amount: number
          driver_id?: string | null
          dropoff_time?: string | null
          duration?: string | null
          flight_number?: string | null
          id?: string
          luggage?: number
          passengers?: number
          payment_type: string
          phone: string
          pickup_address: string
          rating?: number | null
          route?: Json | null
          status?: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          actual_pickup_time?: string | null
          amount?: number
          client_name?: string
          comment?: string | null
          commission?: number
          created_at?: string
          date?: string
          destination?: string
          dispatcher?: string
          dispatcher_logo?: string | null
          distance?: string | null
          driver_amount?: number
          driver_id?: string | null
          dropoff_time?: string | null
          duration?: string | null
          flight_number?: string | null
          id?: string
          luggage?: number
          passengers?: number
          payment_type?: string
          phone?: string
          pickup_address?: string
          rating?: number | null
          route?: Json | null
          status?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "driver"
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
    Enums: {
      app_role: ["admin", "driver"],
    },
  },
} as const
