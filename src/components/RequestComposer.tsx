import { Send, X } from "lucide-react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select"
import type { HttpMethod } from "../lib/types"

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE"]

interface RequestComposerProps {
  url: string
  method: HttpMethod
  body: string
  timeout: string
  urlError: string
  timeoutError: string
  isActive: boolean
  isUrlValid: boolean
  isTimeoutValid: boolean
  onUrlChange: (value: string) => void
  onMethodChange: (value: HttpMethod) => void
  onBodyChange: (value: string) => void
  onTimeoutChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export const RequestComposer = ({
  url,
  method,
  body,
  timeout,
  urlError,
  timeoutError,
  isActive,
  isUrlValid,
  isTimeoutValid,
  onUrlChange,
  onMethodChange,
  onBodyChange,
  onTimeoutChange,
  onSubmit,
  onCancel,
}: RequestComposerProps) => {
  const hasBody = method === "POST" || method === "PUT"

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Method
            </label>
            <Select
              value={method}
              onValueChange={(val) => onMethodChange(val as HttpMethod)}
            >
              <SelectTrigger className="w-25 font-semibold cursor-pointer">
                <SelectValue>{method}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m} className="cursor-pointer">
                    <span className="font-semibold">{m}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              URL
            </label>
            <Input
              type="text"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="h-9 text-sm"
              aria-invalid={!!urlError}
            />
            {urlError && <p className="text-destructive text-xs">{urlError}</p>}
          </div>

          <div className="relative">
            <label className="text-xs font-medium text-muted-foreground">
              Timeout
            </label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={timeout}
                onChange={(e) => onTimeoutChange(e.target.value)}
                onBlur={() => {
                  if (!timeout) onTimeoutChange("30")
                }}
                min={1}
                max={120}
                className="w-17.5 h-9 text-center"
                aria-invalid={!!timeoutError}
              />
              <span className="text-xs text-muted-foreground">s</span>
            </div>
            {timeoutError && (
              <p className="text-destructive text-xs absolute left-0 whitespace-nowrap mt-1">
                {timeoutError}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Request body
          </label>
          <Textarea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder='{"key": "value"}'
            rows={4}
            className="text-sm resize-y"
            disabled={!hasBody}
          />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-4">
            <Button
              onClick={onSubmit}
              disabled={isActive || !isUrlValid || !isTimeoutValid}
              size="lg"
              className="cursor-pointer"
            >
              <Send className="size-4" data-icon="inline-start" />
              Send request
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={!isActive}
            >
              <X className="size-4" data-icon="inline-start" />
              Cancel
            </Button>
          </div>

          {!isActive && (
            <div className="flex items-end gap-1 text-xs text-muted-foreground">
              <div className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
                Esc
              </div>
              <span> to cancel</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
