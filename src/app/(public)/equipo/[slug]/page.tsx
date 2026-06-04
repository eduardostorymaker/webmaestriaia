import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft, Mail, GraduationCap, Briefcase, Globe,
  Code2, Link2, ArrowUpRight, MapPin, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProfileBySlug } from "@/services/profiles"
import { getInitials } from "@/lib/utils"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug).catch(() => null)
  if (!profile) return { title: "Perfil no encontrado" }
  return {
    title: `${profile.first_name} ${profile.last_name} — ${profile.specialty}`,
    description: profile.biography ?? `${profile.first_name} ${profile.last_name} — ${profile.specialty} en el equipo SKYNET.`,
    openGraph: {
      title: `${profile.first_name} ${profile.last_name}`,
      description: profile.biography ?? profile.specialty,
      images: profile.photo_url ? [{ url: profile.photo_url }] : [],
    },
  }
}

/* Paleta de colores por índice de letra inicial */
const AVATAR_GRADIENTS = [
  "from-blue-600 to-cyan-500",
  "from-violet-600 to-purple-500",
  "from-emerald-600 to-teal-500",
  "from-rose-600 to-pink-500",
  "from-amber-600 to-orange-500",
  "from-indigo-600 to-blue-500",
]

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[idx]
}

/* Pill de habilidad con color semántico */
const SKILL_COLORS: Record<string, string> = {
  python:        "bg-blue-500/10 border-blue-500/25 text-blue-300",
  javascript:    "bg-yellow-500/10 border-yellow-500/25 text-yellow-300",
  typescript:    "bg-blue-400/10 border-blue-400/25 text-blue-200",
  react:         "bg-cyan-500/10 border-cyan-500/25 text-cyan-300",
  "next.js":     "bg-white/8 border-white/15 text-white/80",
  "node.js":     "bg-green-500/10 border-green-500/25 text-green-300",
  docker:        "bg-sky-500/10 border-sky-500/25 text-sky-300",
  postgresql:    "bg-indigo-500/10 border-indigo-500/25 text-indigo-300",
  mongodb:       "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
  "machine learning": "bg-violet-500/10 border-violet-500/25 text-violet-300",
  tensorflow:    "bg-orange-500/10 border-orange-500/25 text-orange-300",
  pytorch:       "bg-red-500/10 border-red-500/25 text-red-300",
  aws:           "bg-amber-500/10 border-amber-500/25 text-amber-300",
  kubernetes:    "bg-blue-600/10 border-blue-600/25 text-blue-200",
  linux:         "bg-yellow-600/10 border-yellow-600/25 text-yellow-200",
}

