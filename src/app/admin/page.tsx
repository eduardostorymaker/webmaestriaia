import Link from "next/link"
import { Users, FolderOpen, FlaskConical, MessageSquare, ArrowRight, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard — Admin" }

async function getStats() {
  const supabase = await createClient()
  const [profiles, projects, lines, messages] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("research_lines").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ])
  return {
    profiles: profiles.count ?? 0,
    projects: projects.count ?? 0,
    lines: lines.count ?? 0,
    messages: messages.count ?? 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats().catch(() => ({ profiles: 0, projects: 0, lines: 0, messages: 0 }))

  const statCards = [
    { label: "Integrantes", value: stats.profiles, icon: Users, href: "/admin/integrantes", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Proyectos", value: stats.projects, icon: FolderOpen, href: "/admin/proyectos", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "Líneas I+D", value: stats.lines, icon: FlaskConical, href: "/admin/lineas", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Mensajes", value: stats.messages, icon: MessageSquare, href: "/admin/contacto", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen del portal SKYNET.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={href} href={href}>
            <Card className="card-hover cursor-pointer">
              <CardHeader className="pb-2">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${bg}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold mb-4">Acciones rápidas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Añadir integrante", href: "/admin/integrantes", icon: Users },
            { label: "Añadir proyecto", href: "/admin/proyectos", icon: FolderOpen },
            { label: "Añadir línea I+D", href: "/admin/lineas", icon: FlaskConical },
            { label: "Ver mensajes", href: "/admin/contacto", icon: MessageSquare },
            { label: "Configuración del sitio", href: "/admin/configuracion", icon: ArrowRight },
          ].map(({ label, href, icon: Icon }) => (
            <Button key={href} variant="outline" className="justify-start gap-2 h-auto py-3" asChild>
              <Link href={href}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}