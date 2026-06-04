"use server"

import { createClient } from "@/lib/supabase/server"
import { projectSchema } from "@/schemas/project"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    technologies: formData.get("technologies") as string,
    status: formData.get("status") as string,
    project_url: formData.get("project_url") as string,
  }

  const result = projectSchema.safeParse(raw)
  if (!result.success) return { error: "Datos inválidos." }

  const technologies = result.data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...result.data, technologies })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/proyectos")
  revalidatePath("/admin/proyectos")
  return { data }
}

export async function updateProject(id: string, formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    technologies: formData.get("technologies") as string,
    status: formData.get("status") as string,
    project_url: formData.get("project_url") as string,
  }

  const result = projectSchema.safeParse(raw)
  if (!result.success) return { error: "Datos inválidos." }

  const technologies = result.data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .update({ ...result.data, technologies })
    .eq("id", id)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/proyectos")
  revalidatePath("/admin/proyectos")
  return { data }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/proyectos")
  revalidatePath("/admin/proyectos")
  return { success: true }
}