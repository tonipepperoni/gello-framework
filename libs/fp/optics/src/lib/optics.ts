/**
 * Optics Library
 *
 * Provides Lens and Prism types for immutable data manipulation.
 * Inspired by monocle-ts and Scala Monocle.
 */
import { Option, pipe } from 'effect';

// =============================================================================
// Lens - for accessing/modifying nested properties
// =============================================================================

/**
 * A Lens focuses on a property of a structure.
 * Get: S -> A (always succeeds)
 * Set: (A, S) -> S (replaces the focused value)
 */
export interface Lens<S, A> {
  readonly get: (s: S) => A;
  readonly set: (a: A) => (s: S) => S;
}

/**
 * Create a lens from get and set functions
 */
export const lens = <S, A>(
  get: (s: S) => A,
  set: (a: A) => (s: S) => S
): Lens<S, A> => ({ get, set });

/**
 * Create a lens for a property
 */
export const prop = <S, K extends keyof S>(key: K): Lens<S, S[K]> => ({
  get: (s) => s[key],
  set: (a) => (s) => ({ ...s, [key]: a }),
});

/**
 * Modify the focused value using a function
 */
export const modify = <S, A>(l: Lens<S, A>, f: (a: A) => A) => (s: S): S =>
  l.set(f(l.get(s)))(s);

/**
 * Compose two lenses (left to right)
 */
export const composeLens = <S, A, B>(
  outer: Lens<S, A>,
  inner: Lens<A, B>
): Lens<S, B> => ({
  get: (s) => inner.get(outer.get(s)),
  set: (b) => (s) => outer.set(inner.set(b)(outer.get(s)))(s),
});

/**
 * Identity lens - focuses on the whole structure
 */
export const identity = <S>(): Lens<S, S> => ({
  get: (s) => s,
  set: (a) => () => a,
});

// =============================================================================
// Optional - for accessing values that might not exist
// =============================================================================

/**
 * An Optional focuses on a value that might not exist.
 * GetOption: S -> Option<A>
 * Set: (A, S) -> S
 */
export interface Optional<S, A> {
  readonly getOption: (s: S) => Option.Option<A>;
  readonly set: (a: A) => (s: S) => S;
}

/**
 * Create an optional from getOption and set functions
 */
export const optional = <S, A>(
  getOption: (s: S) => Option.Option<A>,
  set: (a: A) => (s: S) => S
): Optional<S, A> => ({ getOption, set });

/**
 * Create an optional for an index in an array
 */
export const index = <A>(i: number): Optional<readonly A[], A> => ({
  getOption: (arr) => (i >= 0 && i < arr.length ? Option.some(arr[i]) : Option.none()),
  set: (a) => (arr) =>
    i >= 0 && i < arr.length
      ? [...arr.slice(0, i), a, ...arr.slice(i + 1)]
      : arr,
});

/**
 * Create an optional for a key in a record
 */
export const key = <A>(k: string): Optional<Readonly<Record<string, A>>, A> => ({
  getOption: (record) =>
    k in record ? Option.some(record[k]) : Option.none(),
  set: (a) => (record) => ({ ...record, [k]: a }),
});

/**
 * Modify the focused value if it exists
 */
export const modifyOption = <S, A>(
  o: Optional<S, A>,
  f: (a: A) => A
) => (s: S): S =>
  pipe(
    o.getOption(s),
    Option.map((a) => o.set(f(a))(s)),
    Option.getOrElse(() => s)
  );

/**
 * Compose two optionals
 */
export const composeOptional = <S, A, B>(
  outer: Optional<S, A>,
  inner: Optional<A, B>
): Optional<S, B> => ({
  getOption: (s) =>
    pipe(
      outer.getOption(s),
      Option.flatMap(inner.getOption)
    ),
  set: (b) => (s) =>
    pipe(
      outer.getOption(s),
      Option.map((a) => outer.set(inner.set(b)(a))(s)),
      Option.getOrElse(() => s)
    ),
});

/**
 * Convert a lens to an optional
 */
export const lensToOptional = <S, A>(l: Lens<S, A>): Optional<S, A> => ({
  getOption: (s) => Option.some(l.get(s)),
  set: l.set,
});

/**
 * Compose a lens with an optional
 */
export const composeLensOptional = <S, A, B>(
  l: Lens<S, A>,
  o: Optional<A, B>
): Optional<S, B> => composeOptional(lensToOptional(l), o);

// =============================================================================
// Prism - for values that might be of a specific type
// =============================================================================

/**
 * A Prism focuses on a subset of values.
 * GetOption: S -> Option<A> (might not match)
 * ReverseGet: A -> S (always succeeds)
 */
export interface Prism<S, A> {
  readonly getOption: (s: S) => Option.Option<A>;
  readonly reverseGet: (a: A) => S;
}

/**
 * Create a prism from getOption and reverseGet functions
 */
export const prism = <S, A>(
  getOption: (s: S) => Option.Option<A>,
  reverseGet: (a: A) => S
): Prism<S, A> => ({ getOption, reverseGet });

/**
 * Create a prism for filtering by a predicate
 */
export const filter = <A>(predicate: (a: A) => boolean): Prism<A, A> => ({
  getOption: (a) => (predicate(a) ? Option.some(a) : Option.none()),
  reverseGet: (a) => a,
});

/**
 * Create a prism for a discriminated union variant
 */
export const variant = <S extends { _tag: string }, A extends S>(
  tag: A['_tag']
): Prism<S, A> => ({
  getOption: (s) => (s._tag === tag ? Option.some(s as A) : Option.none()),
  reverseGet: (a) => a,
});

/**
 * Modify through a prism if the value matches
 */
