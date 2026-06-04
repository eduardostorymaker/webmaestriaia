-- SKYNET Portal Académico - Supabase Schema
-- Ejecutar en el SQL Editor de Supabase

-- Habilitar extensiones
create extension if not exists "uuid-ossp";

-- =============================================
-- TABLA: profiles (Integrantes del equipo)
-- =============================================
create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  career text not null default '',
  specialty text not null default '',
  role text not null default 'Integrante',
  biography text,
  photo_url text,
  linkedin text,
  github text,
  portfolio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =============================================
-- TABLA: skills (Habilidades)
-- =============================================
create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique
);

-- =============================================
-- TABLA: profile_skills (Relación perfil-habilidad)
-- =============================================
create table if not exists public.profile_skills (
  profile_id uuid references public.profiles(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  primary key (profile_id, skill_id)
);

-- =============================================
-- TABLA: research_lines (Líneas de investigación)
-- =============================================
create table if not exists public.research_lines (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null default '',
  objectives text,
  technologies text[] default '{}',
  icon text,
  active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =============================================
-- TABLA: projects (Proyectos)
-- =============================================
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null default '',
  image_url text,
  technologies text[] default '{}',
  status text not null default 'desarrollo' check (status in ('planificacion', 'desarrollo', 'produccion', 'finalizado')),
  project_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =============================================
-- TABLA: contact_messages (Mensajes de contacto)
-- =============================================
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now() not null
);

-- =============================================
-- TABLA: site_settings (Configuración del sitio)
-- =============================================
create table if not exists public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  team_name text not null default 'SKYNET',
  master_degree_name text not null default 'Maestría en Tecnología e IA',
  university text not null default 'Universidad',
  slogan text,
  history text,
  about text,
  objectives text,
  mission text,
  vision text,
  contact_email text,
  logo_url text
);

-- Insertar configuración inicial
insert into public.site_settings (
  team_name, master_degree_name, university, slogan, about, mission, vision, contact_email
) values (
  'SKYNET',
  'Maestría en Tecnologías de Información',
  'Universidad Tecnológica',
  'Innovando el futuro con Inteligencia Artificial',
  'Somos un equipo de investigadores y desarrolladores apasionados por la tecnología y la inteligencia artificial.',
  'Desarrollar soluciones tecnológicas innovadoras que transformen la sociedad mediante la investigación aplicada en inteligencia artificial.',
  'Ser referentes en investigación y desarrollo de tecnologías de inteligencia artificial a nivel nacional e internacional.',
  'contacto@skynet-team.mx'
) on conflict do nothing;

-- =============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- =============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_research_lines_updated
  before update on public.research_lines
  for each row execute procedure public.handle_updated_at();

create trigger on_projects_updated
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.profile_skills enable row level security;
alter table public.research_lines enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- Políticas públicas de lectura
create policy "Public can read profiles" on public.profiles for select using (true);
create policy "Public can read skills" on public.skills for select using (true);
create policy "Public can read profile_skills" on public.profile_skills for select using (true);
create policy "Public can read active research_lines" on public.research_lines for select using (active = true);
create policy "Public can read projects" on public.projects for select using (true);
create policy "Public can read site_settings" on public.site_settings for select using (true);

-- Políticas de escritura para mensajes de contacto (público puede insertar)
create policy "Public can insert contact_messages" on public.contact_messages for insert with check (true);

-- Políticas de admin (usuarios autenticados pueden hacer todo)
create policy "Admin can manage profiles" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Admin can manage skills" on public.skills for all using (auth.role() = 'authenticated');
create policy "Admin can manage profile_skills" on public.profile_skills for all using (auth.role() = 'authenticated');
create policy "Admin can manage research_lines" on public.research_lines for all using (auth.role() = 'authenticated');
create policy "Admin can manage projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Admin can read contact_messages" on public.contact_messages for select using (auth.role() = 'authenticated');
create policy "Admin can manage site_settings" on public.site_settings for all using (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKETS
-- =============================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('projects', 'projects', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('research-lines', 'research-lines', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('site-assets', 'site-assets', true) on conflict do nothing;

-- Políticas de storage
create policy "Public can view avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Admin can manage avatars" on storage.objects for all using (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Public can view projects images" on storage.objects for select using (bucket_id = 'projects');
create policy "Admin can manage projects images" on storage.objects for all using (bucket_id = 'projects' and auth.role() = 'authenticated');

create policy "Public can view site assets" on storage.objects for select using (bucket_id = 'site-assets');
create policy "Admin can manage site assets" on storage.objects for all using (bucket_id = 'site-assets' and auth.role() = 'authenticated');

-- =============================================
-- DATOS DE EJEMPLO (Líneas de investigación)
-- =============================================
insert into public.research_lines (name, description, objectives, technologies, icon, active) values
  ('Inteligencia Artificial', 'Investigación y desarrollo de soluciones basadas en aprendizaje automático, modelos generativos y sistemas inteligentes.', 'Desarrollar modelos de IA aplicados a problemas reales', ARRAY['Python', 'TensorFlow', 'PyTorch', 'OpenAI'], 'Brain', true),
  ('Machine Learning', 'Aplicación de algoritmos de aprendizaje automático para análisis predictivo y toma de decisiones automatizada.', 'Implementar soluciones ML en producción', ARRAY['Scikit-learn', 'XGBoost', 'MLflow', 'Python'], 'TrendingUp', true),
  ('Ciencia de Datos', 'Extracción de conocimiento a partir de grandes volúmenes de datos mediante análisis estadístico y visualización.', 'Transformar datos en insights accionables', ARRAY['Python', 'Pandas', 'Spark', 'Tableau'], 'BarChart', true),
  ('Arquitectura de Software', 'Diseño y construcción de sistemas de software escalables, mantenibles y de alto rendimiento.', 'Crear arquitecturas robustas para sistemas complejos', ARRAY['Microservices', 'Docker', 'Kubernetes', 'AWS'], 'Layers', true),
  ('Computación en la Nube', 'Implementación y gestión de soluciones tecnológicas en plataformas cloud para alta disponibilidad.', 'Optimizar costos y rendimiento en la nube', ARRAY['AWS', 'GCP', 'Azure', 'Terraform'], 'Cloud', true),
  ('Ciberseguridad', 'Protección de sistemas de información mediante análisis de vulnerabilidades y estrategias de defensa.', 'Garantizar la seguridad de los sistemas digitales', ARRAY['Kali Linux', 'Wireshark', 'OWASP', 'Python'], 'Shield', true)
on conflict do nothing;

-- Habilidades de ejemplo
insert into public.skills (name) values
  ('Python'), ('JavaScript'), ('TypeScript'), ('React'), ('Next.js'),
  ('Node.js'), ('PostgreSQL'), ('MongoDB'), ('Docker'), ('Kubernetes'),
  ('Machine Learning'), ('TensorFlow'), ('PyTorch'), ('AWS'), ('GCP'),
  ('Git'), ('Linux'), ('FastAPI'), ('GraphQL'), ('Redis')
on conflict do nothing;