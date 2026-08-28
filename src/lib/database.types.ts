/**
 * Tipos das tabelas do Supabase — espelham `supabase/schema.sql`.
 *
 * Escritos a mao para o projeto funcionar sem passo de codegen. Se voce mudar o
 * esquema, atualize aqui tambem (ou gere com
 * `npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts`).
 */

export type Database = {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: string;
          nome: string;
          email: string | null;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          id: string;
          nome?: string;
          email?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
        Relationships: [];
      };
      progresso_modulos: {
        Row: {
          usuario_id: string;
          modulo_id: string;
          /** Aproveitamento de 0 a 1. */
          aproveitamento: number;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          usuario_id: string;
          modulo_id: string;
          aproveitamento: number;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: {
          usuario_id?: string;
          modulo_id?: string;
          aproveitamento?: number;
          criado_em?: string;
          atualizado_em?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      /** Grava a nota do modulo mantendo sempre a MELHOR (ver schema.sql). */
      registrar_nota: {
        Args: { p_modulo_id: string; p_aproveitamento: number };
        Returns: Database['public']['Tables']['progresso_modulos']['Row'];
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type Perfil = Database['public']['Tables']['perfis']['Row'];
export type ProgressoModulo = Database['public']['Tables']['progresso_modulos']['Row'];
