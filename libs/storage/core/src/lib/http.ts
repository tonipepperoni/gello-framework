/**
 * HTTP Response Helpers - Storage file serving utilities
 *
 * Provides convenient helpers for serving files via HTTP responses.
 * Compatible with @effect/platform-node HTTP server.
 *
 * @example
 * ```typescript
 * import { Effect } from "effect"
 * import { Storage } from "@gello/storage"
 * import { download, stream, redirect } from "@gello/storage/http"
 * import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
 *
 * // Download file with Content-Disposition: attachment
 * HttpRouter.get("/download/:path", Effect.gen(function* () {
 *   const storage = yield* Storage
 *   const { path } = yield* HttpRouter.params
 *   return yield* download(storage, path)
 * }))
 *
 * // Stream file inline (view in browser)
 * HttpRouter.get("/view/:path", Effect.gen(function* () {
 *   const storage = yield* Storage
 *   const { path } = yield* HttpRouter.params
 *   return yield* stream(storage, path)
 * }))
 *
 * // Redirect to signed URL
 * HttpRouter.get("/secure/:path", Effect.gen(function* () {
 *   const storage = yield* Storage
 *   const { path } = yield* HttpRouter.params
 *   return yield* redirect(storage, path, Duration.minutes(5))
 * }))
 * ```
 *
 * @module @gello/storage
 */

import { Effect, Duration } from "effect"
import type { StorageService } from "./Storage.js"
import type { StorageError } from "./errors/StorageError.js"
import { basename } from "./domain/FilePath.js"
import { unsafeFilePath } from "./domain/FilePath.js"

/**
 * Options for file download response
 */
export interface DownloadOptions {
  /**
   * Custom filename for Content-Disposition header
   * Defaults to the basename of the path
   */
  readonly filename?: string

  /**
   * Cache-Control header value
   * @default "private, no-cache"
   */
  readonly cacheControl?: string

  /**
   * Additional headers to include
   */
  readonly headers?: Record<string, string>
}

/**
 * Options for file streaming response
 */
export interface StreamOptions {
  /**
   * Content-Disposition: inline (view) or attachment (download)
   * @default "inline"
   */
  readonly disposition?: "inline" | "attachment"

  /**
   * Custom filename for Content-Disposition header
   */
  readonly filename?: string

  /**
   * Cache-Control header value
   * @default "public, max-age=31536000"
   */
  readonly cacheControl?: string

  /**
   * Additional headers to include
   */
  readonly headers?: Record<string, string>
}

/**
 * File response data (for manual response building)
 */
export interface FileResponse {
  /**
   * File contents
   */
  readonly body: Uint8Array

  /**
   * Response status code
   */
  readonly status: number

  /**
   * Response headers
   */
  readonly headers: Record<string, string>
}

/**
 * Create a file download response
 *
 * Returns file with Content-Disposition: attachment, prompting browser download.
 *
 * @example
 * ```typescript
 * const response = yield* download(storage, "reports/annual.pdf")
 * // Browser will prompt to save file as "annual.pdf"
 *
 * const response = yield* download(storage, "reports/q1.pdf", {
 *   filename: "Q1-Report-2024.pdf"
 * })
 * // Browser will prompt to save as "Q1-Report-2024.pdf"
 * ```
 */
export const download = (
  storage: StorageService,
  path: string,
  options?: DownloadOptions
): Effect.Effect<FileResponse, StorageError> =>
  Effect.gen(function* () {
    const contents = yield* storage.get(path)
    const info = yield* storage.getMetadata(path)
    const filename = options?.filename ?? basename(unsafeFilePath(path))

    const headers: Record<string, string> = {
      "Content-Type": info.mimeType ?? "application/octet-stream",
      "Content-Length": String(info.size),
      "Content-Disposition": `attachment; filename="${encodeFilename(filename)}"`,
      "Cache-Control": options?.cacheControl ?? "private, no-cache",
      ...options?.headers,
    }

    return {
      body: contents,
      status: 200,
      headers,
    }
  })

/**
 * Create a file streaming/viewing response
 *
 * Returns file with Content-Disposition: inline, allowing browser to display.
 *
 * @example
 * ```typescript
 * const response = yield* stream(storage, "images/photo.jpg")
 * // Browser will display image inline
 *
 * const response = yield* stream(storage, "documents/report.pdf", {
 *   disposition: "attachment",
 *   filename: "Report.pdf"
 * })
 * // Browser will download instead
 * ```
 */
