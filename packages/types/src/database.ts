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
      COMMENTS: {
        Row: {
          content: string;
          id: number;
          id_comment: number | null;
        };
        Insert: {
          content: string;
          id: number;
          id_comment?: number | null;
        };
        Update: {
          content?: string;
          id?: number;
          id_comment?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_id_comment_fkey';
            columns: ['id_comment'];
            isOneToOne: false;
            referencedRelation: 'COMMENTS';
            referencedColumns: ['id'];
          },
        ];
      };
      COMMENTS_POSTS: {
        Row: {
          id_comment: number;
          id_post: number;
        };
        Insert: {
          id_comment: number;
          id_post: number;
        };
        Update: {
          id_comment?: number;
          id_post?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_COMMENTS_POSTS_id_comment_fkey';
            columns: ['id_comment'];
            isOneToOne: false;
            referencedRelation: 'COMMENTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_COMMENTS_POSTS_id_post_fkey';
            columns: ['id_post'];
            isOneToOne: false;
            referencedRelation: 'POSTS';
            referencedColumns: ['id'];
          },
        ];
      };
      POSTS: {
        Row: {
          content: string;
          id: number;
          title: string;
        };
        Insert: {
          content: string;
          id?: number;
          title: string;
        };
        Update: {
          content?: string;
          id?: number;
          title?: string;
        };
        Relationships: [];
      };
      ROLES: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id: number;
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
          id_referer: number;
          id_role: number | null;
          last_name: string;
          username: string;
        };
        Insert: {
          email: string;
          first_name: string;
          id: number;
          id_referer: number;
          id_role?: number | null;
          last_name: string;
          username: string;
        };
        Update: {
          email?: string;
          first_name?: string;
          id?: number;
          id_referer?: number;
          id_role?: number | null;
          last_name?: string;
          username?: string;
        };
        Relationships: [
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
      USERS_COMMENTS: {
        Row: {
          created_at: string;
          id: number;
          id_comment: number | null;
          id_user: number | null;
          like: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_comment?: number | null;
          id_user?: number | null;
          like?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_comment?: number | null;
          id_user?: number | null;
          like?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_USERS_COMMENTS_id_comment_fkey';
            columns: ['id_comment'];
            isOneToOne: false;
            referencedRelation: 'COMMENTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_USERS_COMMENTS_id_user_fkey';
            columns: ['id_user'];
            isOneToOne: false;
            referencedRelation: 'USERS';
            referencedColumns: ['id'];
          },
        ];
      };
      USERS_POSTS: {
        Row: {
          created_at: string;
          id: number;
          id_post: number;
          id_user: number;
          like: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          id_post: number;
          id_user: number;
          like?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          id_post?: number;
          id_user?: number;
          like?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_USERS_POSTS_id_post_fkey';
            columns: ['id_post'];
            isOneToOne: false;
            referencedRelation: 'POSTS';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_USERS_POSTS_id_user_fkey';
            columns: ['id_user'];
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
