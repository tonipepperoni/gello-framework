/**
 * Custom assertions for testing Gello applications.
 */
import { expect } from 'vitest';
import type { TestResponse } from './TestClient.js';
import type { HttpError } from '@gello/core-contracts';

/**
 * Assert response has expected status code.
 */
export const expectStatus = (
  response: TestResponse,
  status: number
): void => {
  expect(response.status).toBe(status);
};

/**
 * Assert response is successful (2xx).
 */
export const expectSuccess = (response: TestResponse): void => {
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(300);
};

/**
 * Assert response is a redirect (3xx).
 */
export const expectRedirect = (
  response: TestResponse,
  location?: string
): void => {
  expect(response.status).toBeGreaterThanOrEqual(300);
  expect(response.status).toBeLessThan(400);
  if (location) {
    expect(response.headers['location']).toBe(location);
  }
};

/**
 * Assert response is client error (4xx).
 */
export const expectClientError = (response: TestResponse): void => {
  expect(response.status).toBeGreaterThanOrEqual(400);
  expect(response.status).toBeLessThan(500);
};

/**
 * Assert response is server error (5xx).
 */
export const expectServerError = (response: TestResponse): void => {
  expect(response.status).toBeGreaterThanOrEqual(500);
  expect(response.status).toBeLessThan(600);
};

/**
 * Assert response body matches expected value.
 */
export const expectBody = <T>(
  response: TestResponse,
  expected: T
): void => {
  expect(response.body).toEqual(expected);
};

/**
 * Assert response body contains expected properties.
 */
export const expectBodyContains = (
  response: TestResponse,
  expected: Record<string, unknown>
): void => {
  expect(response.body).toMatchObject(expected);
};

/**
 * Assert response has header with expected value.
 */
export const expectHeader = (
  response: TestResponse,
  name: string,
  value: string
): void => {
  expect(response.headers[name.toLowerCase()]).toBe(value);
};

/**
 * Assert response has JSON content type.
 */
export const expectJson = (response: TestResponse): void => {
  expect(response.headers['content-type']).toContain('application/json');
};

/**
 * Assert response is OK (200).
 */
export const expectOk = (response: TestResponse): void => {
  expectStatus(response, 200);
};

/**
 * Assert response is Created (201).
 */
export const expectCreated = (response: TestResponse): void => {
  expectStatus(response, 201);
};

/**
 * Assert response is No Content (204).
 */
export const expectNoContent = (response: TestResponse): void => {
  expectStatus(response, 204);
};

/**
 * Assert response is Bad Request (400).
 */
export const expectBadRequest = (response: TestResponse): void => {
  expectStatus(response, 400);
};

/**
 * Assert response is Unauthorized (401).
 */
export const expectUnauthorized = (response: TestResponse): void => {
  expectStatus(response, 401);
};

/**
 * Assert response is Forbidden (403).
 */
export const expectForbidden = (response: TestResponse): void => {
  expectStatus(response, 403);
};

/**
 * Assert response is Not Found (404).
 */
export const expectNotFound = (response: TestResponse): void => {
  expectStatus(response, 404);
};

/**
 * Assert response is Internal Server Error (500).
 */
export const expectInternalError = (response: TestResponse): void => {
  expectStatus(response, 500);
};

/**
 * Assert error has expected code.
 */
export const expectErrorCode = (
  error: HttpError,
  code: string
): void => {
  expect(error.code).toBe(code);
};

/**
 * Assert error has expected status code.
 */
export const expectErrorStatus = (
  error: HttpError,
  statusCode: number
): void => {
  expect(error.status).toBe(statusCode);
};

/**
 * Assert response matches API response structure.
 */
export const expectApiResponse = (
  response: TestResponse,
  options: {
    readonly success: boolean;
    readonly status?: number;
    readonly hasData?: boolean;
    readonly hasError?: boolean;
  }
): void => {
  if (options.status !== undefined) {
    expectStatus(response, options.status);
  }

  const body = response.body as Record<string, unknown>;
  expect(body).toHaveProperty('success', options.success);

  if (options.hasData) {
    expect(body).toHaveProperty('data');
  }

  if (options.hasError) {
    expect(body).toHaveProperty('error');
  }
};
