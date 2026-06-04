import { createClient } from "@/lib/supabase/server"
import type { ResearchLine } from "@/types"

export async function getResearchLines(): Promise<ResearchLine[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("research_lines")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllResearchLines(): Promise<ResearchLine[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("research_lines")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
}