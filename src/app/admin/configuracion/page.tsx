"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { settingsSchema, type SettingsFormData } from "@/schemas/settings"
import { createClient } from "@/lib/supabase/client"
import type { SiteSettings } from "@/types"

export default function AdminConfiguracion() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from("site_settings").select("*").limit(1).single()
      if (data) {
        setSettings(data)
        reset({
          team_name: data.team_name,
          master_degree_name: data.master_degree_name,
          university: data.university,
          slogan: data.slogan ?? "",
          history: data.history ?? "",
          about: data.about ?? "",
          objectives: data.objectives ?? "",
          mission: data.mission ?? "",
          vision: data.vision ?? "",
          contact_email: data.contact_email ?? "",
        })
      }
      setLoading(false)
    }
    load()
  }, [reset])

  async function onSubmit(data: SettingsFormData) {
    if (!settings) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from("site_settings").update(data).eq("id", settings.id)
    if (error) {
      toast.error("Error al guardar la configuración.")
    } else {
      toast.success("Configuración actualizada.")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Configuración General</h1>
        <p className="text-sm text-muted-foreground">Información institucional del equipo SKYNET.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identidad */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identidad del equipo</CardTitle>
            <CardDescription>Datos básicos visibles en el sitio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nombre del equipo</Label>
                <Input {...register("team_name")} />
                {errors.team_name && <p className="text-xs text-destructive">{errors.team_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Correo institucional</Label>
                <Input {...register("contact_email")} type="email" />
                {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Slogan</Label>
              <Input {...register("slogan")} placeholder="Innovando el futuro con IA" />
            </div>
          </CardContent>
        </Card>

        {/* Institución */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Institución</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Universidad</Label>
              <Input {...register("university")} />
              {errors.university && <p className="text-xs text-destructive">{errors.university.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Nombre de la maestría</Label>
              <Input {...register("master_degree_name")} />
              {errors.master_degree_name && <p className="text-xs text-destructive">{errors.master_degree_name.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Contenido */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contenido del sitio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Sobre el equipo</Label>
              <Textarea {...register("about")} rows={3} placeholder="Descripción general del equipo..." />
            </div>
            <div className="space-y-1.5">
              <Label>Historia</Label>
              <Textarea {...register("history")} rows={3} placeholder="Historia y contexto del equipo..." />
            </div>
            <div className="space-y-1.5">
              <Label>Objetivos</Label>
              <Textarea {...register("objectives")} rows={3} placeholder="Objetivos del equipo..." />
            </div>
          </CardContent>
        </Card>

        {/* Misión y Visión */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Misión y Visión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Misión</Label>
              <Textarea {...register("mission")} rows={3} placeholder="Misión del equipo..." />
            </div>
            <div className="space-y-1.5">
              <Label>Visión</Label>
              <Textarea {...register("vision")} rows={3} placeholder="Visión del equipo..." />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} className="gap-2 w-full sm:w-auto">
          <Save className="w-4 h-4" />
          {saving ? "Guardando..." : "Guardar configuración"}
        </Button>
      </form>
    </div>
  )
}