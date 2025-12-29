/**
 * Path pattern parsing and matching
 */

// ─── Path Segment Types ───────────────────────────────────────
export type PathSegment =
  | { readonly _tag: "Literal"; readonly value: string }
  | { readonly _tag: "Param"; readonly name: string }
  | { readonly _tag: "Wildcard" };

// ─── Path Pattern ─────────────────────────────────────────────
export interface PathPattern {
  readonly original: string;
  readonly segments: readonly PathSegment[];
  readonly regex: RegExp;
  readonly paramNames: readonly string[];
}

/**
 * Escape special regex characters
 */
const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Parse a path pattern into segments and create a matching regex
 *
 * Examples:
 * - "/users" -> literal match
 * - "/users/:id" -> captures id parameter
 * - "/files/*" -> wildcard match
 */
export const parsePath = (path: string): PathPattern => {
  const segments: PathSegment[] = [];
  const paramNames: string[] = [];
  let regexStr = "^";

  // Normalize path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const parts = normalizedPath.split("/").filter(Boolean);

  for (const part of parts) {
    if (part.startsWith(":")) {
      // Parameter segment
      const name = part.slice(1);
      segments.push({ _tag: "Param", name });
      paramNames.push(name);
      regexStr += "/([^/]+)";
    } else if (part === "*") {
      // Wildcard segment
      segments.push({ _tag: "Wildcard" });
      regexStr += "/(.*)";
    } else {
      // Literal segment
      segments.push({ _tag: "Literal", value: part });
      regexStr += `/${escapeRegex(part)}`;
    }
  }

  // Allow optional trailing slash
  regexStr += "/?$";

  return {
    original: normalizedPath,
    segments,
    regex: new RegExp(regexStr, "i"),
    paramNames,
  };
};

/**
 * Test if a path matches a pattern
 */
export const matchPath = (
  pattern: PathPattern,
  path: string
): { matches: boolean; params: Record<string, string> } => {
  const match = pattern.regex.exec(path);

  if (!match) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};
  pattern.paramNames.forEach((name, index) => {
    params[name] = decodeURIComponent(match[index + 1]);
  });

  return { matches: true, params };
};

/**
 * Extract the path from a URL
 */
export const extractPath = (url: string): string => {
  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.pathname;
  } catch {
    // If URL parsing fails, try to extract path manually
    const queryIndex = url.indexOf("?");
    const hashIndex = url.indexOf("#");
    let end = url.length;
    if (queryIndex !== -1) end = Math.min(end, queryIndex);
    if (hashIndex !== -1) end = Math.min(end, hashIndex);
    return url.slice(0, end);
  }
};
