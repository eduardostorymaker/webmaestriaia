import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/types"

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*, profile_skills(skill_id, skills(id, name))")
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data || []).map(normalizeProfile)
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*, profile_skills(skill_id, skills(id, name))")
    .eq("slug", slug)
    .single()

  if (error) return null
  return normalizeProfile(data)
}

export async function getFeaturedProfiles(limit = 4): Promise<Partial<Profile>[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, slug, first_name, last_name, specialty, role, photo_url")
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

function normalizeProfile(raw: Record<string, unknown>): Profile {
  const skills = Array.isArray(raw.profile_skills)
    ? raw.profile_skills
        .map((ps: Record<string, unknown>) => {
          const skill = ps.skills as Record<string, unknown> | null
          return skill ? { id: skill.id as string, name: skill.name as string } : null
        })
        .filter(Boolean)
    : []

  return { ...raw, skills } as Profile
}