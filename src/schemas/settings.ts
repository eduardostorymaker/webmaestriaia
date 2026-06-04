import { z } from "zod"

export const settingsSchema = z.object({
  team_name: z.string().min(1, "El nombre del equipo es requerido"),
  master_degree_name: z.string().min(1, "El nombre de la maestría es requerido"),
  university: z.string().min(1, "La universidad es requerida"),
  slogan: z.string().optional(),
  history: z.string().optional(),
  about: z.string().optional(),
  objectives: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  contact_email: z.string().email("Correo inválido").optional().or(z.literal("")),
})

export type SettingsFormData = z.infer<typeof settingsSchema>