function SkillPill({ name }: { name: string }) {
  const key = name.toLowerCase()
  const color = SKILL_COLORS[key] ?? "bg-white/5 border-white/10 text-muted-foreground"
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${color} transition-all hover:scale-105`}>
      {name}
    </span>
  )
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug).catch(() => null)
  if (!profile) notFound()

  const fullName = `${profile.first_name} ${profile.last_name}`
  const gradient = getGradient(profile.first_name)
  const hasLinks = profile.linkedin || profile.github || profile.portfolio
  const hasSkills = profile.skills && profile.skills.length > 0

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════
          HERO — foto + nombre + rol
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Fondo con gradiente sutil */}
        <div className="absolute inset-0 neural-bg" />
        <div className={`absolute top-0 left-0 right-0 h-[320px] bg-gradient-to-br ${gradient} opacity-[0.07] pointer-events-none`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 pt-10 pb-0">
          {/* Back */}
          <Link
            href="/equipo"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al equipo
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8 pb-10">
            {/* Foto */}
            <div className="shrink-0">
              <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br ${gradient}`}>
                {profile.photo_url ? (
                  <Image
                    src={profile.photo_url}
                    alt={fullName}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/80">
                    {getInitials(profile.first_name, profile.last_name)}
                  </div>
                )}
              </div>
            </div>

            {/* Info principal */}
            <div className="flex-1 space-y-4 pb-1">
              {/* Rol badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 text-primary" />
                {profile.role}
              </div>

              {/* Nombre */}
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                  {profile.first_name}
                  <br />
                  <span className="gradient-text">{profile.last_name}</span>
                </h1>
              </div>

              {/* Especialidad + carrera */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {profile.specialty && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {profile.specialty}
                  </span>
                )}
                {profile.career && (
                  <>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {profile.career}
                    </span>
                  </>
                )}
              </div>

              {/* Links rápidos */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/8 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </a>

                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs text-blue-300 hover:bg-blue-500/15 transition-all"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    LinkedIn
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/12 text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    GitHub
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan/10 border border-cyan/25 text-xs text-cyan hover:bg-cyan/15 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Portafolio
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria shimmer */}
        <div className="shimmer-line" />
      </section>


      {/* ══════════════════════════════════════════
          CUERPO — bio + skills + contacto
      ══════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── COLUMNA PRINCIPAL ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Sobre mí / Bio */}
            {profile.biography && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-px w-5 bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">Sobre mí</span>
                </div>
                <p className="text-foreground/80 leading-[1.8] text-base whitespace-pre-line">
                  {profile.biography}
                </p>
              </div>
            )}

            {/* Habilidades */}
            {hasSkills && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-px w-5 bg-cyan" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-cyan">Stack & Habilidades</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills!.map((skill) => (
                    <SkillPill key={skill.id} name={skill.name} />
                  ))}
                </div>
              </div>
            )}

            {/* Si no hay bio ni skills */}
            {!profile.biography && !hasSkills && (
              <div className="py-10 text-center border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground text-sm">
                  El perfil de {profile.first_name} está en construcción.
                </p>
              </div>
            )}
          </div>


          {/* ── SIDEBAR DERECHA ── */}
          <div className="space-y-6">

            {/* Tarjeta de información */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Información</p>

              <div className="space-y-4">
                <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Correo" value={profile.email} href={`mailto:${profile.email}`} />
                {profile.career && (
                  <InfoRow icon={<GraduationCap className="w-3.5 h-3.5" />} label="Carrera" value={profile.career} />
                )}
                {profile.specialty && (
                  <InfoRow icon={<Briefcase className="w-3.5 h-3.5" />} label="Especialidad" value={profile.specialty} />
                )}
                <InfoRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Equipo"
                  value="SKYNET"
                />
              </div>
            </div>

            {/* Tarjeta de redes */}
            {hasLinks && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Perfiles</p>

                <div className="space-y-2">
                  {profile.linkedin && (
                    <SocialLink
                      href={profile.linkedin}
                      icon={<Link2 className="w-4 h-4" />}
                      label="LinkedIn"
                      sublabel="Perfil profesional"
                      color="text-blue-400 bg-blue-500/10 border-blue-500/20"
                    />
                  )}
                  {profile.github && (
                    <SocialLink
                      href={profile.github}
                      icon={<Code2 className="w-4 h-4" />}
                      label="GitHub"
                      sublabel="Repositorios públicos"
                      color="text-foreground bg-white/5 border-white/10"
                    />
                  )}
                  {profile.portfolio && (
                    <SocialLink
                      href={profile.portfolio}
                      icon={<Globe className="w-4 h-4" />}
                      label="Portafolio"
                      sublabel="Sitio web personal"
                      color="text-cyan bg-cyan/10 border-cyan/20"
                    />
                  )}
                </div>
              </div>
            )}

            {/* CTA contacto */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-transparent p-6 space-y-3">
              <p className="text-sm font-semibold">¿Quieres colaborar?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Envía un mensaje al equipo SKYNET para propuestas de colaboración o consultas académicas.
              </p>
              <Button size="sm" className="w-full gap-2 mt-1" asChild>
                <Link href="/contacto">
                  Enviar mensaje <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════
          FOOTER MINI — volver al equipo
      ══════════════════════════════════════════ */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/equipo">
              <ArrowLeft className="w-4 h-4" /> Ver todo el equipo
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {profile.first_name} {profile.last_name} · Equipo SKYNET
          </p>
        </div>
      </section>

    </div>
  )
}

/* ── Componentes auxiliares ── */

function InfoRow({
  icon, label, value, href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0 text-muted-foreground mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{label}</p>
        {href ? (
          <a href={href} className="text-xs text-foreground/80 hover:text-foreground transition-colors truncate block">
            {value}
          </a>
        ) : (
          <p className="text-xs text-foreground/80 truncate">{value}</p>
        )}
      </div>
    </div>
  )
}

function SocialLink({
  href, icon, label, sublabel, color,
}: {
  href: string
  icon: React.ReactNode
  label: string
  sublabel: string
  color: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 rounded-xl border ${color} hover:opacity-80 transition-all group`}
    >
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-tight">{label}</p>
        <p className="text-[10px] opacity-60 leading-tight">{sublabel}</p>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-70 shrink-0" />
    </a>
  )
}