"use server"

import { createClient } from "@/lib/supabase/server"
import { profileSchema } from "@/schemas/profile"
import { slugify } from "@/lib/utils"
import { revalidatePath } from "next/cache"

export async function createProfile(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const result = profileSchema.safeParse(raw)
  if (!result.success) return { error: "Datos inválidos." }

  const supabase = await createClient()
  const slug = slugify(`${result.data.first_name} ${result.data.last_name}`)

  const { data, error } = await supabase
    .from("profiles")
    .insert({ ...result.data, slug })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/equipo")
  revalidatePath("/admin/integrantes")
  return { data }
}

export async function updateProfile(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const result = profileSchema.safeParse(raw)
  if (!result.success) return { error: "Datos inválidos." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .update(result.data)
    .eq("id", id)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/equipo")
  revalidatePath("/admin/integrantes")
  return { data }
}

export async function deleteProfile(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/equipo")
  revalidatePath("/admin/integrantes")
  return { success: true }
}

export async function updateProfileSkills(profileId: string, skillIds: string[]) {
  const supabase = await createClient()
  await supabase.from("profile_skills").delete().eq("profile_id", profileId)
  if (skillIds.length > 0) {
    await supabase.from("profile_skills").insert(
      skillIds.map((skill_id) => ({ profile_id: profileId, skill_id }))
    )
  }
  revalidatePath("/equipo")
  return { success: true }
}