export const stream = (
  storage: StorageService,
  path: string,
  options?: StreamOptions
): Effect.Effect<FileResponse, StorageError> =>
  Effect.gen(function* () {
    const contents = yield* storage.get(path)
    const info = yield* storage.getMetadata(path)
    const disposition = options?.disposition ?? "inline"
    const filename = options?.filename ?? basename(unsafeFilePath(path))

    const headers: Record<string, string> = {
      "Content-Type": info.mimeType ?? "application/octet-stream",
      "Content-Length": String(info.size),
      "Content-Disposition":
        disposition === "attachment"
          ? `attachment; filename="${encodeFilename(filename)}"`
          : `inline; filename="${encodeFilename(filename)}"`,
      "Cache-Control": options?.cacheControl ?? "public, max-age=31536000",
      ...options?.headers,
    }

    return {
      body: contents,
      status: 200,
      headers,
    }
  })

/**
 * Create a redirect response to a temporary signed URL
 *
 * Useful for serving private files without proxying through your server.
 *
 * @example
 * ```typescript
 * const response = yield* redirect(storage, "private/file.pdf", Duration.minutes(5))
 * // Returns 302 redirect to signed S3/GCS/Azure URL
 * ```
 */
export const redirect = (
  storage: StorageService,
  path: string,
  expiration: Duration.Duration
): Effect.Effect<{ status: 302; headers: { Location: string } }, StorageError> =>
  Effect.gen(function* () {
    const url = yield* storage.temporaryUrl(path, expiration)
    return {
      status: 302 as const,
      headers: {
        Location: url,
      },
    }
  })

/**
 * Get file info for conditional responses (ETag, Last-Modified)
 *
 * Useful for implementing cache validation with If-None-Match / If-Modified-Since.
 *
 * @example
 * ```typescript
 * const info = yield* fileInfo(storage, "images/logo.png")
 * // Check if client has cached version
 * if (requestETag === info.etag) {
 *   return { status: 304 } // Not Modified
 * }
 * ```
 */
export const fileInfo = (
  storage: StorageService,
  path: string
): Effect.Effect<
  {
    readonly size: number
    readonly mimeType: string | null
    readonly lastModified: Date
    readonly etag: string
  },
  StorageError
> =>
  Effect.gen(function* () {
    const info = yield* storage.getMetadata(path)
    // Generate weak ETag from size and modification time
    const etag = `W/"${info.size}-${info.lastModified.getTime()}"`

    return {
      size: info.size,
      mimeType: info.mimeType,
      lastModified: info.lastModified,
      etag,
    }
  })

/**
 * Check if file has been modified since the given date
 *
 * For implementing If-Modified-Since cache validation.
 */
export const isModifiedSince = (
  storage: StorageService,
  path: string,
  since: Date
): Effect.Effect<boolean, StorageError> =>
  Effect.gen(function* () {
    const modified = yield* storage.lastModified(path)
    return modified.getTime() > since.getTime()
  })

/**
 * Encode filename for Content-Disposition header
 * Handles special characters and non-ASCII
 */
const encodeFilename = (filename: string): string => {
  // RFC 5987 encoding for non-ASCII characters
  const hasNonAscii = /[^\x20-\x7E]/.test(filename)
  if (hasNonAscii) {
    return `utf-8''${encodeURIComponent(filename)}`
  }
  // Escape quotes
  return filename.replace(/"/g, '\\"')
}

/**
 * Build response headers for range requests (partial content)
 *
 * For implementing HTTP Range requests (e.g., video seeking).
 *
 * @example
 * ```typescript
 * const range = parseRangeHeader(request.headers.range, fileSize)
 * if (range) {
 *   const { start, end, headers } = range
 *   const partial = contents.slice(start, end + 1)
 *   return { status: 206, headers, body: partial }
 * }
 * ```
 */
export const parseRangeHeader = (
  rangeHeader: string | undefined,
  totalSize: number
): { start: number; end: number; headers: Record<string, string> } | null => {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
    return null
  }

  const [startStr, endStr] = rangeHeader.slice(6).split("-")
  const start = startStr ? parseInt(startStr, 10) : 0
  const end = endStr ? parseInt(endStr, 10) : totalSize - 1

  if (isNaN(start) || isNaN(end) || start > end || start >= totalSize) {
    return null
  }

  const clampedEnd = Math.min(end, totalSize - 1)
  const contentLength = clampedEnd - start + 1

  return {
    start,
    end: clampedEnd,
    headers: {
      "Content-Range": `bytes ${start}-${clampedEnd}/${totalSize}`,
      "Content-Length": String(contentLength),
      "Accept-Ranges": "bytes",
    },
  }
}
