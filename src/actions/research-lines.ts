"use server"

import { createClient } from "@/lib/supabase/server"
import { researchLineSchema } from "@/schemas/research-line"
import { revalidatePath } from "next/cache"

export async function createResearchLine(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    objectives: formData.get("objectives") as string,
    technologies: formData.get("technologies") as string,
    icon: formData.get("icon") as string,
    active: formData.get("active") === "true",
  }

  const result = researchLineSchema.safeParse(raw)
  if (!result.success) return { error: "Datos inválidos." }

  const technologies = result.data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("research_lines")
    .insert({ ...result.data, technologies })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/lineas-investigacion")
  revalidatePath("/admin/lineas")
  return { data }
}

export async function updateResearchLine(id: string, formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    objectives: formData.get("objectives") as string,
    technologies: formData.get("technologies") as string,
    icon: formData.get("icon") as string,
    active: formData.get("active") === "true",
  }

  const result = researchLineSchema.safeParse(raw)
  if (!result.success) return { error: "Datos inválidos." }

  const technologies = result.data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("research_lines")
    .update({ ...result.data, technologies })
    .eq("id", id)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/lineas-investigacion")
  revalidatePath("/admin/lineas")
  return { data }
}

export async function deleteResearchLine(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("research_lines").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/lineas-investigacion")
  revalidatePath("/admin/lineas")
  return { success: true }
}