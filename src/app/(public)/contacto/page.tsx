"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Send, Mail, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { contactSchema, type ContactFormData } from "@/schemas/contact"
import { createClient } from "@/lib/supabase/client"

export default function ContactoPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").insert(data)
      if (error) throw error
      toast.success("Mensaje enviado correctamente.")
      reset()
      setSent(true)
    } catch {
      toast.error("Error al enviar el mensaje. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-4 mb-16">
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contacto</span>
          <div className="h-px w-8 bg-primary" />
        </div>
        <h1 className="text-4xl font-bold">Escríbenos</h1>
        <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
          ¿Tienes una propuesta de colaboración, consulta académica o simplemente quieres conocer más del equipo? Estamos aquí.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Correo Electrónico</h3>
                <p className="text-sm text-muted-foreground">Respondemos en menos de 48 horas hábiles.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Formulario de Contacto</h3>
                <p className="text-sm text-muted-foreground">Llena el formulario y nos pondremos en contacto contigo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Enviar mensaje</CardTitle>
              <CardDescription>Todos los campos son requeridos.</CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                    <Send className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg">¡Mensaje enviado!</h3>
                  <p className="text-sm text-muted-foreground">Gracias por contactarnos. Nos pondremos en comunicación pronto.</p>
                  <Button variant="outline" size="sm" onClick={() => setSent(false)}>Enviar otro mensaje</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Tu nombre" {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@correo.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Escribe tu mensaje aquí..."
                      rows={5}
                      {...register("message")}
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? "Enviando..." : <>Enviar mensaje <Send className="w-4 h-4" /></>}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}