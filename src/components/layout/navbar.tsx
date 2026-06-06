"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Equipo", href: "/equipo" },
  { label: "Líneas I+D", href: "/lineas-investigacion" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Contacto", href: "/contacto" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center shadow-lg shadow-primary/20">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              <span className="gradient-text">SKYNET</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
                  isActive(item.href)
                    ? "text-foreground bg-white/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Admin link */}
          <div className="hidden md:flex">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs h-8 border-white/10 hover:bg-white/5 hover:border-white/20"
            >
              <Link href="/auth/login">Admin</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-card/95 backdrop-blur-xl">
          <nav className="px-4 py-3 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.href)
                    ? "text-foreground bg-white/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-white/[0.06]">
              <Button variant="outline" size="sm" className="w-full text-xs border-white/10" asChild>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  Panel Admin
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}