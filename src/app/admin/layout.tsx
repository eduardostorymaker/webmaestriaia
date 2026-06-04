import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Users, FolderOpen, FlaskConical, Settings, MessageSquare, Cpu, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Integrantes", href: "/admin/integrantes", icon: Users },
  { label: "Proyectos", href: "/admin/proyectos", icon: FolderOpen },
  { label: "Líneas I+D", href: "/admin/lineas", icon: FlaskConical },
  { label: "Mensajes", href: "/admin/contacto", icon: MessageSquare },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    redirect("/auth/login")
  }
  if (!user) redirect("/auth/login")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/50 fixed top-0 left-0 h-full z-30">
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm gradient-text">SKYNET Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors group"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
          <Separator />
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground" asChild>
            <Link href="/" target="_blank">Ver sitio</Link>
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-card/50 sticky top-0 z-20">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
              <Cpu className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm gradient-text">Admin</span>
          </Link>
          <div className="flex gap-1">
            {navItems.slice(0, 4).map(({ href, icon: Icon }) => (
              <Link key={href} href={href} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}