import type { RequestResult, PipelineStage } from "../lib/types"

interface ResponseDisplayProps {
  result: RequestResult | null
  error: string | null
  stage: PipelineStage
  countdown: number | null
}

export const ResponseDisplay = ({
  result,
  error,
  stage,
  countdown,
}: ResponseDisplayProps) => {
  const status = result
    ? `${result.response.status} ${result.response.statusText}`
    : "---"
  const time = result ? `${result.duration}ms` : "---"

  const countdownDisplay =
    countdown !== null && countdown > 0
      ? `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")}`
      : countdown === 0
        ? "0:00"
        : "---"

  const renderBody = () => {
    if (stage === "error" && error)
      return <span className="text-destructive">{error}</span>

    if (stage === "idle" && error)
      return <span className="text-muted-foreground">{error}</span>

    if (result?.response.body !== undefined && result.response.body !== null)
      return (
        <pre className="text-xs  leading-relaxed text-foreground text-left whitespace-pre-wrap">
          {JSON.stringify(result.response.body, null, 2)}
        </pre>
      )

    if (result)
      return (
        <span className="text-muted-foreground italic">No response body</span>
      )

    return <span className="text-muted-foreground">No response yet</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-8">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <p
            className={`text-sm  font-medium ${
              result ? "text-emerald-500" : "text-muted-foreground"
            }`}
          >
            {status}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Time</p>
          <p className="text-sm  font-medium">{time}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Timeout in:
          </p>
          <p className={`text-sm  font-medium `}>{countdownDisplay}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-2 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground">
            RESPONSE BODY
          </p>
        </div>
        <div className="p-4">
          <div className="rounded-lg bg-muted/50 p-4 min-h-25 flex items-start">
            {renderBody()}
          </div>
        </div>
      </div>
    </div>
  )
}
