import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Mensajes de Contacto — Admin" }

export default async function AdminContacto() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  const msgs = messages ?? []

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Mensajes de Contacto</h1>
        <p className="text-sm text-muted-foreground">{msgs.length} mensaje(s) recibido(s).</p>
      </div>

      {msgs.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No hay mensajes" description="Los mensajes del formulario de contacto aparecerán aquí." />
      ) : (
        <div className="space-y-4">
          {msgs.map((msg) => (
            <Card key={msg.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{msg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{formatDate(msg.created_at)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}