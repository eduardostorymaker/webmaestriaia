import { createClient } from "@/lib/supabase/server"
import type { Skill } from "@/types"

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("name")

  if (error) throw error
  return data || []
}