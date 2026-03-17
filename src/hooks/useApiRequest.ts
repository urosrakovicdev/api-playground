import { useReducer, useRef, useCallback } from "react"
import { mockFetch } from "../lib/mockApi"
import type {
  HttpMethod,
  RequestState,
  RequestAction,
  PipelineStage,
} from "../lib/types"

const initialState: RequestState = {
  stage: "idle",
  result: null,
  error: null,
  countdown: null,
}

const requestReducer = (
  state: RequestState,
  action: RequestAction,
): RequestState => {
  switch (action.type) {
    case "SEND":
      return {
        stage: "sending",
        result: null,
        error: null,
        countdown: action.timeout,
      }

    case "WAITING":
      return { ...state, stage: "waiting" }

    case "SUCCESS":
      return {
        stage: "success",
        result: action.result,
        error: null,
        countdown: null,
      }

    case "ERROR":
      return {
        stage: "error",
        result: null,
        error: action.error,
        countdown: null,
      }

    case "CANCEL":
      return {
        stage: "idle",
        result: null,
        error: "Request cancelled",
        countdown: null,
      }

    case "RESET":
      return initialState

    case "TICK":
      if (state.countdown === null || state.countdown <= 0) return state
      return { ...state, countdown: state.countdown - 1 }

    default:
      return state
  }
}

const isActiveStage = (stage: PipelineStage): boolean => {
  return stage === "sending" || stage === "waiting"
}

export const useApiRequest = () => {
  const [state, dispatch] = useReducer(requestReducer, initialState)

  const abortControllerRef = useRef<AbortController | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)
  const timeoutIdRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const wasManuallyCancelledRef = useRef(false)

  const cleanup = useCallback(() => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const sendRequest = useCallback(
    async (url: string, method: HttpMethod, body?: string, timeout = 30) => {
      wasManuallyCancelledRef.current = false

      dispatch({ type: "SEND", timeout })

      startTimeRef.current = performance.now()

      const controller = new AbortController()
      abortControllerRef.current = controller

      countdownIntervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" })
      }, 1000)

      timeoutIdRef.current = setTimeout(() => {
        controller.abort()
      }, timeout * 1000)

      try {
        await new Promise((r) => setTimeout(r, 500))

        if (controller.signal.aborted) {
          throw new DOMException("The operation was aborted.", "AbortError")
        }

        dispatch({ type: "WAITING" })

        const response = await mockFetch(url, {
          method,
          body: method === "POST" || method === "PUT" ? body : undefined,
          signal: controller.signal,
        })

        const duration = Math.round(performance.now() - startTimeRef.current)

        cleanup()
        dispatch({ type: "SUCCESS", result: { response, duration } })
      } catch (err: unknown) {
        cleanup()

        if (wasManuallyCancelledRef.current) {
          return
        }

        if (err instanceof DOMException && err.name === "AbortError") {
          dispatch({ type: "ERROR", error: "Request timed out" })
        } else {
          dispatch({
            type: "ERROR",
            error: err instanceof Error ? err.message : "Unknown error",
          })
        }
      }
    },
    [cleanup],
  )

  const cancelRequest = useCallback(() => {
    if (isActiveStage(state.stage)) {
      wasManuallyCancelledRef.current = true
      cleanup()
      dispatch({ type: "CANCEL" })
    }
  }, [state.stage, cleanup])

  const reset = useCallback(() => {
    cleanup()
    dispatch({ type: "RESET" })
  }, [cleanup])

  return {
    ...state,
    isActive: isActiveStage(state.stage),
    sendRequest,
    cancelRequest,
    reset,
  }
}
