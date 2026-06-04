import { z } from "zod"

export const profileSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Correo inválido"),
  career: z.string().min(1, "La carrera es requerida"),
  specialty: z.string().min(1, "La especialidad es requerida"),
  role: z.string().min(1, "El rol es requerido"),
  biography: z.string().optional(),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL inválida").optional().or(z.literal("")),
  portfolio: z.string().url("URL inválida").optional().or(z.literal("")),
})

export type ProfileFormData = z.infer<typeof profileSchema>