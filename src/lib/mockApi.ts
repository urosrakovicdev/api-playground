import type { HttpMethod, MockResponse } from "./types"

const MOCK_RESPONSES = {
  GET: {
    status: 200,
    statusText: "OK",
    body: {
      users: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com" },
        { id: 2, name: "Bob Smith", email: "bob@example.com" },
        { id: 3, name: "Carol Williams", email: "carol@example.com" },
      ],
      total: 3,
      page: 1,
    },
  },
  POST: {
    status: 201,
    statusText: "Created",
    body: {
      id: 4,
      message: "Resource created successfully",
      createdAt: new Date().toISOString(),
    },
  },
  PUT: {
    status: 200,
    statusText: "OK",
    body: {
      id: 1,
      message: "Resource updated successfully",
      updatedAt: new Date().toISOString(),
    },
  },
  DELETE: {
    status: 204,
    statusText: "No Content",
    body: null,
  },
}

export const mockFetch = async (
  _url: string,
  options: {
    method: HttpMethod
    body?: string
    signal?: AbortSignal
  },
): Promise<MockResponse> => {
  const { method, signal } = options

  const delay = 800 + Math.random() * 2200

  return new Promise<MockResponse>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve(MOCK_RESPONSES[method])
    }, delay)

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId)
        reject(new DOMException("The operation was aborted.", "AbortError"))
      },
      { once: true },
    )
  })
}
