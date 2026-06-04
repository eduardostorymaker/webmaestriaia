import { z } from "zod"

export const researchLineSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  objectives: z.string().optional(),
  technologies: z.string().min(1, "Agrega al menos una tecnología"),
  icon: z.string().optional(),
})

export type ResearchLineFormData = z.infer<typeof researchLineSchema>