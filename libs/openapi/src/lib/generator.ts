/**
 * OpenAPI Generator
 *
 * Generates OpenAPI 3.1 specifications from Effect schemas and route definitions.
 */
import * as S from '@effect/schema/Schema';
import * as AST from '@effect/schema/AST';

// ============================================================================
// Types
// ============================================================================

export interface OpenAPIDocument {
  openapi: '3.1.0';
  info: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths: Record<string, OpenAPIPathItem>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
    securitySchemes?: Record<string, OpenAPISecurityScheme>;
  };
}

export interface OpenAPIInfo {
  title: string;
  version: string;
  description?: string;
}

export interface OpenAPIServer {
  url: string;
  description?: string;
}

export interface OpenAPIPathItem {
  get?: OpenAPIOperation;
  post?: OpenAPIOperation;
  put?: OpenAPIOperation;
  patch?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  options?: OpenAPIOperation;
  head?: OpenAPIOperation;
}

export interface OpenAPIOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: Record<string, OpenAPIResponse>;
  security?: Array<Record<string, string[]>>;
  deprecated?: boolean;
}

export interface OpenAPIParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  required?: boolean;
  description?: string;
  schema: OpenAPISchema;
}

export interface OpenAPIRequestBody {
  required?: boolean;
  description?: string;
  content: {
    'application/json'?: {
      schema: OpenAPISchema;
    };
  };
}

export interface OpenAPIResponse {
  description: string;
  content?: {
    'application/json'?: {
      schema: OpenAPISchema;
    };
  };
}

export interface OpenAPISchema {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null';
  format?: string;
  description?: string;
  example?: unknown;
  enum?: unknown[];
  items?: OpenAPISchema;
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  additionalProperties?: boolean | OpenAPISchema;
  oneOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  allOf?: OpenAPISchema[];
  nullable?: boolean;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  default?: unknown;
  deprecated?: boolean;
  $ref?: string;
}

export interface OpenAPISecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
}

// ============================================================================
// Route Definition Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface RouteMetadata {
  summary?: string;
  description?: string;
  tags?: string[];
  operationId?: string;
  deprecated?: boolean;
  security?: Array<Record<string, string[]>>;
}

// ============================================================================
// Error Response Types
// ============================================================================

export interface ErrorResponse {
  status: number;
  description: string;
  schema?: S.Schema<unknown>;
}

/**
 * Common HTTP error status codes with descriptions
 */
export const HttpErrors = {
  BadRequest: { status: 400, description: 'Bad Request - Invalid input' },
  Unauthorized: { status: 401, description: 'Unauthorized - Authentication required' },
  Forbidden: { status: 403, description: 'Forbidden - Insufficient permissions' },
  NotFound: { status: 404, description: 'Not Found - Resource does not exist' },
  Conflict: { status: 409, description: 'Conflict - Resource already exists' },
  UnprocessableEntity: { status: 422, description: 'Unprocessable Entity - Validation failed' },
  TooManyRequests: { status: 429, description: 'Too Many Requests - Rate limit exceeded' },
  InternalServerError: { status: 500, description: 'Internal Server Error' },
  ServiceUnavailable: { status: 503, description: 'Service Unavailable' },
} as const;

/**
 * Common error response schema
 */
export const ErrorResponseSchema = S.Struct({
  error: S.Struct({
    code: S.String,
    message: S.String,
    details: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  }),
});

/**
 * Validation error response schema
 */
export const ValidationErrorSchema = S.Struct({
  error: S.Struct({
    code: S.Literal('VALIDATION_ERROR'),
    message: S.String,
    details: S.Array(S.Struct({
      field: S.String,
      message: S.String,
      code: S.String,
    })),
  }),
});

/**
 * Security requirement types
 */
export type SecurityRequirement =
  | { type: 'bearer' }
  | { type: 'apiKey'; scopes?: string[] }
  | { type: 'oauth2'; scopes: string[] };

