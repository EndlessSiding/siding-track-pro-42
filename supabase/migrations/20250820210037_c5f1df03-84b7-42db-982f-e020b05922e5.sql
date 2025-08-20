
-- 1) Criar tabela backup_history (idempotente)
CREATE TABLE IF NOT EXISTS public.backup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  included_tables TEXT[] NOT NULL DEFAULT '{}'::text[],
  file_size BIGINT NOT NULL DEFAULT 0,
  backup_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Habilitar RLS (idempotente)
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;

-- 3) Policy permissiva (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'backup_history'
      AND policyname = 'Allow all operations on backup_history'
  ) THEN
    CREATE POLICY "Allow all operations on backup_history"
      ON public.backup_history
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END$$;

-- 4) Trigger para manter updated_at (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_backup_history_updated_at'
  ) THEN
    CREATE TRIGGER update_backup_history_updated_at
      BEFORE UPDATE ON public.backup_history
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;
