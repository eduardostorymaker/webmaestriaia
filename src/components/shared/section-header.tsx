import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  className?: string
  center?: boolean
}

export function SectionHeader({ label, title, description, className, center = true }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-4", center && "text-center", className)}>
      {label && (
        <div className={cn("flex items-center gap-2", center && "justify-center")}>
          <div className="h-px w-8 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</span>
          <div className="h-px w-8 bg-primary" />
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {description && (
        <p className={cn("text-muted-foreground leading-relaxed", center ? "max-w-2xl mx-auto" : "max-w-2xl")}>
          {description}
        </p>
      )}
    </div>
  )
}