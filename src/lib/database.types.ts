export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar: string | null;
          is_anonymous: boolean;
          coins: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar?: string | null;
          is_anonymous?: boolean;
          coins?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          display_name?: string;
          avatar?: string | null;
          is_anonymous?: boolean;
          coins?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coin_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'purchase' | 'gift_sent' | 'gift_received' | 'boost' | 'refund';
          stripe_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'purchase' | 'gift_sent' | 'gift_received' | 'boost' | 'refund';
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: 'purchase' | 'gift_sent' | 'gift_received' | 'boost' | 'refund';
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
