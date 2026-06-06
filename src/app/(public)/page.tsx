import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight, ArrowUpRight, Users, FolderOpen, FlaskConical,
  Brain, TrendingUp, BarChart3, Layers, Cloud, Shield, Zap, ExternalLink,
  Cpu, Network, Activity, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSiteSettings, DEFAULT_SETTINGS } from "@/services/settings"
import { getResearchLines } from "@/services/research-lines"
import { getFeaturedProfiles } from "@/services/profiles"
import { getFeaturedProjects } from "@/services/projects"
import { getInitials, truncate } from "@/lib/utils"
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from "@/types"
import type { ProjectStatus } from "@/types"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, TrendingUp, BarChart3, Layers, Cloud, Shield, Zap, FlaskConical, Network,
}

/* ── SVG Neural Network decorativo ── */
function NeuralSVG() {
  return (
    <svg
      viewBox="0 0 600 400"
      className="w-full h-full opacity-20"
      aria-hidden="true"
    >
      {/* Nodos */}
      {[
        [80, 80], [80, 200], [80, 320],
        [240, 40], [240, 140], [240, 240], [240, 340],
        [400, 80], [400, 200], [400, 320],
        [540, 120], [540, 200], [540, 280],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={6} fill="none" stroke="#3b82f6" strokeWidth={1} opacity={0.8} />
          <circle cx={cx} cy={cy} r={2} fill="#3b82f6" opacity={0.9} />
        </g>
      ))}
      {/* Conexiones */}
      {[
        [80,80,240,40],[80,80,240,140],[80,200,240,140],[80,200,240,240],[80,320,240,240],[80,320,240,340],
        [240,40,400,80],[240,140,400,80],[240,140,400,200],[240,240,400,200],[240,240,400,320],[240,340,400,320],
        [400,80,540,120],[400,80,540,200],[400,200,540,200],[400,200,540,280],[400,320,540,280],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth={0.6} opacity={0.35} />
      ))}
      {/* Pulsos animados */}
      {[[80,80,240,140],[240,240,400,200],[400,80,540,200]].map((_, i) => (
        <circle key={`p${i}`} r={3} fill="#22d3ee" opacity={0.8}>
          <animateMotion dur={`${2 + i * 0.7}s`} repeatCount="indefinite">
            <mpath href={`#path${i}`} />
          </animateMotion>
        </circle>
      ))}
      <path id="path0" d={`M80,80 L240,140`} fill="none" />
      <path id="path1" d={`M240,240 L400,200`} fill="none" />
      <path id="path2" d={`M400,80 L540,200`} fill="none" />
    </svg>
  )
}

/* ── Terminal Badge ── */
function TerminalBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs mono text-cyan">
      <span className="text-primary opacity-70">$</span>
      <span className="text-foreground/80">{text}</span>
      <span className="inline-block w-1.5 h-3 bg-cyan/70 animate-pulse rounded-sm" />
    </div>
  )
}

