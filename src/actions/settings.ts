"use server"

import { createClient } from "@/lib/supabase/server"
import { settingsSchema } from "@/schemas/settings"
import { revalidatePath } from "next/cache"

export async function updateSettings(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const result = settingsSchema.safeParse(raw)
  if (!result.success) return { error: "Datos inválidos." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .update(result.data)
    .eq("id", id)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/")
  revalidatePath("/admin/configuracion")
  return { data }
}