export const modifyPrism = <S, A>(
  p: Prism<S, A>,
  f: (a: A) => A
) => (s: S): S =>
  pipe(
    p.getOption(s),
    Option.map((a) => p.reverseGet(f(a))),
    Option.getOrElse(() => s)
  );

/**
 * Compose two prisms
 */
export const composePrism = <S, A, B>(
  outer: Prism<S, A>,
  inner: Prism<A, B>
): Prism<S, B> => ({
  getOption: (s) =>
    pipe(
      outer.getOption(s),
      Option.flatMap(inner.getOption)
    ),
  reverseGet: (b) => outer.reverseGet(inner.reverseGet(b)),
});

/**
 * Convert a prism to an optional
 */
export const prismToOptional = <S, A>(p: Prism<S, A>): Optional<S, A> => ({
  getOption: p.getOption,
  set: (a) => (s) =>
    pipe(
      p.getOption(s),
      Option.map(() => p.reverseGet(a)),
      Option.getOrElse(() => s)
    ),
});

// =============================================================================
// Iso - for isomorphic types
// =============================================================================

/**
 * An Iso represents an isomorphism between two types.
 * Get: S -> A
 * ReverseGet: A -> S
 */
export interface Iso<S, A> {
  readonly get: (s: S) => A;
  readonly reverseGet: (a: A) => S;
}

/**
 * Create an iso from get and reverseGet functions
 */
export const iso = <S, A>(
  get: (s: S) => A,
  reverseGet: (a: A) => S
): Iso<S, A> => ({ get, reverseGet });

/**
 * Compose two isos
 */
export const composeIso = <S, A, B>(
  outer: Iso<S, A>,
  inner: Iso<A, B>
): Iso<S, B> => ({
  get: (s) => inner.get(outer.get(s)),
  reverseGet: (b) => outer.reverseGet(inner.reverseGet(b)),
});

/**
 * Reverse an iso
 */
export const reverseIso = <S, A>(i: Iso<S, A>): Iso<A, S> => ({
  get: i.reverseGet,
  reverseGet: i.get,
});

/**
 * Convert an iso to a lens
 */
export const isoToLens = <S, A>(i: Iso<S, A>): Lens<S, A> => ({
  get: i.get,
  set: (a) => () => i.reverseGet(a),
});

/**
 * Convert an iso to a prism
 */
export const isoToPrism = <S, A>(i: Iso<S, A>): Prism<S, A> => ({
  getOption: (s) => Option.some(i.get(s)),
  reverseGet: i.reverseGet,
});

// =============================================================================
// Traversal - for accessing multiple values
// =============================================================================

/**
 * A Traversal focuses on multiple values within a structure.
 */
export interface Traversal<S, A> {
  readonly getAll: (s: S) => readonly A[];
  readonly modifyAll: (f: (a: A) => A) => (s: S) => S;
}

/**
 * Create a traversal for all elements of an array
 */
export const each = <A>(): Traversal<readonly A[], A> => ({
  getAll: (arr) => arr,
  modifyAll: (f) => (arr) => arr.map(f),
});

/**
 * Create a traversal that filters by a predicate
 */
export const filtered = <A>(predicate: (a: A) => boolean): Traversal<readonly A[], A> => ({
  getAll: (arr) => arr.filter(predicate),
  modifyAll: (f) => (arr) => arr.map((a) => (predicate(a) ? f(a) : a)),
});

/**
 * Compose lens with traversal
 */
export const composeLensTraversal = <S, A, B>(
  l: Lens<S, readonly A[]>,
  t: Traversal<readonly A[], B>
): Traversal<S, B> => ({
  getAll: (s) => t.getAll(l.get(s)),
  modifyAll: (f) => (s) => l.set(t.modifyAll(f)(l.get(s)))(s),
});

// =============================================================================
// Common optics for records
// =============================================================================

/**
 * Create a lens for a nested path
 */
export const path = <S, K1 extends keyof S>(k1: K1): Lens<S, S[K1]> => prop(k1);

/**
 * Create a lens for a 2-level nested path
 */
export const path2 = <S, K1 extends keyof S, K2 extends keyof S[K1]>(
  k1: K1,
  k2: K2
): Lens<S, S[K1][K2]> => composeLens(prop(k1), prop(k2));

/**
 * Create a lens for a 3-level nested path
 */
export const path3 = <
  S,
  K1 extends keyof S,
  K2 extends keyof S[K1],
  K3 extends keyof S[K1][K2]
>(
  k1: K1,
  k2: K2,
  k3: K3
): Lens<S, S[K1][K2][K3]> => composeLens(composeLens(prop(k1), prop(k2)), prop(k3));

// =============================================================================
// Fluent API
// =============================================================================

/**
 * Fluent lens builder for easier chaining
 */
export const focus = <S>(): LensFluent<S, S> => ({
  lens: identity(),
  at: <K extends keyof S>(key: K) => {
    const newLens = composeLens(identity<S>(), prop(key));
    return createLensFluent(newLens);
  },
  get: (s: S) => s,
  set: (a: S) => () => a,
  modify: (f: (a: S) => S) => (s: S) => f(s),
});

interface LensFluent<S, A> {
  readonly lens: Lens<S, A>;
  readonly at: <K extends keyof A>(key: K) => LensFluent<S, A[K]>;
  readonly get: (s: S) => A;
  readonly set: (a: A) => (s: S) => S;
  readonly modify: (f: (a: A) => A) => (s: S) => S;
}

const createLensFluent = <S, A>(l: Lens<S, A>): LensFluent<S, A> => ({
  lens: l,
  at: <K extends keyof A>(key: K) => {
    const newLens = composeLens(l, prop(key));
    return createLensFluent(newLens);
  },
  get: l.get,
  set: l.set,
  modify: (f) => (s) => l.set(f(l.get(s)))(s),
});
