"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  description?: string
  loading?: boolean
  empty?: boolean
  className?: string
  children: React.ReactNode
}

export function ChartCard({
  title,
  description,
  loading,
  empty,
  className,
  children,
}: Props) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : empty ? (
          <EmptyState title="No data" description="Nothing to chart yet." />
        ) : (
          <div className="relative">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
