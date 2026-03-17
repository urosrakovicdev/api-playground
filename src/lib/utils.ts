import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PipelineStage } from "../lib/types"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const getStageStyles = (
  stageKey: PipelineStage,
  currentStage: PipelineStage,
) => {
  const isActive = stageKey === currentStage

  if (!isActive) {
    return "bg-card border-border text-muted-foreground"
  }

  switch (stageKey) {
    case "idle":
      return "bg-secondary text-secondary-foreground border-border ring-1 ring-ring/30"
    case "sending":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30 ring-1 ring-blue-500/20"
    case "waiting":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30 ring-1 ring-amber-500/20"
    case "success":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 ring-1 ring-emerald-500/20"
    case "error":
      return "bg-red-500/10 text-red-500 border-red-500/30 ring-1 ring-red-500/20"
  }
}
