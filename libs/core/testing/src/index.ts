/**
 * @gello/core-testing
 *
 * Testing utilities for Gello applications.
 *
 * This module provides:
 * - Test HTTP client for integration testing
 * - Effect testing helpers
 * - Custom assertions
 */

// Test client
export {
  type TestRequest,
  type TestResponse,
  type TestClient,
  createTestRequest,
  parseTestResponse,
  createTestClient,
} from './TestClient.js';

// Effect testing utilities
export {
  runEffect,
  runEffectWith,
  expectSuccess as runExpectSuccess,
  expectFailure,
  expectFailureTag,
  runToExit,
  assertSucceeds,
  assertFails,
  mockLayer,
  withTestScope,
  withTimeout,
  collectAll,
  eventually,
} from './EffectTest.js';

// Custom assertions
export {
  expectStatus,
  expectSuccess,
  expectRedirect,
  expectClientError,
  expectServerError,
  expectBody,
  expectBodyContains,
  expectHeader,
  expectJson,
  expectOk,
  expectCreated,
  expectNoContent,
  expectBadRequest,
  expectUnauthorized,
  expectForbidden,
  expectNotFound,
  expectInternalError,
  expectErrorCode,
  expectErrorStatus,
  expectApiResponse,
} from './Assertions.js';
