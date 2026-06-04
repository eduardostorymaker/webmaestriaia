import { createClient } from "@/lib/supabase/server"
import type { SiteSettings } from "@/types"

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single()

  if (error) return null
  return data
}

export const DEFAULT_SETTINGS: SiteSettings = {
  id: "",
  team_name: "SKYNET",
  master_degree_name: "Maestría en Tecnologías de Información",
  university: "Universidad Tecnológica",
  slogan: "Innovando el futuro con Inteligencia Artificial",
  history: null,
  about: "Somos un equipo de investigadores y desarrolladores apasionados por la tecnología.",
  objectives: null,
  mission: "Desarrollar soluciones tecnológicas innovadoras mediante la investigación aplicada en IA.",
  vision: "Ser referentes en investigación de inteligencia artificial.",
  contact_email: "contacto@skynet-team.mx",
  logo_url: null,
}