import { Minus, ArrowUp, Loader2, MoreHorizontal, Check, X } from "lucide-react"
import { cn, getStageStyles } from "../lib/utils"
import type { PipelineStage } from "../lib/types"

interface StageConfig {
  key: PipelineStage
  label: string
  icon: (isActive: boolean) => React.ReactNode
}

const STAGES: StageConfig[] = [
  { key: "idle", label: "Idle", icon: () => <Minus className="size-5" /> },
  {
    key: "sending",
    label: "Sending",
    icon: (isActive) =>
      isActive ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <ArrowUp className="size-5" />
      ),
  },
  {
    key: "waiting",
    label: "Waiting",
    icon: () => <MoreHorizontal className="size-5" />,
  },
  {
    key: "success",
    label: "Success",
    icon: () => <Check className="size-5" />,
  },
  { key: "error", label: "Error", icon: () => <X className="size-5" /> },
]

interface PipelineVisualizationProps {
  stage: PipelineStage
}

export const PipelineVisualization = ({
  stage,
}: PipelineVisualizationProps) => {
  return (
    <div className="flex items-center gap-2">
      {STAGES.map((s) => (
        <div
          key={s.key}
          className={cn(
            "flex flex-col flex-1 items-center justify-center gap-1.5 rounded-xl border py-3 transition-all duration-300",
            getStageStyles(s.key, stage),
            s.key === stage &&
              (s.key === "sending" || s.key === "waiting") &&
              "animate-pulse",
          )}
        >
          {s.icon(s.key === stage)}
          <span className="text-xs font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
