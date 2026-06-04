"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Plus, Pencil, Trash2, Users, Upload, X, ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { profileSchema, type ProfileFormData } from "@/schemas/profile"
import { createClient } from "@/lib/supabase/client"
import { slugify, getInitials } from "@/lib/utils"
import type { Profile } from "@/types"

export default function AdminIntegrantes() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)

  // Photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  async function loadProfiles() {
    const supabase = createClient()
    const { data } = await supabase.from("profiles").select("*").order("created_at")
    setProfiles(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadProfiles() }, [])

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5 MB.")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen.")
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function removePhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function uploadPhoto(profileId: string): Promise<string | null> {
    if (!photoFile) return null
    setUploadingPhoto(true)
    const supabase = createClient()
    const ext = photoFile.name.split(".").pop()
    const path = `${profileId}.${ext}`

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, photoFile, { upsert: true, contentType: photoFile.type })

    if (error) {
      toast.error("Error al subir la foto.")
      setUploadingPhoto(false)
      return null
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
    setUploadingPhoto(false)
    return data.publicUrl
  }

  function openCreate() {
    setEditing(null)
    setPhotoFile(null)
    setPhotoPreview(null)
    reset({})
    setOpen(true)
  }

  function openEdit(profile: Profile) {
    setEditing(profile)
    setPhotoFile(null)
    setPhotoPreview(profile.photo_url ?? null)
    reset({
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      career: profile.career,
      specialty: profile.specialty,
      role: profile.role,
      biography: profile.biography ?? "",
      linkedin: profile.linkedin ?? "",
      github: profile.github ?? "",
      portfolio: profile.portfolio ?? "",
    })
    setOpen(true)
  }

  async function onSubmit(data: ProfileFormData) {
    setSaving(true)
    const supabase = createClient()
    try {
      if (editing) {
        // Subir foto nueva si hay
        let photo_url = editing.photo_url
        if (photoFile) {
          const url = await uploadPhoto(editing.id)
          if (url) photo_url = url
        }
        const { error } = await supabase
          .from("profiles")
          .update({ ...data, photo_url })
          .eq("id", editing.id)
        if (error) throw error
        toast.success("Integrante actualizado.")
      } else {
        // Crear primero sin foto para obtener el ID
        const slug = slugify(`${data.first_name} ${data.last_name}`)
        const { data: created, error } = await supabase
          .from("profiles")
          .insert({ ...data, slug, photo_url: null })
          .select()
          .single()
        if (error) throw error

        // Subir foto con el ID real
        if (photoFile && created) {
          const url = await uploadPhoto(created.id)
          if (url) {
            await supabase.from("profiles").update({ photo_url: url }).eq("id", created.id)
          }
        }
        toast.success("Integrante creado.")
      }
      setOpen(false)
      loadProfiles()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteProfile(id: string) {
    const supabase = createClient()
    // Eliminar foto del storage si existe
    const profile = profiles.find((p) => p.id === id)
    if (profile?.photo_url) {
      const path = profile.photo_url.split("/avatars/").pop()
      if (path) await supabase.storage.from("avatars").remove([path])
    }
    const { error } = await supabase.from("profiles").delete().eq("id", id)
    if (error) { toast.error("Error al eliminar."); return }
    toast.success("Integrante eliminado.")
    loadProfiles()
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrantes</h1>
          <p className="text-sm text-muted-foreground">{profiles.length} integrante(s) registrado(s).</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo integrante
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay integrantes"
          description="Agrega el primer integrante del equipo."
          action={<Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Agregar</Button>}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">Especialidad</TableHead>
                  <TableHead className="hidden md:table-cell">Rol</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Mini avatar con foto */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center">
                          {profile.photo_url ? (
                            <Image
                              src={profile.photo_url}
                              alt={`${profile.first_name} ${profile.last_name}`}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-primary">
                              {getInitials(profile.first_name, profile.last_name)}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-sm">{profile.first_name} {profile.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{profile.specialty}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">{profile.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{profile.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(profile)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar integrante?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará {profile.first_name} {profile.last_name} del sistema, incluyendo su foto.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProfile(profile.id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── DIALOG CREAR/EDITAR ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar integrante" : "Nuevo integrante"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* ── FOTO ── */}
            <div className="space-y-2">
              <Label>Fotografía</Label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted shrink-0 flex items-center justify-center">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Vista previa"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      {photoPreview ? "Cambiar foto" : "Subir foto"}
                    </Button>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive gap-1"
                        onClick={removePhoto}
                      >
                        <X className="w-4 h-4" /> Quitar
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG o WebP. Máximo 5 MB. Se recortará en círculo.
                  </p>
                </div>
              </div>
            </div>

            {/* ── DATOS PERSONALES ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input {...register("first_name")} placeholder="Juan" />
                {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Apellidos</Label>
                <Input {...register("last_name")} placeholder="Pérez" />
                {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input {...register("email")} type="email" placeholder="juan@ejemplo.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Carrera</Label>
                <Input {...register("career")} placeholder="Ing. en Sistemas" />
                {errors.career && <p className="text-xs text-destructive">{errors.career.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Especialidad</Label>
                <Input {...register("specialty")} placeholder="Machine Learning" />
                {errors.specialty && <p className="text-xs text-destructive">{errors.specialty.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Input {...register("role")} placeholder="Investigador, Líder de proyecto..." />
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Biografía</Label>
              <Textarea {...register("biography")} placeholder="Descripción profesional..." rows={3} />
            </div>

            <div className="space-y-1.5">
              <Label>LinkedIn</Label>
              <Input {...register("linkedin")} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1.5">
              <Label>GitHub</Label>
              <Input {...register("github")} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Portafolio</Label>
              <Input {...register("portfolio")} placeholder="https://misitioweb.com" />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving || uploadingPhoto}>
                {saving || uploadingPhoto ? "Guardando..." : editing ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}