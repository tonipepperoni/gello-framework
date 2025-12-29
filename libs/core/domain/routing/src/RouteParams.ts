/**
 * Route parameter extraction and validation
 */

import { Effect, Option } from "effect";
import * as S from "@effect/schema/Schema";
import { RouteParams } from "@gello/core-contracts";
import { HttpError } from "@gello/core-contracts";

/**
 * Get a route parameter by name
 */
export const getParam = (name: string): Effect.Effect<string, HttpError, RouteParams> =>
  Effect.gen(function* () {
    const params = yield* RouteParams;
    const value = params[name];

    if (value === undefined || value === "") {
      return yield* Effect.fail(
        HttpError.BadRequest(`Missing required route parameter: ${name}`)
      );
    }

    return value;
  });

/**
 * Get an optional route parameter by name
 */
export const getParamOptional = (
  name: string
): Effect.Effect<Option.Option<string>, never, RouteParams> =>
  Effect.gen(function* () {
    const params = yield* RouteParams;
    const value = params[name];
    return Option.fromNullable(value);
  });

/**
 * Get a route parameter and decode it with a schema
 */
export const getParamAs = <A>(
  name: string,
  schema: S.Schema<A, string>
): Effect.Effect<A, HttpError, RouteParams> =>
  Effect.gen(function* () {
    const value = yield* getParam(name);

    return yield* S.decode(schema)(value).pipe(
      Effect.mapError(() =>
        HttpError.BadRequest(`Invalid value for route parameter: ${name}`)
      )
    );
  });

/**
 * Get a route parameter as a number
 */
export const getParamAsNumber = (
  name: string
): Effect.Effect<number, HttpError, RouteParams> =>
  getParamAs(name, S.NumberFromString);

/**
 * Get a route parameter as a UUID
 */
export const getParamAsUUID = (
  name: string
): Effect.Effect<string, HttpError, RouteParams> =>
  Effect.gen(function* () {
    const value = yield* getParam(name);

    // UUID v4 regex
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      return yield* Effect.fail(
        HttpError.BadRequest(`Invalid UUID for route parameter: ${name}`)
      );
    }

    return value;
  });

/**
 * Get all route parameters
 */
export const getAllParams = (): Effect.Effect<
  Record<string, string>,
  never,
  RouteParams
> => RouteParams;

/**
 * Validate route parameters against a schema
 */
export const validateParams = <A>(
  schema: S.Schema<A, Record<string, string>>
): Effect.Effect<A, HttpError, RouteParams> =>
  Effect.gen(function* () {
    const params = yield* RouteParams;

    return yield* S.decode(schema)(params).pipe(
      Effect.mapError(() => HttpError.BadRequest("Invalid route parameters"))
    );
  });