export interface RouteDefinition<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
  TResponse = unknown,
> {
  method: HttpMethod;
  path: string;
  params?: S.Schema<TParams>;
  query?: S.Schema<TQuery>;
  body?: S.Schema<TBody>;
  response?: S.Schema<TResponse>;
  responses?: Record<number, S.Schema<unknown>>;
  errors?: ErrorResponse[];
  metadata?: RouteMetadata;
}

export interface GeneratorOptions {
  title?: string;
  version?: string;
  description?: string;
  servers?: OpenAPIServer[];
}

// ============================================================================
// OpenAPI Generator
// ============================================================================

export class OpenApiGenerator {
  private schemas: Map<string, OpenAPISchema> = new Map();

  /**
   * Generate OpenAPI document from route definitions
   */
  static fromRoutes(
    routes: RouteDefinition[],
    options: GeneratorOptions = {}
  ): OpenAPIDocument {
    const generator = new OpenApiGenerator();
    const paths: Record<string, OpenAPIPathItem> = {};

    for (const route of routes) {
      const openApiPath = generator.convertPath(route.path);

      if (!paths[openApiPath]) {
        paths[openApiPath] = {};
      }

      const method = route.method.toLowerCase() as keyof OpenAPIPathItem;
      paths[openApiPath][method] = generator.generateOperation(route);
    }

    return {
      openapi: '3.1.0',
      info: {
        title: options.title ?? 'API',
        version: options.version ?? '1.0.0',
        description: options.description,
      },
      servers: options.servers,
      paths,
      components: {
        schemas: Object.fromEntries(generator.schemas),
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
          },
        },
      },
    };
  }

  /**
   * Convert Effect Schema to OpenAPI Schema
   */
  static schemaToOpenApi(schema: S.Schema<any>): OpenAPISchema {
    const generator = new OpenApiGenerator();
    return generator.astToOpenApi(schema.ast);
  }

  /**
   * Convert route path from :param to {param} format
   */
  private convertPath(path: string): string {
    return path.replace(/:(\w+)/g, '{$1}');
  }

  /**
   * Generate OpenAPI operation from route definition
   */
  private generateOperation(route: RouteDefinition): OpenAPIOperation {
    const operation: OpenAPIOperation = {
      operationId: route.metadata?.operationId,
      summary: route.metadata?.summary,
      description: route.metadata?.description,
      tags: route.metadata?.tags,
      deprecated: route.metadata?.deprecated,
      security: route.metadata?.security,
      parameters: [],
      responses: {},
    };

    // Path parameters
    if (route.params) {
      const paramsSchema = this.astToOpenApi(route.params.ast);
      if (paramsSchema.properties) {
        for (const [name, schema] of Object.entries(paramsSchema.properties)) {
          operation.parameters!.push({
            name,
            in: 'path',
            required: true,
            description: (schema as OpenAPISchema).description,
            schema: schema as OpenAPISchema,
          });
        }
      }
    }

    // Query parameters
    if (route.query) {
      const querySchema = this.astToOpenApi(route.query.ast);
      if (querySchema.properties) {
        const required = querySchema.required ?? [];
        for (const [name, schema] of Object.entries(querySchema.properties)) {
          operation.parameters!.push({
            name,
            in: 'query',
            required: required.includes(name),
            description: (schema as OpenAPISchema).description,
            schema: schema as OpenAPISchema,
          });
        }
      }
    }

    // Request body
    if (route.body) {
      operation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: this.astToOpenApi(route.body.ast),
          },
        },
      };
    }

    // Success response
    const successStatus = route.method === 'POST' ? '201' : '200';
    operation.responses[successStatus] = {
      description: 'Successful response',
    };

    if (route.response) {
      operation.responses[successStatus].content = {
        'application/json': {
          schema: this.astToOpenApi(route.response.ast),
        },
      };
    }

    // Additional responses
    if (route.responses) {
      for (const [status, schema] of Object.entries(route.responses)) {
        operation.responses[status] = {
          description: `Response ${status}`,
          content: {
            'application/json': {
              schema: this.astToOpenApi(schema.ast),
            },
          },
        };
      }
    }

    // Error responses
    if (route.errors) {
      for (const error of route.errors) {
        const response: OpenAPIResponse = {
          description: error.description,
        };

        if (error.schema) {
          response.content = {
            'application/json': {
              schema: this.astToOpenApi(error.schema.ast),
            },
          };
        }

        operation.responses[String(error.status)] = response;
      }
    }

    // Add common error responses if not defined
    if (!operation.responses['400']) {
      operation.responses['400'] = { description: 'Bad Request' };
    }
    if (!operation.responses['500']) {
      operation.responses['500'] = { description: 'Internal Server Error' };
    }

    return operation;
  }

  /**
   * Convert Effect Schema AST to OpenAPI Schema
   */
  private astToOpenApi(ast: AST.AST): OpenAPISchema {
    // Get annotations
    const annotations = this.getAnnotations(ast);
    const baseSchema = this.convertAst(ast);

    return {
      ...baseSchema,
      description: annotations.description,
      example: annotations.example,
      deprecated: annotations.deprecated,
      default: annotations.default,
    };
  }

  private convertAst(ast: AST.AST): OpenAPISchema {
    switch (ast._tag) {
      case 'StringKeyword':
        return { type: 'string' };

      case 'NumberKeyword':
        return { type: 'number' };

      case 'BooleanKeyword':
        return { type: 'boolean' };

      case 'BigIntKeyword':
        return { type: 'integer', format: 'int64' };

      case 'SymbolKeyword':
        return { type: 'string' };

      case 'ObjectKeyword':
        return { type: 'object' };

      case 'UnknownKeyword':
      case 'AnyKeyword':
        return {};

      case 'VoidKeyword':
      case 'NeverKeyword':
      case 'UndefinedKeyword':
        return { type: 'null' };

      case 'Literal': {
        const literal = ast.literal;
        if (typeof literal === 'string') {
          return { type: 'string', enum: [literal] };
        }
        if (typeof literal === 'number') {
          return { type: 'number', enum: [literal] };
        }
        if (typeof literal === 'boolean') {
          return { type: 'boolean', enum: [literal] };
        }
        if (literal === null) {
          return { type: 'null' };
        }
        return {};
      }

      case 'Union': {
        // Check if it's an enum (all literals of same type)
        const allStringLiterals = ast.types.every(
          (t) => t._tag === 'Literal' && typeof (t as AST.Literal).literal === 'string'
        );
        const allNumberLiterals = ast.types.every(
          (t) => t._tag === 'Literal' && typeof (t as AST.Literal).literal === 'number'
        );

        if (allStringLiterals) {
          return {
            type: 'string',
            enum: ast.types.map((t) => (t as AST.Literal).literal),
          };
        }

        if (allNumberLiterals) {
          return {
            type: 'number',
            enum: ast.types.map((t) => (t as AST.Literal).literal),
          };
        }

        // Check for nullable pattern (T | undefined | null)
        const nonNullTypes = ast.types.filter(
          (t) => t._tag !== 'UndefinedKeyword' && !(t._tag === 'Literal' && t.literal === null)
        );

        if (nonNullTypes.length === 1) {
          const schema = this.astToOpenApi(nonNullTypes[0]);
          return { ...schema, nullable: true };
        }

        // Generic union
        return {
          oneOf: ast.types.map((t) => this.astToOpenApi(t)),
        };
      }

      case 'TypeLiteral': {
        const properties: Record<string, OpenAPISchema> = {};
        const required: string[] = [];

        for (const prop of ast.propertySignatures) {
          const name = String(prop.name);
          properties[name] = this.astToOpenApi(prop.type);

          if (!prop.isOptional) {
            required.push(name);
          }
        }

        return {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
        };
      }

      case 'TupleType': {
        if (ast.rest.length > 0) {
          // Array with rest element
          return {
            type: 'array',
            items: this.astToOpenApi(ast.rest[0].type),
          };
        }

        // Fixed tuple
        if (ast.elements.length === 1) {
          return {
            type: 'array',
            items: this.astToOpenApi(ast.elements[0].type),
          };
        }

        return {
          type: 'array',
          items: {
            oneOf: ast.elements.map((e) => this.astToOpenApi(e.type)),
          },
        };
      }

      case 'Refinement': {
        const from = this.convertAst(ast.from);
        const annotations = this.getAnnotations(ast);

        // Try to extract refinement constraints
        // This is a simplified version - full implementation would parse refinement predicates
        return {
          ...from,
          ...annotations,
        };
      }

      case 'Transformation': {
        // Use the "to" type for the output schema
        return this.astToOpenApi(ast.to);
      }

      case 'Declaration': {
        // Get the type parameters and decode them
        if (ast.typeParameters.length > 0) {
          return this.astToOpenApi(ast.typeParameters[0]);
        }
        return {};
      }

      case 'Suspend': {
        // Handle lazy/recursive schemas
        return this.astToOpenApi(ast.f());
      }

      default:
        return {};
    }
  }

  private getAnnotations(ast: AST.AST): {
    description?: string;
    example?: unknown;
    deprecated?: boolean;
    default?: unknown;
    format?: string;
  } {
    const result: {
      description?: string;
      example?: unknown;
      deprecated?: boolean;
      default?: unknown;
      format?: string;
    } = {};

    // Try to get annotations from the AST
    const getAnnotation = <T>(key: symbol): T | undefined => {
      try {
        return (ast as any).annotations?.[key] as T | undefined;
      } catch {
        return undefined;
      }
    };

    // Common annotation symbols from @effect/schema
    const descSymbol = Symbol.for('@effect/schema/annotation/Description');
    const exampleSymbol = Symbol.for('@effect/schema/annotation/Examples');
    const titleSymbol = Symbol.for('@effect/schema/annotation/Title');

    result.description = getAnnotation<string>(descSymbol) ?? getAnnotation<string>(titleSymbol);

    const examples = getAnnotation<unknown[]>(exampleSymbol);
    if (examples && examples.length > 0) {
      result.example = examples[0];
    }

    return result;
  }
}

