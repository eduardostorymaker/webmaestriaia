import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Refresh token inválido o expirado — limpiar cookies y tratar como no autenticado
    if (isAdminRoute) {
      const redirectResponse = NextResponse.redirect(new URL("/auth/login", request.url))
      // Eliminar cookies de sesión de Supabase para evitar bucles
      request.cookies.getAll().forEach(({ name }) => {
        if (name.startsWith("sb-")) {
          redirectResponse.cookies.delete(name)
        }
      })
      return redirectResponse
    }
    return supabaseResponse
  }

  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}