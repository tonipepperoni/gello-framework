/**
 * Serializer - Port interface for value serialization
 *
 * @module ports/Serializer
 */
import { Context, Effect } from "effect"
import { CacheSerializationError } from "../errors/CacheError.js"

/**
 * Serializer interface for converting values to/from strings
 *
 * Different cache backends may require different serialization formats.
 * For example, Redis stores strings, so values need to be serialized.
 */
export interface Serializer {
  /**
   * Serialize a value to a string
   *
   * @param value - The value to serialize
   */
  readonly serialize: <A>(
    value: A
  ) => Effect.Effect<string, CacheSerializationError>

  /**
   * Deserialize a string to a value
   *
   * @param data - The serialized string
   */
  readonly deserialize: <A>(
    data: string
  ) => Effect.Effect<A, CacheSerializationError>
}

/**
 * Serializer service tag for dependency injection
 */
export class SerializerTag extends Context.Tag("@gello/cache/Serializer")<
  SerializerTag,
  Serializer
>() {}

/**
 * Default JSON serializer implementation
 */
export const JsonSerializer: Serializer = {
  serialize: <A>(value: A) =>
    Effect.try({
      try: () => JSON.stringify(value),
      catch: (cause) =>
        new CacheSerializationError({ operation: "serialize", cause }),
    }),

  deserialize: <A>(data: string) =>
    Effect.try({
      try: () => JSON.parse(data) as A,
      catch: (cause) =>
        new CacheSerializationError({ operation: "deserialize", cause }),
    }),
}

/**
 * Layer providing the default JSON serializer
 */
export const JsonSerializerLive = Context.GenericTag(
  "@gello/cache/Serializer"
).of(JsonSerializer)
