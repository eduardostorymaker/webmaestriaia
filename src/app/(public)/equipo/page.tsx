import Image from "next/image"
import Link from "next/link"
import { Users, ArrowRight, Globe, ExternalLink, Code2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/empty-state"
import { getProfiles } from "@/services/profiles"
import { getInitials } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Equipo",
  description: "Conoce a los integrantes del equipo SKYNET.",
}

export default async function EquipoPage() {
  const profiles = await getProfiles().catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        label="Nuestro equipo"
        title="Integrantes"
        description="Investigadores y desarrolladores apasionados por la tecnología y la inteligencia artificial."
        className="mb-16"
      />

      {profiles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay integrantes registrados"
          description="Los integrantes del equipo aparecerán aquí una vez que sean registrados en el sistema."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id} className="card-hover group flex flex-col overflow-hidden">
              {/* Photo */}
              <div className="h-48 bg-gradient-to-br from-primary/10 to-cyan/10 relative overflow-hidden">
                {profile.photo_url ? (
                  <Image
                    src={profile.photo_url}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary/40">
                      {getInitials(profile.first_name, profile.last_name)}
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="flex-1 pt-4 space-y-3 flex flex-col">
                <div>
                  <h3 className="font-semibold text-sm leading-tight">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{profile.specialty}</p>
                </div>

                <Badge variant="outline" className="self-start text-xs">{profile.role}</Badge>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-xs">{skill.name}</Badge>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="text-xs text-muted-foreground self-center">+{profile.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Social links */}
                <div className="flex gap-2 pt-1">
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                      <Code2 className="w-4 h-4" />
                    </a>
                  )}
                  {profile.portfolio && (
                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Portafolio">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex-1" />
                <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                  <Link href={`/equipo/${profile.slug}`}>
                    Ver perfil <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}