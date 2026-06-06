"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, FolderOpen, ExternalLink } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { projectSchema, type ProjectFormData } from "@/schemas/project"
import { withProtocol } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from "@/types"
import type { Project, ProjectStatus } from "@/types"

export default function AdminProyectos() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<ProjectStatus>("desarrollo")

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })

  async function loadProjects() {
    const supabase = createClient()
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadProjects() }, [])

  function openCreate() {
    setEditing(null)
    setStatus("desarrollo")
    reset({ name: "", description: "", technologies: "", status: "desarrollo", project_url: "" })
    setOpen(true)
  }

  function openEdit(project: Project) {
    setEditing(project)
    setStatus(project.status as ProjectStatus)
    reset({
      name: project.name,
      description: project.description,
      technologies: project.technologies.join(", "),
      status: project.status as ProjectStatus,
      project_url: project.project_url ?? "",
    })
    setOpen(true)
  }

  async function onSubmit(data: ProjectFormData) {
    setSaving(true)
    const supabase = createClient()
    const technologies = data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    try {
      if (editing) {
        const { error } = await supabase.from("projects").update({ ...data, technologies, status }).eq("id", editing.id)
        if (error) throw error
        toast.success("Proyecto actualizado.")
      } else {
        const { error } = await supabase.from("projects").insert({ ...data, technologies, status })
        if (error) throw error
        toast.success("Proyecto creado.")
      }
      setOpen(false)
      loadProjects()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) { toast.error("Error al eliminar."); return }
    toast.success("Proyecto eliminado.")
    loadProjects()
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <p className="text-sm text-muted-foreground">{projects.length} proyecto(s) registrado(s).</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo proyecto
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : projects.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No hay proyectos" description="Registra el primer proyecto del equipo." action={<Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Agregar</Button>} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">Tecnologías</TableHead>
                  <TableHead className="hidden sm:table-cell">URL</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium text-sm">{project.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={`text-xs border ${PROJECT_STATUS_COLORS[project.status as ProjectStatus]}`}>
                        {PROJECT_STATUS_LABELS[project.status as ProjectStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                        {project.technologies.length > 2 && <span className="text-xs text-muted-foreground">+{project.technologies.length - 2}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {project.project_url && (
                        <a href={withProtocol(project.project_url)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs">
                          <ExternalLink className="w-3 h-3" /> Ver
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(project)}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                              <AlertDialogDescription>Se eliminará "{project.name}" permanentemente.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProject(project.id)}>Eliminar</AlertDialogAction>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input {...register("name")} placeholder="Nombre del proyecto" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea {...register("description")} placeholder="Descripción del proyecto..." rows={3} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Tecnologías <span className="text-muted-foreground text-xs">(separadas por coma)</span></Label>
              <Input {...register("technologies")} placeholder="React, Python, PostgreSQL" />
              {errors.technologies && <p className="text-xs text-destructive">{errors.technologies.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={status} onValueChange={(v) => { setStatus(v as ProjectStatus); setValue("status", v as ProjectStatus) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(PROJECT_STATUS_LABELS) as [ProjectStatus, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>URL del proyecto</Label>
              <Input {...register("project_url")} placeholder="https://miproyecto.com" />
              {errors.project_url && <p className="text-xs text-destructive">{errors.project_url.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}