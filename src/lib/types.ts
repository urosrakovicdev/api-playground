export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type PipelineStage = "idle" | "sending" | "waiting" | "success" | "error";

export interface MockResponse {
  status: number;
  statusText: string;
  body: unknown;
}

export interface RequestResult {
  response: MockResponse;
  duration: number;
}

export interface RequestState {
  stage: PipelineStage;
  result: RequestResult | null;
  error: string | null;
  countdown: number | null;
}

export type RequestAction =
  | { type: "SEND"; timeout: number }
  | { type: "WAITING" }
  | { type: "SUCCESS"; result: RequestResult }
  | { type: "ERROR"; error: string }
  | { type: "CANCEL" }
  | { type: "RESET" }
  | { type: "TICK" };
