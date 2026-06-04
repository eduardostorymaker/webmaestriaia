"use server"

import { createClient } from "@/lib/supabase/server"
import { contactSchema } from "@/schemas/contact"

export async function submitContact(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  }

  const result = contactSchema.safeParse(raw)
  if (!result.success) {
    return { error: "Datos inválidos. Verifica el formulario." }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert(result.data)

  if (error) return { error: "Error al enviar el mensaje. Intenta de nuevo." }
  return { success: true }
}