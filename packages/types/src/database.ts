export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ACTIVITIES: {
        Row: {
          days_of_week: Database['public']['Enums']['days'][] | null;
          description: string | null;
          end_date: string | null;
          end_time: string | null;
          frequency: Database['public']['Enums']['frequency'] | null;
          id: number;
          id_address: number | null;
          id_sport: number | null;
          max_participants: number;
          min_participants: number;
          name: string;
          start_date: string | null;
          start_time: string | null;
        };
        Insert: {
          days_of_week?: Database['public']['Enums']['days'][] | null;
          description?: string | null;
          end_date?: string | null;
          end_time?: string | null;
          frequency?: Database['public']['Enums']['frequency'] | null;
          id?: number;
          id_address?: number | null;
          id_sport?: number | null;
          max_participants: number;
          min_participants: number;
          name: string;
          start_date?: string | null;
          start_time?: string | null;
        };
        Update: {
          days_of_week?: Database['public']['Enums']['days'][] | null;
          description?: string | null;
          end_date?: string | null;
          end_time?: string | null;
          frequency?: Database['public']['Enums']['frequency'] | null;
          id?: number;
          id_address?: number | null;
          id_sport?: number | null;
          max_participants?: number;
          min_participants?: number;
          name?: string;
          start_date?: string | null;
          start_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_ACTIVITIES_id_address_fkey';
            columns: ['id_address'];
            isOneToOne: false;
            referencedRelation: 'ADDRESSES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_ACTIVITIES_id_sport_fkey';
            columns: ['id_sport'];
            isOneToOne: false;
            referencedRelation: 'SPORTS';
            referencedColumns: ['id'];
          },
        ];
      };
      ACTIVITIES_CATEGORIES: {
        Row: {
          id_activity: number;
          id_category: number;
        };
        Insert: {
          id_activity: number;
          id_category: number;
        };
        Update: {
          id_activity?: number;
          id_category?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_ACTIVITIES_CATEGORIES_id_activity_fkey';
            columns: ['id_activity'];
            isOneToOne: false;
            referencedRelation: 'ACTIVITIES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_ACTIVITIES_CATEGORIES_id_category_fkey';
            columns: ['id_category'];
            isOneToOne: false;
            referencedRelation: 'CATEGORIES';
            referencedColumns: ['id'];
          },
        ];
      };
      ACTIVITIES_EXCEPTIONS: {
        Row: {
          date: string;
          id: number;
          id_activity: number;
          max_participants: number | null;
          min_participants: number | null;
        };
        Insert: {
          date: string;
          id?: number;
          id_activity: number;
          max_participants?: number | null;
          min_participants?: number | null;
        };
        Update: {
          date?: string;
          id?: number;
          id_activity?: number;
          max_participants?: number | null;
          min_participants?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ACTIVITIES_EXCEPTIONS_id_activity_fkey';
            columns: ['id_activity'];
            isOneToOne: false;
            referencedRelation: 'ACTIVITIES';
            referencedColumns: ['id'];
          },
        ];
      };
      ACTIVITIES_TASKS: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          id_activity_exception: number;
          id_employee: number | null;
          priority: Database['public']['Enums']['priority'];
          status: Database['public']['Enums']['status'];
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          id_activity_exception: number;
          id_employee?: number | null;
          priority: Database['public']['Enums']['priority'];
          status: Database['public']['Enums']['status'];
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          id_activity_exception?: number;
          id_employee?: number | null;
          priority?: Database['public']['Enums']['priority'];
          status?: Database['public']['Enums']['status'];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ACTIVITIES_TASKS_id_activity_fkey';
            columns: ['id_activity_exception'];
            isOneToOne: false;
            referencedRelation: 'ACTIVITIES_EXCEPTIONS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ACTIVITIES_TASKS_id_employee_fkey';
            columns: ['id_employee'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      ACTIVITIES_USERS: {
        Row: {
          active: boolean;
          created_at: string;
          id_activity: number;
          id_user: number;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id_activity: number;
          id_user: number;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id_activity?: number;
          id_user?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_ACTIVITIES_USERS_id_activity_fkey';
            columns: ['id_activity'];
            isOneToOne: false;
            referencedRelation: 'ACTIVITIES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_ACTIVITIES_USERS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      ACTIVITY_TEAMS: {
        Row: {
          id_activity: number;
          id_user: number;
        };
        Insert: {
          id_activity: number;
          id_user: number;
        };
        Update: {
          id_activity?: number;
          id_user?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'ACTIVITY_TEAM_id_activity_fkey';
            columns: ['id_activity'];
            isOneToOne: false;
            referencedRelation: 'ACTIVITIES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ACTIVITY_TEAM_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      ADDRESSES: {
        Row: {
          city: string;
          complement: string | null;
          id: number;
          id_lease: number | null;
          name: string | null;
          number: number;
          postal_code: string;
          road: string;
        };
        Insert: {
          city: string;
          complement?: string | null;
          id?: number;
          id_lease?: number | null;
          name?: string | null;
          number: number;
          postal_code: string;
          road: string;
        };
        Update: {
          city?: string;
          complement?: string | null;
          id?: number;
          id_lease?: number | null;
          name?: string | null;
          number?: number;
          postal_code?: string;
          road?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_ADDRESS_id_lease_fkey';
            columns: ['id_lease'];
            isOneToOne: false;
            referencedRelation: 'LEASE';
            referencedColumns: ['id'];
          },
        ];
      };
      ADDRESSES_MATERIALS: {
        Row: {
          id_address: number;
          id_material: number;
          quantity: number;
        };
        Insert: {
          id_address: number;
          id_material: number;
          quantity: number;
        };
        Update: {
          id_address?: number;
          id_material?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_ADDRESSES_MATERIALS_id_address_fkey';
            columns: ['id_address'];
            isOneToOne: false;
            referencedRelation: 'ADDRESSES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_ADDRESSES_MATERIALS_id_material_fkey';
            columns: ['id_material'];
            isOneToOne: false;
            referencedRelation: 'MATERIALS';
            referencedColumns: ['id'];
          },
        ];
      };
      APPLICATIONS: {
        Row: {
          created_at: string;
          id: number;
          id_user: number;
          nature: string;
          reason: string;
          reply: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_user: number;
          nature: string;
          reason: string;
          reply?: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_user?: number;
          nature?: string;
          reason?: string;
          reply?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_APPLICATIONS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      CATEGORIES: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      COMMENTS: {
        Row: {
          content: string;
          created_at: string;
          id: number;
          id_activity: number | null;
          id_post: number | null;
          id_response: number | null;
          id_user: number;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: number;
          id_activity?: number | null;
          id_post?: number | null;
          id_response?: number | null;
          id_user: number;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          id_activity?: number | null;
          id_post?: number | null;
          id_response?: number | null;
          id_user?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_id_comment_fkey';
            columns: ['id_response'];
            isOneToOne: false;
            referencedRelation: 'COMMENTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_COMMENTS_id_activity_fkey';
            columns: ['id_activity'];
            isOneToOne: false;
            referencedRelation: 'ACTIVITIES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_COMMENTS_id_post_fkey';
            columns: ['id_post'];
            isOneToOne: false;
            referencedRelation: 'POSTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_COMMENTS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      COMMENTS_REACTIONS: {
        Row: {
          id_comment: number;
          id_user: number;
          like: boolean | null;
          reaction: string | null;
        };
        Insert: {
          id_comment: number;
          id_user?: number;
          like?: boolean | null;
          reaction?: string | null;
        };
        Update: {
          id_comment?: number;
          id_user?: number;
          like?: boolean | null;
          reaction?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_COMMENTS_LIKES_id_comment_fkey';
            columns: ['id_comment'];
            isOneToOne: false;
            referencedRelation: 'COMMENTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_COMMENTS_LIKES_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      DONATIONS: {
        Row: {
          amount: number;
          created_at: string;
          id: number;
          id_user: number | null;
          receipt_url: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: number;
          id_user?: number | null;
          receipt_url: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: number;
          id_user?: number | null;
          receipt_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_DONATIONS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      EVENTS: {
        Row: {
          created_at: string;
          id: number;
          id_user: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_user: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_user?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_EVENTS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      LANDLORD: {
        Row: {
          email: string;
          first_name: string;
          id: number;
          last_name: string;
          phone: string;
        };
        Insert: {
          email: string;
          first_name: string;
          id?: number;
          last_name: string;
          phone: string;
        };
        Update: {
          email?: string;
          first_name?: string;
          id?: number;
          last_name?: string;
          phone?: string;
        };
        Relationships: [];
      };
      LEASE: {
        Row: {
          end_lease: string;
          id: number;
          id_landlord: number;
          payment_date: string;
          rent: number;
          start_lease: string;
        };
        Insert: {
          end_lease: string;
          id?: number;
          id_landlord: number;
          payment_date: string;
          rent: number;
          start_lease: string;
        };
        Update: {
          end_lease?: string;
          id?: number;
          id_landlord?: number;
          payment_date?: string;
          rent?: number;
          start_lease?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_LEASE_id_landlord_fkey';
            columns: ['id_landlord'];
            isOneToOne: false;
            referencedRelation: 'LANDLORD';
            referencedColumns: ['id'];
          },
        ];
      };
      MATCHES: {
        Row: {
          end_time: string | null;
          id: number;
          id_round: number;
          start_time: string | null;
        };
        Insert: {
          end_time?: string | null;
          id?: number;
          id_round: number;
          start_time?: string | null;
        };
        Update: {
          end_time?: string | null;
          id?: number;
          id_round?: number;
          start_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'MATCHES_id_round_fkey';
            columns: ['id_round'];
            isOneToOne: false;
            referencedRelation: 'ROUNDS';
            referencedColumns: ['id'];
          },
        ];
      };
      MATERIALS: {
        Row: {
          id: number;
          name: string;
          weight_grams: number | null;
        };
        Insert: {
          id?: number;
          name: string;
          weight_grams?: number | null;
        };
        Update: {
          id?: number;
          name?: string;
          weight_grams?: number | null;
        };
        Relationships: [];
      };
      MESSAGES: {
        Row: {
          created_at: string;
          id: number;
          id_receiver: number;
          id_sender: number;
          mesage: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_receiver: number;
          id_sender: number;
          mesage?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_receiver?: number;
          id_sender?: number;
          mesage?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_MESSAGES_id_receiver_fkey';
            columns: ['id_receiver'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_MESSAGES_id_sender_fkey';
            columns: ['id_sender'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      NEWS: {
        Row: {
          content: string;
          created_at: string;
          id: number;
          id_user: number;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: number;
          id_user: number;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          id_user?: number;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_NEWS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      POLLS: {
        Row: {
          description: string | null;
          end_at: string;
          id: number;
          id_user: number;
          max_choices: number;
          start_at: string;
          title: string;
        };
        Insert: {
          description?: string | null;
          end_at: string;
          id?: number;
          id_user: number;
          max_choices?: number;
          start_at: string;
          title: string;
        };
        Update: {
          description?: string | null;
          end_at?: string;
          id?: number;
          id_user?: number;
          max_choices?: number;
          start_at?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_POLLS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      POLLS_OPTIONS: {
        Row: {
          content: string;
          id: number;
          id_poll: number;
        };
        Insert: {
          content: string;
          id?: number;
          id_poll: number;
        };
        Update: {
          content?: string;
          id?: number;
          id_poll?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_POLLS_OPTIONS_id_poll_fkey';
            columns: ['id_poll'];
            isOneToOne: false;
            referencedRelation: 'POLLS';
            referencedColumns: ['id'];
          },
        ];
      };
      POLLS_VOTES: {
        Row: {
          id: number;
          id_option: number;
          id_poll: number;
        };
        Insert: {
          id?: number;
          id_option: number;
          id_poll: number;
        };
        Update: {
          id?: number;
          id_option?: number;
          id_poll?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_POLLS_VOTES_id_option_fkey';
            columns: ['id_option'];
            isOneToOne: false;
            referencedRelation: 'POLLS_OPTIONS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_POLLS_VOTES_id_poll_fkey';
            columns: ['id_poll'];
            isOneToOne: false;
            referencedRelation: 'POLLS';
            referencedColumns: ['id'];
          },
        ];
      };
      POSTS: {
        Row: {
          content: string;
          cover_image: string | null;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          id: number;
          id_user: number;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          cover_image?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: number;
          id_user: number;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          cover_image?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: number;
          id_user?: number;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_POSTS_user_id_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      POSTS_CATEGORIES: {
        Row: {
          id: number;
          id_category: number;
          id_post: number;
        };
        Insert: {
          id?: number;
          id_category: number;
          id_post: number;
        };
        Update: {
          id?: number;
          id_category?: number;
          id_post?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'POSTS_CATEGORIES_id_category_fkey';
            columns: ['id_category'];
            isOneToOne: false;
            referencedRelation: 'CATEGORIES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'POSTS_CATEGORIES_id_post_fkey';
            columns: ['id_post'];
            isOneToOne: false;
            referencedRelation: 'POSTS';
            referencedColumns: ['id'];
          },
        ];
      };
      POSTS_REACTIONS: {
        Row: {
          id_post: number;
          id_user: number;
          reaction: Database['public']['Enums']['reaction'] | null;
        };
        Insert: {
          id_post: number;
          id_user?: number;
          reaction?: Database['public']['Enums']['reaction'] | null;
        };
        Update: {
          id_post?: number;
          id_user?: number;
          reaction?: Database['public']['Enums']['reaction'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_POSTS_LIKES_id_post_fkey';
            columns: ['id_post'];
            isOneToOne: false;
            referencedRelation: 'POSTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_POSTS_LIKES_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      POSTS_VIEWS: {
        Row: {
          id_post: number;
          id_user: number;
          viewed: string;
        };
        Insert: {
          id_post: number;
          id_user?: number;
          viewed?: string;
        };
        Update: {
          id_post?: number;
          id_user?: number;
          viewed?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'POSTS_VIEWS_id_post_fkey';
            columns: ['id_post'];
            isOneToOne: false;
            referencedRelation: 'POSTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'POSTS_VIEWS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      PRODUCTS: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          id_buyer: number | null;
          id_seller: number;
          name: string;
          price: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: number;
          id_buyer?: number | null;
          id_seller: number;
          name: string;
          price: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: number;
          id_buyer?: number | null;
          id_seller?: number;
          name?: string;
          price?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_PRODUCTS_id_buyer_fkey';
            columns: ['id_buyer'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_PRODUCTS_id_user_fkey';
            columns: ['id_seller'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      PROPOSALS: {
        Row: {
          created_at: string;
          id: number;
          id_user: number;
          proposal: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_user: number;
          proposal: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_user?: number;
          proposal?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_PROPOSALS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      REASONS: {
        Row: {
          id: number;
          reason: string;
        };
        Insert: {
          id?: number;
          reason: string;
        };
        Update: {
          id?: number;
          reason?: string;
        };
        Relationships: [];
      };
      REPORTS: {
        Row: {
          content: string;
          created_at: string;
          id: number;
          id_comment: number | null;
          id_post: number | null;
          id_reason: number;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: number;
          id_comment?: number | null;
          id_post?: number | null;
          id_reason: number;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          id_comment?: number | null;
          id_post?: number | null;
          id_reason?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'REPORTS_id_comment_fkey';
            columns: ['id_comment'];
            isOneToOne: false;
            referencedRelation: 'COMMENTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'REPORTS_id_post_fkey';
            columns: ['id_post'];
            isOneToOne: false;
            referencedRelation: 'POSTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'REPORTS_id_reason_fkey';
            columns: ['id_reason'];
            isOneToOne: false;
            referencedRelation: 'REASONS';
            referencedColumns: ['id'];
          },
        ];
      };
      RESERVED: {
        Row: {
          created_at: string;
          date_reserved: string;
          id: number;
          id_activity: number | null;
          id_material: number | null;
          id_tournament: number | null;
          quantity: number;
        };
        Insert: {
          created_at?: string;
          date_reserved: string;
          id?: number;
          id_activity?: number | null;
          id_material?: number | null;
          id_tournament?: number | null;
          quantity: number;
        };
        Update: {
          created_at?: string;
          date_reserved?: string;
          id?: number;
          id_activity?: number | null;
          id_material?: number | null;
          id_tournament?: number | null;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_RESERVED_id_activity_fkey';
            columns: ['id_activity'];
            isOneToOne: false;
            referencedRelation: 'ACTIVITIES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_RESERVED_id_material_fkey';
            columns: ['id_material'];
            isOneToOne: false;
            referencedRelation: 'MATERIALS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_RESERVED_id_tournament_fkey';
            columns: ['id_tournament'];
            isOneToOne: false;
            referencedRelation: 'TOURNAMENTS';
            referencedColumns: ['id'];
          },
        ];
      };
      ROLES: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      ROUNDS: {
        Row: {
          id: number;
          id_tournament: number;
          name: string;
          order: number;
        };
        Insert: {
          id?: number;
          id_tournament: number;
          name: string;
          order?: number;
        };
        Update: {
          id?: number;
          id_tournament?: number;
          name?: string;
          order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'ROUNDS_id_tournament_fkey';
            columns: ['id_tournament'];
            isOneToOne: false;
            referencedRelation: 'TOURNAMENTS';
            referencedColumns: ['id'];
          },
        ];
      };
      SPORTS: {
        Row: {
          description: string | null;
          id: number;
          image: string | null;
          max_players: number | null;
          min_players: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          image?: string | null;
          max_players?: number | null;
          min_players?: number;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          image?: string | null;
          max_players?: number | null;
          min_players?: number;
          name?: string;
        };
        Relationships: [];
      };
      TEAMS: {
        Row: {
          created_at: string;
          id: number;
          id_tournament: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_tournament: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_tournament?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'TEAMS_id_tournament_fkey';
            columns: ['id_tournament'];
            isOneToOne: false;
            referencedRelation: 'TOURNAMENTS';
            referencedColumns: ['id'];
          },
        ];
      };
      TEAMS_MATCHES: {
        Row: {
          id_match: number;
          id_team: number;
          winner: boolean | null;
        };
        Insert: {
          id_match: number;
          id_team: number;
          winner?: boolean | null;
        };
        Update: {
          id_match?: number;
          id_team?: number;
          winner?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'TEAMS_MATCHES_id_match_fkey';
            columns: ['id_match'];
            isOneToOne: false;
            referencedRelation: 'MATCHES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'TEAMS_MATCHES_id_team_fkey';
            columns: ['id_team'];
            isOneToOne: false;
            referencedRelation: 'TEAMS';
            referencedColumns: ['id'];
          },
        ];
      };
      TOURNAMENTS: {
        Row: {
          created_at: string;
          default_match_length: number | null;
          id: number;
          id_address: number | null;
          max_participants: number;
          name: string;
          prize: string | null;
          rules: string | null;
          team_capacity: number;
        };
        Insert: {
          created_at?: string;
          default_match_length?: number | null;
          id?: number;
          id_address?: number | null;
          max_participants: number;
          name: string;
          prize?: string | null;
          rules?: string | null;
          team_capacity: number;
        };
        Update: {
          created_at?: string;
          default_match_length?: number | null;
          id?: number;
          id_address?: number | null;
          max_participants?: number;
          name?: string;
          prize?: string | null;
          rules?: string | null;
          team_capacity?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'TOURNAMENTS_id_address_fkey';
            columns: ['id_address'];
            isOneToOne: false;
            referencedRelation: 'TOURNAMENTS';
            referencedColumns: ['id'];
          },
        ];
      };
      USERS: {
        Row: {
          created_at: string;
          date_validity: string | null;
          deleted_at: string | null;
          email: string;
          first_name: string;
          id: number;
          id_auth: string | null;
          id_referer: number | null;
          invoice: string | null;
          last_name: string;
          subscription: string | null;
          username: string;
        };
        Insert: {
          created_at: string;
          date_validity?: string | null;
          deleted_at?: string | null;
          email: string;
          first_name: string;
          id?: number;
          id_auth?: string | null;
          id_referer?: number | null;
          invoice?: string | null;
          last_name: string;
          subscription?: string | null;
          username: string;
        };
        Update: {
          created_at?: string;
          date_validity?: string | null;
          deleted_at?: string | null;
          email?: string;
          first_name?: string;
          id?: number;
          id_auth?: string | null;
          id_referer?: number | null;
          invoice?: string | null;
          last_name?: string;
          subscription?: string | null;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_USERS_id_auth_fkey';
            columns: ['id_auth'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'users_id_referer_fkey';
            columns: ['id_referer'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      USERS_ROLES: {
        Row: {
          id_role: number;
          id_user: number;
        };
        Insert: {
          id_role: number;
          id_user: number;
        };
        Update: {
          id_role?: number;
          id_user?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_USERS_ROLES_id_role_fkey';
            columns: ['id_role'];
            isOneToOne: false;
            referencedRelation: 'ROLES';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_USERS_ROLES_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      USERS_TEAMS: {
        Row: {
          id_team: number;
          id_user: number;
          information: string | null;
          position: string | null;
        };
        Insert: {
          id_team: number;
          id_user: number;
          information?: string | null;
          position?: string | null;
        };
        Update: {
          id_team?: number;
          id_user?: number;
          information?: string | null;
          position?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_USERS_TEAMS_id_team_fkey';
            columns: ['id_team'];
            isOneToOne: false;
            referencedRelation: 'TEAMS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_USERS_TEAMS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      USERS_VOTES: {
        Row: {
          id: number;
          id_poll: number;
          user: string;
        };
        Insert: {
          id?: number;
          id_poll: number;
          user: string;
        };
        Update: {
          id?: number;
          id_poll?: number;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_USERS_VOTES_id_poll_fkey';
            columns: ['id_poll'];
            isOneToOne: false;
            referencedRelation: 'POLLS';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      days: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      frequency: 'weekly' | 'monthly' | 'yearly' | 'daily';
      priority: 'P0' | 'P1' | 'P2' | 'P3';
      reaction: 'like';
      status: 'not started' | 'in progress' | 'completed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
