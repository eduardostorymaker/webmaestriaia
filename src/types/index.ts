export interface Profile {
  id: string
  slug: string
  first_name: string
  last_name: string
  email: string
  career: string
  specialty: string
  role: string
  biography: string | null
  photo_url: string | null
  linkedin: string | null
  github: string | null
  portfolio: string | null
  created_at: string
  updated_at: string
  skills?: Skill[]
  projects?: Project[]
}

export interface Skill {
  id: string
  name: string
}

export interface ProfileSkill {
  profile_id: string
  skill_id: string
}

export interface ResearchLine {
  id: string
  name: string
  description: string
  objectives: string | null
  technologies: string[]
  icon: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string
  image_url: string | null
  technologies: string[]
  status: ProjectStatus
  project_url: string | null
  created_at: string
  updated_at: string
}

export type ProjectStatus = "planificacion" | "desarrollo" | "produccion" | "finalizado"

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface SiteSettings {
  id: string
  team_name: string
  master_degree_name: string
  university: string
  slogan: string | null
  history: string | null
  about: string | null
  objectives: string | null
  mission: string | null
  vision: string | null
  contact_email: string | null
  logo_url: string | null
}

export interface NavItem {
  label: string
  href: string
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planificacion: "Planificación",
  desarrollo: "Desarrollo",
  produccion: "Producción",
  finalizado: "Finalizado",
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  planificacion: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  desarrollo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  produccion: "bg-green-500/20 text-green-400 border-green-500/30",
  finalizado: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
}