export default async function HomePage() {
  const [settings, researchLines, profiles, projects] = await Promise.all([
    getSiteSettings().catch(() => null),
    getResearchLines().catch(() => []),
    getFeaturedProfiles(6).catch(() => []),
    getFeaturedProjects(3).catch(() => []),
  ])

  const s = settings ?? DEFAULT_SETTINGS
  const profileCount = profiles.length
  const projectCount = projects.length
  const lineCount = researchLines.length

  return (
    <div className="flex flex-col overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center neural-bg overflow-hidden">
        {/* Orbs de fondo */}
        <div className="orb w-[600px] h-[600px] bg-blue-600/10 -top-40 -left-40" style={{ animationDelay: "0s" }} />
        <div className="orb w-[500px] h-[500px] bg-violet/8 top-1/2 -right-20" style={{ animationDelay: "3s" }} />
        <div className="orb w-[300px] h-[300px] bg-cyan/4 bottom-10 left-1/3" style={{ animationDelay: "5s" }} />

        {/* Red neuronal derecha */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-100 pointer-events-none hidden lg:block">
          <NeuralSVG />
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-32">
          <div className="max-w-3xl space-y-8">
            {/* Terminal badge */}
            <div className="animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
              <TerminalBadge text={`${s.team_name} — ${s.master_degree_name}`} />
            </div>

            {/* Heading principal */}
            <div className="animate-fade-up opacity-0 delay-100" style={{ animationFillMode: "forwards" }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                <span className="text-foreground">Investigación en</span>
                <br />
                <span className="gradient-text">Inteligencia</span>
                <br />
                <span className="gradient-text">Artificial</span>
              </h1>
            </div>

            {/* Subtítulo */}
            <div className="animate-fade-up opacity-0 delay-200" style={{ animationFillMode: "forwards" }}>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {s.slogan ?? "Innovando el futuro con Inteligencia Artificial"}
              </p>
              {s.about && (
                <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed max-w-lg">
                  {truncate(s.about, 180)}
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-fade-up opacity-0 delay-300" style={{ animationFillMode: "forwards" }}>
              <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Link href="/equipo">
                  Conocer el Equipo <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 border-white/10 hover:bg-white/5">
                <Link href="/proyectos">Ver Proyectos <ArrowUpRight className="w-4 h-4" /></Link>
              </Button>
            </div>

            {/* Meta-info */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 animate-fade-up opacity-0 delay-400" style={{ animationFillMode: "forwards" }}>
              {[
                { label: "Universidad", value: s.university },
                { label: "Programa", value: s.master_degree_name },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">
                    <span className="text-muted-foreground/50">{label}: </span>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Línea shimmer inferior */}
        <div className="absolute bottom-0 left-0 right-0 shimmer-line" />
      </section>


      {/* ══════════════════════════════════════════
          BENTO STATS + NAV
      ══════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Stat: Integrantes */}
          <Link href="/equipo" className="bento-card rounded-2xl border border-border bg-card p-6 flex flex-col justify-between min-h-[140px] group">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <p className="text-3xl font-bold stat-number gradient-text">{profileCount || "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Integrantes</p>
            </div>
          </Link>

          {/* Stat: Proyectos */}
          <Link href="/proyectos" className="bento-card rounded-2xl border border-border bg-card p-6 flex flex-col justify-between min-h-[140px] group">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-cyan" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div>
              <p className="text-3xl font-bold stat-number gradient-text">{projectCount || "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Proyectos</p>
            </div>
          </Link>

          {/* Stat: Líneas I+D */}
          <Link href="/lineas-investigacion" className="bento-card rounded-2xl border border-border bg-card p-6 flex flex-col justify-between min-h-[140px] group">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-violet" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div>
              <p className="text-3xl font-bold stat-number gradient-text">{lineCount || "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Líneas I+D</p>
            </div>
          </Link>

          {/* CTA Contacto */}
          <Link href="/contacto" className="bento-card rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 flex flex-col justify-between min-h-[140px] group">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Colabora con nosotros</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 group-hover:gap-2 transition-all">
                Contáctanos <ArrowRight className="w-3 h-3" />
              </p>
            </div>
          </Link>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          LÍNEAS DE INVESTIGACIÓN
      ══════════════════════════════════════════ */}
      {researchLines.length > 0 && (
        <section className="py-20 relative">
          <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">I + D</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Líneas de<br />
                  <span className="gradient-text">Investigación</span>
                </h2>
              </div>
              <Button variant="outline" size="sm" asChild className="border-white/10 hover:bg-white/5 gap-1 shrink-0">
                <Link href="/lineas-investigacion">Ver todas <ArrowUpRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchLines.slice(0, 6).map((line, idx) => {
                const IconComp = ICON_MAP[line.icon ?? ""] ?? Brain
                const colors = [
                  "from-blue-500/8 border-blue-500/15",
                  "from-cyan/8 border-cyan/15",
                  "from-violet/8 border-violet/15",
                  "from-emerald-500/8 border-emerald-500/15",
                  "from-amber-500/8 border-amber-500/15",
                  "from-rose-500/8 border-rose-500/15",
                ]
                const iconColors = [
                  "text-blue-400 bg-blue-500/10 border-blue-500/20",
                  "text-cyan bg-cyan/10 border-cyan/20",
                  "text-violet bg-violet/10 border-violet/20",
                  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  "text-amber-400 bg-amber-500/10 border-amber-500/20",
                  "text-rose-400 bg-rose-500/10 border-rose-500/20",
                ]
                const c = colors[idx % colors.length]
                const ic = iconColors[idx % iconColors.length]
                return (
                  <div
                    key={line.id}
                    className={`bento-card rounded-2xl border bg-gradient-to-br ${c} to-transparent bg-card p-6 space-y-4`}
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${ic}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-1.5">{line.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {truncate(line.description, 110)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {line.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                      {line.technologies.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-muted-foreground">
                          +{line.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════
          MISIÓN Y VISIÓN
      ══════════════════════════════════════════ */}
      {(s.mission || s.vision || s.about) && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid lg:grid-cols-5 gap-6">

              {/* About — ancho */}
              {s.about && (
                <div className="lg:col-span-3 bento-card rounded-2xl border border-border bg-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <Cpu className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary">Sobre nosotros</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">
                      Equipo <span className="gradient-text">{s.team_name}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.about}</p>
                    {s.history && (
                      <p className="text-xs text-muted-foreground/70 leading-relaxed border-l-2 border-primary/30 pl-4">{s.history}</p>
                    )}
                    <Button variant="outline" size="sm" asChild className="mt-6 border-white/10 hover:bg-white/5 gap-1">
                      <Link href="/equipo">Conocer al equipo <ArrowRight className="w-3 h-3" /></Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Misión + Visión — columna */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {s.mission && (
                  <div className="bento-card rounded-2xl border border-border bg-gradient-to-br from-primary/8 to-transparent p-6 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center mb-4">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Misión</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.mission}</p>
                  </div>
                )}
                {s.vision && (
                  <div className="bento-card rounded-2xl border border-border bg-gradient-to-br from-cyan/8 to-transparent p-6 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-cyan/15 border border-cyan/25 flex items-center justify-center mb-4">
                      <Brain className="w-4 h-4 text-cyan" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-2">Visión</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.vision}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════
          INTEGRANTES
      ══════════════════════════════════════════ */}
      {profiles.length > 0 && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-cyan" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-cyan">Equipo</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Los que hacen<br />
                  <span className="gradient-text">posible SKYNET</span>
                </h2>
              </div>
              <Button variant="outline" size="sm" asChild className="border-white/10 hover:bg-white/5 gap-1 shrink-0">
                <Link href="/equipo">Ver todos <ArrowUpRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {profiles.slice(0, 6).map((profile) => (
                <Link
                  key={profile.id}
                  href={`/equipo/${profile.slug}`}
                  className="bento-card group rounded-2xl border border-border bg-card p-4 text-center flex flex-col items-center gap-3"
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/8 group-hover:border-primary/40 transition-colors bg-muted shrink-0">
                    {profile.photo_url ? (
                      <Image
                        src={profile.photo_url}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-primary/20 to-cyan/20 text-muted-foreground">
                        {getInitials(profile.first_name ?? "", profile.last_name ?? "")}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0 w-full">
                    <p className="text-xs font-semibold text-foreground truncate">{profile.first_name} {profile.last_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{profile.specialty}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════
          PROYECTOS
      ══════════════════════════════════════════ */}
      {projects.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-violet" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-violet">Portafolio</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Proyectos<br />
                  <span className="gradient-text">en desarrollo</span>
                </h2>
              </div>
              <Button variant="outline" size="sm" asChild className="border-white/10 hover:bg-white/5 gap-1 shrink-0">
                <Link href="/proyectos">Ver todos <ArrowUpRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bento-card rounded-2xl border border-border bg-card overflow-hidden flex flex-col"
                >
                  {/* Imagen o placeholder */}
                  <div className="h-36 bg-gradient-to-br from-primary/10 via-card to-cyan/5 relative overflow-hidden">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FolderOpen className="w-10 h-10 text-muted-foreground/20" />
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PROJECT_STATUS_COLORS[project.status as ProjectStatus]}`}>
                        {PROJECT_STATUS_LABELS[project.status as ProjectStatus]}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <h3 className="font-semibold text-sm">{project.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                      {truncate(project.description, 100)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visitar proyecto
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/4 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Disponibles para colaboraciones
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            ¿Listo para colaborar<br />
            <span className="gradient-text">con SKYNET?</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Estamos abiertos a proyectos de investigación, asesorías académicas y colaboraciones tecnológicas.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link href="/contacto">Enviar mensaje <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 border-white/10 hover:bg-white/5">
              <Link href="/equipo">Ver el equipo</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}