// ============================================================================
// Route Builder Helpers
// ============================================================================

/**
 * Create a route definition for OpenAPI generation
 */
export function createRoute<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
  TResponse = unknown,
>(definition: RouteDefinition<TParams, TQuery, TBody, TResponse>): RouteDefinition<TParams, TQuery, TBody, TResponse> {
  return definition;
}

/**
 * Route builder with fluent API
 */
export class RouteBuilder<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
  TResponse = unknown,
> {
  private definition: Partial<RouteDefinition<TParams, TQuery, TBody, TResponse>> = {};

  static get(path: string): RouteBuilder {
    const builder = new RouteBuilder();
    builder.definition.method = 'GET';
    builder.definition.path = path;
    return builder;
  }

  static post(path: string): RouteBuilder {
    const builder = new RouteBuilder();
    builder.definition.method = 'POST';
    builder.definition.path = path;
    return builder;
  }

  static put(path: string): RouteBuilder {
    const builder = new RouteBuilder();
    builder.definition.method = 'PUT';
    builder.definition.path = path;
    return builder;
  }

  static patch(path: string): RouteBuilder {
    const builder = new RouteBuilder();
    builder.definition.method = 'PATCH';
    builder.definition.path = path;
    return builder;
  }

  static delete(path: string): RouteBuilder {
    const builder = new RouteBuilder();
    builder.definition.method = 'DELETE';
    builder.definition.path = path;
    return builder;
  }

  params<T>(schema: S.Schema<T>): RouteBuilder<T, TQuery, TBody, TResponse> {
    this.definition.params = schema as any;
    return this as any;
  }

  query<T>(schema: S.Schema<T>): RouteBuilder<TParams, T, TBody, TResponse> {
    this.definition.query = schema as any;
    return this as any;
  }

  body<T>(schema: S.Schema<T>): RouteBuilder<TParams, TQuery, T, TResponse> {
    this.definition.body = schema as any;
    return this as any;
  }

  response<T>(schema: S.Schema<T>): RouteBuilder<TParams, TQuery, TBody, T> {
    this.definition.response = schema as any;
    return this as any;
  }

  summary(summary: string): this {
    if (!this.definition.metadata) {
      this.definition.metadata = {};
    }
    this.definition.metadata.summary = summary;
    return this;
  }

  description(description: string): this {
    if (!this.definition.metadata) {
      this.definition.metadata = {};
    }
    this.definition.metadata.description = description;
    return this;
  }

  tags(...tags: string[]): this {
    if (!this.definition.metadata) {
      this.definition.metadata = {};
    }
    this.definition.metadata.tags = tags;
    return this;
  }

  operationId(id: string): this {
    if (!this.definition.metadata) {
      this.definition.metadata = {};
    }
    this.definition.metadata.operationId = id;
    return this;
  }

  deprecated(): this {
    if (!this.definition.metadata) {
      this.definition.metadata = {};
    }
    this.definition.metadata.deprecated = true;
    return this;
  }

  /**
   * Add error responses to the route
   */
  errors(...errors: ErrorResponse[]): this {
    if (!this.definition.errors) {
      this.definition.errors = [];
    }
    this.definition.errors.push(...errors);
    return this;
  }

  /**
   * Add a specific error response with optional schema
   */
  error(status: number, description: string, schema?: S.Schema<unknown>): this {
    if (!this.definition.errors) {
      this.definition.errors = [];
    }
    this.definition.errors.push({ status, description, schema });
    return this;
  }

  /**
   * Add 404 Not Found error
   */
  notFound(description = 'Resource not found'): this {
    return this.error(404, description);
  }

  /**
   * Add 401 Unauthorized error
   */
  unauthorized(description = 'Authentication required'): this {
    return this.error(401, description);
  }

  /**
   * Add 403 Forbidden error
   */
  forbidden(description = 'Insufficient permissions'): this {
    return this.error(403, description);
  }

  /**
   * Add 409 Conflict error
   */
  conflict(description = 'Resource already exists'): this {
    return this.error(409, description);
  }

  /**
   * Add 422 Validation Error with schema
   */
  validationError(schema?: S.Schema<unknown>): this {
    return this.error(422, 'Validation failed', schema ?? (ValidationErrorSchema as S.Schema<unknown>));
  }

  /**
   * Set security requirements for the route
   */
  security(...requirements: SecurityRequirement[]): this {
    if (!this.definition.metadata) {
      this.definition.metadata = {};
    }
    this.definition.metadata.security = requirements.map((req): Record<string, string[]> => {
      switch (req.type) {
        case 'bearer':
          return { bearerAuth: [] };
        case 'apiKey':
          return { apiKey: req.scopes ?? [] };
        case 'oauth2':
          return { oauth2: req.scopes };
      }
    });
    return this;
  }

  /**
   * Mark route as requiring bearer token authentication
   */
  requiresAuth(): this {
    return this.security({ type: 'bearer' });
  }

  /**
   * Mark route as requiring specific OAuth2 scopes
   */
  requiresScopes(...scopes: string[]): this {
    return this.security({ type: 'oauth2', scopes });
  }

  build(): RouteDefinition<TParams, TQuery, TBody, TResponse> {
    if (!this.definition.method || !this.definition.path) {
      throw new Error('Route method and path are required');
    }
    return this.definition as RouteDefinition<TParams, TQuery, TBody, TResponse>;
  }
}

export const Route = RouteBuilder;
