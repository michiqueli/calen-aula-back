-- 1. Tablas independientes
CREATE TABLE IF NOT EXISTS public.nivelesEducativos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo text, titulo text, descripcion text, orden integer,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT nivelesEducativos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.periodosLectivos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nivel_id uuid REFERENCES public.nivelesEducativos(id),
  nombre text, ciclo integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT periodosLectivos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.anexos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  numero integer NOT NULL,
  titulo text NOT NULL,
  rango_lectivo text,
  fecha_inicio date,
  fecha_fin date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid, -- Quitamos el default auth.uid() que da problemas
  CONSTRAINT anexos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.archivos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  storage_bucket text DEFAULT 'archivos2'::text,
  storage_path text NOT NULL,
  mime_type text,
  file_size_bytes bigint NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT archivos_pkey PRIMARY KEY (id)
);

-- 2. Tablas con dependencias
CREATE TABLE IF NOT EXISTS public.archivo_etiquetas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  archivo_id uuid NOT NULL REFERENCES public.archivos(id),
  ces_categoria_id uuid,
  ces_anexo_id uuid,
  ces_actividad_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT archivo_etiquetas_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.periodos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT periodos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.fechas_importantes_anexo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  anexo_id uuid NOT NULL REFERENCES public.anexos(id),
  titulo text NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  periodo_id uuid REFERENCES public.periodos(id),
  CONSTRAINT fechas_importantes_anexo_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rangosLectivos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  periodo_id uuid REFERENCES public.periodosLectivos(id),
  tipo text, titulo text, fecha_inicio date, fecha_fin date,
  orden integer, notas text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rangosLectivos_pkey PRIMARY KEY (id)
);

-- 3. Tablas de usuarios
CREATE TABLE IF NOT EXISTS public.users_roles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
  rol text NOT NULL DEFAULT 'usuario'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);