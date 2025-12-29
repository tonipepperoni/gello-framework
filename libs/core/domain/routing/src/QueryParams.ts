/**
 * Query parameter extraction and validation
 */

import { Effect, Option } from "effect";
import * as S from "@effect/schema/Schema";
import { QueryParams } from "@gello/core-contracts";
import { HttpError } from "@gello/core-contracts";

/**
 * Get a query parameter by name
 */
export const getQuery = (
  name: string
): Effect.Effect<Option.Option<string>, never, QueryParams> =>
  Effect.gen(function* () {
    const params = yield* QueryParams;
    return Option.fromNullable(params.get(name));
  });

/**
 * Get a required query parameter by name
 */
export const getQueryRequired = (
  name: string
): Effect.Effect<string, HttpError, QueryParams> =>
  Effect.gen(function* () {
    const params = yield* QueryParams;
    const value = params.get(name);

    if (value === null || value === "") {
      return yield* Effect.fail(
        HttpError.BadRequest(`Missing required query parameter: ${name}`)
      );
    }

    return value;
  });

/**
 * Get a query parameter with a default value
 */
export const getQueryWithDefault = (
  name: string,
  defaultValue: string
): Effect.Effect<string, never, QueryParams> =>
  Effect.gen(function* () {
    const params = yield* QueryParams;
    return params.get(name) ?? defaultValue;
  });

/**
 * Get a query parameter and decode it with a schema
 */
export const getQueryAs = <A>(
  name: string,
  schema: S.Schema<A, string>
): Effect.Effect<Option.Option<A>, HttpError, QueryParams> =>
  Effect.gen(function* () {
    const maybeValue = yield* getQuery(name);

    if (Option.isNone(maybeValue)) {
      return Option.none();
    }

    const decoded = yield* S.decode(schema)(maybeValue.value).pipe(
      Effect.mapError(() =>
        HttpError.BadRequest(`Invalid value for query parameter: ${name}`)
      )
    );

    return Option.some(decoded);
  });

/**
 * Get a query parameter as a number
 */
export const getQueryAsNumber = (
  name: string
): Effect.Effect<Option.Option<number>, HttpError, QueryParams> =>
  getQueryAs(name, S.NumberFromString);

/**
 * Get a query parameter as a boolean
 */
export const getQueryAsBoolean = (
  name: string
): Effect.Effect<Option.Option<boolean>, never, QueryParams> =>
  Effect.gen(function* () {
    const maybeValue = yield* getQuery(name);

    if (Option.isNone(maybeValue)) {
      return Option.none();
    }

    const value = maybeValue.value.toLowerCase();
    return Option.some(value === "true" || value === "1" || value === "yes");
  });

/**
 * Get all query parameters as an array for a given name
 */
export const getQueryAll = (
  name: string
): Effect.Effect<readonly string[], never, QueryParams> =>
  Effect.gen(function* () {
    const params = yield* QueryParams;
    return params.getAll(name);
  });

/**
 * Get all query parameters as a record
 */
export const getAllQueries = (): Effect.Effect<
  Record<string, string>,
  never,
  QueryParams
> =>
  Effect.gen(function* () {
    const params = yield* QueryParams;
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  });

/**
 * Validate query parameters against a schema
 */
export const validateQueries = <A>(
  schema: S.Schema<A, Record<string, string>>
): Effect.Effect<A, HttpError, QueryParams> =>
  Effect.gen(function* () {
    const queries = yield* getAllQueries();

    return yield* S.decode(schema)(queries).pipe(
      Effect.mapError(() => HttpError.BadRequest("Invalid query parameters"))
    );
  });

/**
 * Parse pagination from query parameters
 */
export const getPagination = (options?: {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}): Effect.Effect<{ page: number; limit: number }, HttpError, QueryParams> =>
  Effect.gen(function* () {
    const { defaultPage = 1, defaultLimit = 20, maxLimit = 100 } = options ?? {};

    const maybePage = yield* getQueryAsNumber("page");
    const maybeLimit = yield* getQueryAsNumber("limit");

    const page = Option.getOrElse(maybePage, () => defaultPage);
    const requestedLimit = Option.getOrElse(maybeLimit, () => defaultLimit);
    const limit = Math.min(requestedLimit, maxLimit);

    if (page < 1) {
      return yield* Effect.fail(HttpError.BadRequest("Page must be >= 1"));
    }

    if (limit < 1) {
      return yield* Effect.fail(HttpError.BadRequest("Limit must be >= 1"));
    }

    return { page, limit };
  });
