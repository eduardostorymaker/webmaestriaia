import Image from "next/image"
import { FolderOpen, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/empty-state"
import { getProjects } from "@/services/projects"
import { truncate, cn, withProtocol } from "@/lib/utils"
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from "@/types"
import type { ProjectStatus } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Catálogo de proyectos desarrollados por el equipo SKYNET.",
}

export default async function ProyectosPage() {
  const projects = await getProjects().catch(() => [])

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        label="Portafolio"
        title="Proyectos"
        description="Soluciones tecnológicas innovadoras desarrolladas por el equipo SKYNET."
        className="mb-16"
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No hay proyectos registrados"
          description="Los proyectos del equipo aparecerán aquí una vez que sean registrados en el sistema."
        />
      ) : (
        <>
          {/* Status filter summary */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {(["planificacion", "desarrollo", "produccion", "finalizado"] as ProjectStatus[]).map((status) => {
              const count = projects.filter((p) => p.status === status).length
              if (count === 0) return null
              return (
                <div key={status} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${PROJECT_STATUS_COLORS[status]}`}>
                  <span>{PROJECT_STATUS_LABELS[status]}</span>
                  <span className="opacity-70">({count})</span>
                </div>
              )
            })}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="card-hover overflow-hidden flex flex-col">
                {project.image_url ? (
                  <div className="h-44 overflow-hidden bg-muted relative">
                    <Image
                      src={project.image_url}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-primary/10 to-cyan/10 flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-primary/30" />
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <Badge className={`text-xs shrink-0 border ${PROJECT_STATUS_COLORS[project.status as ProjectStatus]}`}>
                      {PROJECT_STATUS_LABELS[project.status as ProjectStatus]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <CardDescription className="text-xs leading-relaxed">
                    {truncate(project.description, 130)}
                  </CardDescription>

                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs text-muted-foreground self-center">+{project.technologies.length - 4}</span>
                      )}
                    </div>
                  )}

                  {project.project_url && (
                    <a
                      href={withProtocol(project.project_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full gap-2")}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visitar Proyecto
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}