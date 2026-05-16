import * as React from "react"
import { cn } from "@/lib/utils"

type EmptyStateProps = React.ComponentProps<"div"> & {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center",
        className,
      )}
      {...props}
    >
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      <h3 className="text-sm font-medium">{title}</h3>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
