import Link from "next/link"
import { Cpu, Mail } from "lucide-react"
import { getSiteSettings, DEFAULT_SETTINGS } from "@/services/settings"

export async function Footer() {
  const settings = await getSiteSettings().catch(() => null) ?? DEFAULT_SETTINGS
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">{settings.team_name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.slogan ?? "Innovando el futuro con Inteligencia Artificial"}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Navegación</h3>
            <ul className="space-y-2">
              {[
                { label: "Equipo", href: "/equipo" },
                { label: "Líneas de Investigación", href: "/lineas-investigacion" },
                { label: "Proyectos", href: "/proyectos" },
                { label: "Contacto", href: "/contacto" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Institución</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{settings.university}</p>
              <p className="text-sm text-muted-foreground">{settings.master_degree_name}</p>
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {settings.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} {settings.team_name} — {settings.university}
          </p>
          <p className="text-xs text-muted-foreground">
            Curso de Gestion e Ingeniería de Datos
          </p>
        </div>
      </div>
    </footer>
  )
}