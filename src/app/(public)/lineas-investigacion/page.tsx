import { Brain, TrendingUp, BarChart3, Layers, Cloud, Shield, Zap, FlaskConical, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/empty-state"
import { getResearchLines } from "@/services/research-lines"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Líneas de Investigación",
  description: "Áreas de investigación y especialización del equipo SKYNET.",
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, TrendingUp, BarChart3, Layers, Cloud, Shield, Zap, FlaskConical, BookOpen,
}

export default async function LineasPage() {
  const lines = await getResearchLines().catch(() => [])

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        label="Investigación"
        title="Líneas de Investigación"
        description="Áreas de especialización donde el equipo SKYNET desarrolla conocimiento, innovación y soluciones tecnológicas de vanguardia."
        className="mb-16"
      />

      {lines.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No hay líneas de investigación registradas"
          description="Las líneas de investigación del equipo aparecerán aquí una vez que sean configuradas."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {lines.map((line) => {
            const IconComp = ICON_MAP[line.icon ?? ""] ?? Brain
            return (
              <Card key={line.id} className="card-hover group flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <IconComp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{line.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{line.description}</p>

                  {line.objectives && (
                    <div>
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Objetivos</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{line.objectives}</p>
                    </div>
                  )}

                  {line.technologies.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Tecnologías</h4>
                      <div className="flex flex-wrap gap-2">
                        {line.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}