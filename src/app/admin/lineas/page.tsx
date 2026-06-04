"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, FlaskConical } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { researchLineSchema, type ResearchLineFormData } from "@/schemas/research-line"
import { createClient } from "@/lib/supabase/client"
import type { ResearchLine } from "@/types"

export default function AdminLineas() {
  const [lines, setLines] = useState<ResearchLine[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ResearchLine | null>(null)
  const [saving, setSaving] = useState(false)
  const [active, setActive] = useState(true)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResearchLineFormData>({
    resolver: zodResolver(researchLineSchema),
  })

  async function loadLines() {
    const supabase = createClient()
    const { data } = await supabase.from("research_lines").select("*").order("created_at")
    setLines(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadLines() }, [])

  function openCreate() {
    setEditing(null)
    setActive(true)
    reset({ name: "", description: "", objectives: "", technologies: "", icon: "" })
    setOpen(true)
  }

  function openEdit(line: ResearchLine) {
    setEditing(line)
    setActive(line.active)
    reset({
      name: line.name,
      description: line.description,
      objectives: line.objectives ?? "",
      technologies: line.technologies.join(", "),
      icon: line.icon ?? "",
    })
    setOpen(true)
  }

  async function onSubmit(data: ResearchLineFormData) {
    setSaving(true)
    const supabase = createClient()
    const technologies = data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    try {
      if (editing) {
        const { error } = await supabase.from("research_lines").update({ ...data, technologies, active }).eq("id", editing.id)
        if (error) throw error
        toast.success("Línea actualizada.")
      } else {
        const { error } = await supabase.from("research_lines").insert({ ...data, technologies, active })
        if (error) throw error
        toast.success("Línea creada.")
      }
      setOpen(false)
      loadLines()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(line: ResearchLine) {
    const supabase = createClient()
    await supabase.from("research_lines").update({ active: !line.active }).eq("id", line.id)
    loadLines()
  }

  async function deleteLine(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("research_lines").delete().eq("id", id)
    if (error) { toast.error("Error al eliminar."); return }
    toast.success("Línea eliminada.")
    loadLines()
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Líneas de Investigación</h1>
          <p className="text-sm text-muted-foreground">{lines.length} línea(s) registrada(s).</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Nueva línea
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : lines.length === 0 ? (
        <EmptyState icon={FlaskConical} title="No hay líneas" description="Registra la primera línea de investigación." action={<Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Agregar</Button>} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Tecnologías</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{line.name}</p>
                      <p className="text-xs text-muted-foreground hidden sm:block truncate max-w-[200px]">{line.description}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {line.technologies.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                        {line.technologies.length > 2 && <span className="text-xs text-muted-foreground">+{line.technologies.length - 2}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={line.active} onCheckedChange={() => toggleActive(line)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(line)}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar línea?</AlertDialogTitle>
                              <AlertDialogDescription>Se eliminará "{line.name}" permanentemente.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteLine(line.id)}>Eliminar</AlertDialogAction>
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
            <DialogTitle>{editing ? "Editar línea" : "Nueva línea de investigación"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input {...register("name")} placeholder="Inteligencia Artificial" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea {...register("description")} placeholder="Descripción de la línea..." rows={2} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Objetivos</Label>
              <Textarea {...register("objectives")} placeholder="Objetivos de investigación..." rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Tecnologías <span className="text-muted-foreground text-xs">(separadas por coma)</span></Label>
              <Input {...register("technologies")} placeholder="Python, TensorFlow, PyTorch" />
              {errors.technologies && <p className="text-xs text-destructive">{errors.technologies.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Icono <span className="text-muted-foreground text-xs">(nombre Lucide: Brain, Cloud, Shield...)</span></Label>
              <Input {...register("icon")} placeholder="Brain" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={active} onCheckedChange={setActive} id="active" />
              <Label htmlFor="active">Visible en el sitio</Label>
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