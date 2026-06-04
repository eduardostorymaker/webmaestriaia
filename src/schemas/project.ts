import { z } from "zod"

export const projectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  technologies: z.string().min(1, "Agrega al menos una tecnología"),
  status: z.enum(["planificacion", "desarrollo", "produccion", "finalizado"]),
  project_url: z.string().url("URL inválida").optional().or(z.literal("")),
})

export type ProjectFormData = z.infer<typeof projectSchema>