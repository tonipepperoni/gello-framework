/**
 * @gello/core-adapter-node
 *
 * Node.js HTTP Server adapter for the Gello framework.
 *
 * This module provides:
 * - Gello application builder
 * - Node.js HTTP server integration
 * - Request/Response helpers
 */

// Application builder
export {
  type GelloAppConfig,
  type RouteHandler,
  type Route,
  type GelloApp,
  defaultAppConfig,
  createApp,
  runApp,
  run,
  route,
} from './NodeServer.js';

// Response helpers
export {
  json,
  text,
  html,
  noContent,
  redirect,
  created,
  accepted,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internalError,
  type ApiResponseData,
  success,
  paginated,
} from './Response.js';

// Request helpers
export {
  getRequest,
  getUrl,
  getMethod,
  getPath,
  getHeader,
  getRequiredHeader,
  getHeaders,
  getQueryParams,
  getQueryParam,
  getRequiredQueryParam,
  getJsonBody,
  getContentType,
  isJsonRequest,
  getAuthorization,
  getBearerToken,
  getRequiredBearerToken,
  getRequestId,
} from './Request.js';
