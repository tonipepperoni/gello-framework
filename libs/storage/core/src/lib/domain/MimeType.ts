/**
 * MimeType - MIME type detection utilities
 *
 * @module @gello/storage/domain
 */

import type { FilePath } from "./FilePath.js"
import { extension } from "./FilePath.js"

/**
 * MIME type mapping by file extension
 */
const MIME_TYPES: Record<string, string> = {
  // Images
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  bmp: "image/bmp",
  tiff: "image/tiff",
  tif: "image/tiff",
  avif: "image/avif",

  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odp: "application/vnd.oasis.opendocument.presentation",

  // Text
  txt: "text/plain",
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  ts: "text/typescript",
  tsx: "text/typescript-jsx",
  jsx: "text/jsx",
  json: "application/json",
  xml: "application/xml",
  csv: "text/csv",
  md: "text/markdown",
  markdown: "text/markdown",
  yaml: "text/yaml",
  yml: "text/yaml",
  toml: "text/toml",

  // Archives
  zip: "application/zip",
  tar: "application/x-tar",
  gz: "application/gzip",
  gzip: "application/gzip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  bz2: "application/x-bzip2",

  // Media - Audio
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  m4a: "audio/mp4",
  wma: "audio/x-ms-wma",

  // Media - Video
  mp4: "video/mp4",
  webm: "video/webm",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  wmv: "video/x-ms-wmv",
  mkv: "video/x-matroska",
  flv: "video/x-flv",
  m4v: "video/x-m4v",

  // Fonts
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",

  // Data
  sql: "application/sql",
  sqlite: "application/x-sqlite3",
  db: "application/x-sqlite3",

  // Code
  sh: "application/x-sh",
  bash: "application/x-sh",
  zsh: "application/x-sh",
  py: "text/x-python",
  rb: "text/x-ruby",
  php: "text/x-php",
  java: "text/x-java-source",
  c: "text/x-c",
  cpp: "text/x-c++",
  h: "text/x-c",
  hpp: "text/x-c++",
  go: "text/x-go",
  rs: "text/x-rust",
  swift: "text/x-swift",
  kt: "text/x-kotlin",
  scala: "text/x-scala",

  // Other
  wasm: "application/wasm",
  map: "application/json",
}

/**
 * Guess MIME type from file path based on extension
 */
export const guessMimeType = (path: FilePath): string | null => {
  const ext = extension(path).toLowerCase()
  return MIME_TYPES[ext] ?? null
}

/**
 * Get MIME type from extension string
 */
export const getMimeType = (ext: string): string | null => {
  const normalized = ext.toLowerCase().replace(/^\./, "")
  return MIME_TYPES[normalized] ?? null
}

/**
 * Check if MIME type is an image
 */
export const isImage = (mimeType: string | null): boolean =>
  mimeType?.startsWith("image/") ?? false

/**
 * Check if MIME type is a video
 */
export const isVideo = (mimeType: string | null): boolean =>
  mimeType?.startsWith("video/") ?? false

/**
 * Check if MIME type is audio
 */
export const isAudio = (mimeType: string | null): boolean =>
  mimeType?.startsWith("audio/") ?? false

/**
 * Check if MIME type is text-based
 */
export const isText = (mimeType: string | null): boolean =>
  mimeType?.startsWith("text/") ?? false

/**
 * Check if MIME type is a document
 */
export const isDocument = (mimeType: string | null): boolean => {
  if (!mimeType) return false
  return (
    mimeType === "application/pdf" ||
    mimeType.includes("document") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation") ||
    mimeType.includes("msword") ||
    mimeType.includes("ms-excel") ||
    mimeType.includes("ms-powerpoint")
  )
}

/**
 * Check if MIME type is an archive
 */
export const isArchive = (mimeType: string | null): boolean => {
  if (!mimeType) return false
  return (
    mimeType === "application/zip" ||
    mimeType === "application/gzip" ||
    mimeType === "application/x-tar" ||
    mimeType === "application/x-rar-compressed" ||
    mimeType === "application/x-7z-compressed" ||
    mimeType === "application/x-bzip2"
  )
}

/**
 * Default MIME type for unknown files
 */
export const DEFAULT_MIME_TYPE = "application/octet-stream"
