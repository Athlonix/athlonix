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
          duration_minute: number;
          id: number;
          id_sport: number | null;
          max_participants: number;
          name: string;
        };
        Insert: {
          duration_minute: number;
          id?: number;
          id_sport?: number | null;
          max_participants: number;
          name: string;
        };
        Update: {
          duration_minute?: number;
          id?: number;
          id_sport?: number | null;
          max_participants?: number;
          name?: string;
        };
        Relationships: [
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
      ACTIVITIES_USERS: {
        Row: {
          created_at: string;
          id_activity: number;
          id_user: number;
        };
        Insert: {
          created_at?: string;
          id_activity: number;
          id_user: number;
        };
        Update: {
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
          id_post: number;
          id_response: number | null;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: number;
          id_activity?: number | null;
          id_post: number;
          id_response?: number | null;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          id_activity?: number | null;
          id_post?: number;
          id_response?: number | null;
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
          created_at: string;
          id: number;
          id_user: number;
          money: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_user: number;
          money?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_user?: number;
          money?: number | null;
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
          content: string | null;
          id: number;
          title: string;
        };
        Insert: {
          content?: string | null;
          id?: number;
          title: string;
        };
        Update: {
          content?: string | null;
          id?: number;
          title?: string;
        };
        Relationships: [];
      };
      POLLS_ANSWERS: {
        Row: {
          answer: string;
          id: number;
          id_poll: number;
        };
        Insert: {
          answer: string;
          id?: number;
          id_poll: number;
        };
        Update: {
          answer?: string;
          id?: number;
          id_poll?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_POLLS_ANSWERS_id_poll_fkey';
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
            foreignKeyName: 'public_POSTS_user_id_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      POSTS_REACTIONS: {
        Row: {
          id_post: number;
          id_user: number;
          like: boolean | null;
          reaction: string | null;
        };
        Insert: {
          id_post: number;
          id_user?: number;
          like?: boolean | null;
          reaction?: string | null;
        };
        Update: {
          id_post?: number;
          id_user?: number;
          like?: boolean | null;
          reaction?: string | null;
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
      SPORTS: {
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
      USERS: {
        Row: {
          email: string;
          first_name: string;
          id: number;
          id_auth: string | null;
          id_referer: number | null;
          id_role: number;
          last_name: string;
          username: string;
        };
        Insert: {
          email: string;
          first_name: string;
          id?: number;
          id_auth?: string | null;
          id_referer?: number | null;
          id_role: number;
          last_name: string;
          username: string;
        };
        Update: {
          email?: string;
          first_name?: string;
          id?: number;
          id_auth?: string | null;
          id_referer?: number | null;
          id_role?: number;
          last_name?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_USERS_id_auth_fkey';
            columns: ['id_auth'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_USERS_id_role_fkey';
            columns: ['id_role'];
            isOneToOne: false;
            referencedRelation: 'ROLES';
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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
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
