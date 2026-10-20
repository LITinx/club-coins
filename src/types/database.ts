export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'admin'
export type UserStatus = 'active' | 'inactive'
export type TransactionType = 'award' | 'transfer' | 'redemption'
export type NotificationType = 'award' | 'transfer_received' | 'transfer_sent' | 'redemption'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          role: UserRole
          balance: number
          status: UserStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name: string
          role?: UserRole
          balance?: number
          status?: UserStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          role?: UserRole
          balance?: number
          status?: UserStatus
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: TransactionType
          amount: number
          from_user_id: string | null
          to_user_id: string
          reward_id: string | null
          description: string | null
          created_at: string
          fulfilled_at: string | null
        }
        Insert: {
          id?: string
          type: TransactionType
          amount: number
          from_user_id?: string | null
          to_user_id: string
          reward_id?: string | null
          description?: string | null
          created_at?: string
          fulfilled_at?: string | null
        }
        Update: {
          id?: string
          type?: TransactionType
          amount?: number
          from_user_id?: string | null
          to_user_id?: string
          reward_id?: string | null
          description?: string | null
          created_at?: string
          fulfilled_at?: string | null
        }
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string | null
          coin_cost: number
          inventory: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          coin_cost: number
          inventory?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          coin_cost?: number
          inventory?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          message: string
          read: boolean
          related_transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          message: string
          read?: boolean
          related_transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          message?: string
          read?: boolean
          related_transaction_id?: string | null
          created_at?: string
        }
      }
    }
    Enums: {
      user_role: UserRole
      user_status: UserStatus
      transaction_type: TransactionType
      notification_type: NotificationType
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

export type Reward = Database['public']['Tables']['rewards']['Row']
export type RewardInsert = Database['public']['Tables']['rewards']['Insert']
export type RewardUpdate = Database['public']['Tables']['rewards']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

// Extended types with relations
export interface TransactionWithUsers extends Transaction {
  from_user?: { id: string; display_name: string } | null
  to_user: { id: string; display_name: string }
  reward?: { id: string; name: string } | null
}

export interface ClubStats {
  total_members: number
  active_members: number
  total_coins_distributed: number
  total_coins_redeemed: number
  total_coins_in_circulation: number
  recent_transactions: number
}
