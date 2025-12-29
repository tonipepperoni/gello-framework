/**
 * Test HTTP client for testing Gello applications.
 *
 * Provides a convenient way to test routes without starting a real server.
 */
import { Effect } from 'effect';
import { HttpServerRequest, HttpServerResponse } from '@effect/platform';
import type { HttpError } from '@gello/core-contracts';

/**
 * Test request configuration.
 */
export interface TestRequest {
  readonly method: string;
  readonly path: string;
  readonly headers?: Record<string, string>;
  readonly body?: unknown;
  readonly query?: Record<string, string>;
}

/**
 * Test response result.
 */
export interface TestResponse {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: unknown;
  readonly text: string;
}

/**
 * Create a test request object.
 */
export const createTestRequest = (config: TestRequest): HttpServerRequest.HttpServerRequest => {
  const url = new URL(config.path, 'http://localhost:3000');

  if (config.query) {
    for (const [key, value] of Object.entries(config.query)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    host: 'localhost:3000',
    ...config.headers,
  };

  if (config.body && !headers['content-type']) {
    headers['content-type'] = 'application/json';
  }

  // Create a minimal request object for testing
  const bodyString = config.body ? JSON.stringify(config.body) : '';
  const bodyStream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(bodyString));
      controller.close();
    },
  });

  return {
    url: url.toString(),
    method: config.method,
    headers,
    body: bodyStream,
    remoteAddress: '127.0.0.1',
  } as unknown as HttpServerRequest.HttpServerRequest;
};

/**
 * Parse test response from HttpServerResponse.
 */
export const parseTestResponse = async (
  response: HttpServerResponse.HttpServerResponse
): Promise<TestResponse> => {
  const headers: Record<string, string> = {};

  // Extract headers
  const responseHeaders = (response as any).headers ?? {};
  for (const [key, value] of Object.entries(responseHeaders)) {
    if (typeof value === 'string') {
      headers[key.toLowerCase()] = value;
    }
  }

  // Extract body
  let text = '';
  let body: unknown = null;

  const responseBody = (response as any).body;
  if (responseBody) {
    if (typeof responseBody === 'string') {
      text = responseBody;
    } else if (responseBody instanceof Uint8Array) {
      text = new TextDecoder().decode(responseBody);
    }
  }

  // Try to parse as JSON
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return {
    status: (response as any).status ?? 200,
    headers,
    body,
    text,
  };
};

/**
 * Test client for making requests to a handler.
 */
export interface TestClient<R = never> {
  /**
   * Make a GET request.
   */
  readonly get: (
    path: string,
    options?: { headers?: Record<string, string>; query?: Record<string, string> }
  ) => Effect.Effect<TestResponse, HttpError, R>;

  /**
   * Make a POST request.
   */
  readonly post: (
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; query?: Record<string, string> }
  ) => Effect.Effect<TestResponse, HttpError, R>;

  /**
   * Make a PUT request.
   */
  readonly put: (
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; query?: Record<string, string> }
  ) => Effect.Effect<TestResponse, HttpError, R>;

  /**
   * Make a PATCH request.
   */
  readonly patch: (
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; query?: Record<string, string> }
  ) => Effect.Effect<TestResponse, HttpError, R>;

  /**
   * Make a DELETE request.
   */
  readonly delete: (
    path: string,
    options?: { headers?: Record<string, string>; query?: Record<string, string> }
  ) => Effect.Effect<TestResponse, HttpError, R>;

  /**
   * Make a custom request.
   */
  readonly request: (config: TestRequest) => Effect.Effect<TestResponse, HttpError, R>;
}

/**
 * Create a test client for a handler function.
 */
export const createTestClient = <R>(
  handler: (
    request: HttpServerRequest.HttpServerRequest
  ) => Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R>
): TestClient<R> => {
  const request = (config: TestRequest): Effect.Effect<TestResponse, HttpError, R> =>
    Effect.gen(function* () {
      const testRequest = createTestRequest(config);
      const response = yield* handler(testRequest);
      return yield* Effect.promise(() => parseTestResponse(response));
    });

  return {
    get: (path, options) =>
      request({ method: 'GET', path, ...options }),

    post: (path, body, options) =>
      request({ method: 'POST', path, body, ...options }),

    put: (path, body, options) =>
      request({ method: 'PUT', path, body, ...options }),

    patch: (path, body, options) =>
      request({ method: 'PATCH', path, body, ...options }),

    delete: (path, options) =>
      request({ method: 'DELETE', path, ...options }),

    request,
  };
};
