import { useState, useEffect } from "react"
import { useApiRequest } from "./hooks/useApiRequest"
import { RequestComposer } from "./components/RequestComposer"
import { PipelineVisualization } from "./components/PipelineVisualization"
import { ResponseDisplay } from "./components/ResponseDisplay"
import type { HttpMethod } from "./lib/types"

const App = () => {
  const [url, setUrl] = useState("https://api.example.com/users")
  const [method, setMethod] = useState<HttpMethod>("GET")
  const [body, setBody] = useState("")
  const [timeoutValue, setTimeoutValue] = useState("30")
  const [urlError, setUrlError] = useState("")
  const [timeoutError, setTimeoutError] = useState("")

  const {
    stage,
    result,
    error,
    countdown,
    isActive,
    sendRequest,
    cancelRequest,
    reset,
  } = useApiRequest()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActive) {
        cancelRequest()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isActive, cancelRequest])

  const getUrlError = (value: string): string => {
    if (!value.trim()) return "URL is required"
    return URL.canParse(value) ? "" : "Please enter a valid URL"
  }

  const handleUrlChange = (value: string) => {
    setUrl(value)
    setUrlError(getUrlError(value))
    if (stage !== "idle") reset()
  }

  const getTimeoutError = (value: string): string => {
    if (!value) return ""
    const num = Number(value)
    if (isNaN(num) || num < 1) return "Min timeout is 1s"
    if (num > 120) return "Max timeout is 120s"
    return ""
  }

  const handleTimeoutChange = (value: string) => {
    setTimeoutValue(value)
    setTimeoutError(getTimeoutError(value))
  }

  const isUrlValid = !urlError && url.trim().length > 0
  const isTimeoutValid = !timeoutError && timeoutValue !== ""

  const handleSubmit = () => {
    if (!isUrlValid || !isTimeoutValid) return
    sendRequest(url, method, body, Number(timeoutValue))
  }

  const handleMethodChange = (value: HttpMethod) => {
    setMethod(value)
    if (stage !== "idle") reset()
  }

  return (
    <div className="dark flex justify-center min-h-screen bg-background text-foreground">
      <div className="w-3xl px-4 py-10 flex flex-col gap-6">
        <PipelineVisualization stage={stage} />

        <RequestComposer
          url={url}
          method={method}
          body={body}
          timeout={timeoutValue}
          urlError={urlError}
          timeoutError={timeoutError}
          isActive={isActive}
          isUrlValid={isUrlValid}
          isTimeoutValid={isTimeoutValid}
          onUrlChange={handleUrlChange}
          onMethodChange={handleMethodChange}
          onBodyChange={setBody}
          onTimeoutChange={handleTimeoutChange}
          onSubmit={handleSubmit}
          onCancel={cancelRequest}
        />

        <ResponseDisplay
          result={result}
          error={error}
          stage={stage}
          countdown={countdown}
        />
      </div>
    </div>
  )
}

export default App
