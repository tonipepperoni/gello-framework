import { describe, it, expect, beforeEach } from "vitest"
import { Effect, pipe } from "effect"
import {
  Config,
  layer,
  get,
  string,
  number,
  boolean,
  schema,
  has,
  all,
  testLayer,
  withOverrides,
} from "./Config.js"
import { Port } from "./validators.js"
import { getPath, setPath, hasPath, deepMerge, flatten } from "./DotNotation.js"
import { detectEnvironment } from "./Environment.js"
import { parseEnvFile } from "./loaders/EnvLoader.js"

describe("Config", () => {
  describe("layer", () => {
    it("should create a Config layer from static data", async () => {
      const configLayer = layer({
        app: { name: "test-app", debug: true },
        database: { host: "localhost", port: 5432 },
      })

      const result = await Effect.runPromise(
        pipe(
          get<string>("app.name"),
          Effect.provide(configLayer)
        )
      )

      expect(result).toBe("test-app")
    })
  })

  describe("get", () => {
    const testConfig = layer({
      app: { name: "gello", version: "1.0.0" },
      server: { port: 3000 },
    })

    it("should get nested values with dot notation", async () => {
      const result = await Effect.runPromise(
        pipe(get<string>("app.name"), Effect.provide(testConfig))
      )
      expect(result).toBe("gello")
    })

    it("should return default value when key is missing", async () => {
      const result = await Effect.runPromise(
        pipe(get("missing.key", "default"), Effect.provide(testConfig))
      )
      expect(result).toBe("default")
    })

    it("should fail when key is missing and no default", async () => {
      const result = await Effect.runPromiseExit(
        pipe(get("missing.key"), Effect.provide(testConfig))
      )
      expect(result._tag).toBe("Failure")
    })
  })

  describe("string", () => {
    const testConfig = layer({
      name: "test",
      count: 42,
      enabled: true,
    })

    it("should return string values", async () => {
      const result = await Effect.runPromise(
        pipe(string("name"), Effect.provide(testConfig))
      )
      expect(result).toBe("test")
    })

    it("should coerce numbers to strings", async () => {
      const result = await Effect.runPromise(
        pipe(string("count"), Effect.provide(testConfig))
      )
      expect(result).toBe("42")
    })

    it("should coerce booleans to strings", async () => {
      const result = await Effect.runPromise(
        pipe(string("enabled"), Effect.provide(testConfig))
      )
      expect(result).toBe("true")
    })
  })

  describe("number", () => {
    const testConfig = layer({
      port: 3000,
      portStr: "5432",
      invalid: "not-a-number",
    })

    it("should return number values", async () => {
      const result = await Effect.runPromise(
        pipe(number("port"), Effect.provide(testConfig))
      )
      expect(result).toBe(3000)
    })

    it("should coerce string numbers", async () => {
      const result = await Effect.runPromise(
        pipe(number("portStr"), Effect.provide(testConfig))
      )
      expect(result).toBe(5432)
    })

    it("should fail for invalid numbers", async () => {
      const result = await Effect.runPromiseExit(
        pipe(number("invalid"), Effect.provide(testConfig))
      )
      expect(result._tag).toBe("Failure")
    })
  })

  describe("boolean", () => {
    const testConfig = layer({
      enabled: true,
      trueStr: "true",
      yesStr: "yes",
      oneStr: "1",
      falseStr: "false",
      noStr: "no",
      zeroStr: "0",
      numTrue: 1,
      numFalse: 0,
    })

    it("should return boolean values", async () => {
      const result = await Effect.runPromise(
        pipe(boolean("enabled"), Effect.provide(testConfig))
      )
      expect(result).toBe(true)
    })

    it("should coerce 'true' string", async () => {
      const result = await Effect.runPromise(
        pipe(boolean("trueStr"), Effect.provide(testConfig))
      )
      expect(result).toBe(true)
    })

    it("should coerce 'yes' string", async () => {
      const result = await Effect.runPromise(
        pipe(boolean("yesStr"), Effect.provide(testConfig))
      )
      expect(result).toBe(true)
    })

    it("should coerce '1' string", async () => {
      const result = await Effect.runPromise(
        pipe(boolean("oneStr"), Effect.provide(testConfig))
      )
      expect(result).toBe(true)
    })

    it("should coerce 'false' string", async () => {
      const result = await Effect.runPromise(
        pipe(boolean("falseStr"), Effect.provide(testConfig))
      )
      expect(result).toBe(false)
    })

    it("should coerce numbers to boolean", async () => {
      expect(
        await Effect.runPromise(pipe(boolean("numTrue"), Effect.provide(testConfig)))
      ).toBe(true)
      expect(
        await Effect.runPromise(pipe(boolean("numFalse"), Effect.provide(testConfig)))
      ).toBe(false)
    })
  })

  describe("schema", () => {
    const testConfig = layer({
      port: 3000,
      invalidPort: 70000,
    })

    it("should validate against a schema", async () => {
      const result = await Effect.runPromise(
        pipe(schema("port", Port), Effect.provide(testConfig))
      )
      expect(result).toBe(3000)
    })

    it("should fail for invalid schema values", async () => {
      const result = await Effect.runPromiseExit(
        pipe(schema("invalidPort", Port), Effect.provide(testConfig))
      )
      expect(result._tag).toBe("Failure")
    })
  })

  describe("has", () => {
    const testConfig = layer({
      exists: "value",
      nested: { key: "value" },
    })

    it("should return true for existing keys", async () => {
      const result = await Effect.runPromise(
        pipe(has("exists"), Effect.provide(testConfig))
      )
      expect(result).toBe(true)
    })

    it("should return true for nested keys", async () => {
      const result = await Effect.runPromise(
        pipe(has("nested.key"), Effect.provide(testConfig))
      )
      expect(result).toBe(true)
    })

    it("should return false for missing keys", async () => {
      const result = await Effect.runPromise(
        pipe(has("missing"), Effect.provide(testConfig))
      )
      expect(result).toBe(false)
    })
  })

  describe("all", () => {
    const configData = {
      app: { name: "test" },
      server: { port: 3000 },
    }
    const testConfig = layer(configData)

    it("should return all config data", async () => {
      const result = await Effect.runPromise(
        pipe(all(), Effect.provide(testConfig))
      )
      expect(result).toEqual(configData)
    })
  })

  describe("testLayer", () => {
    it("should create a test layer with overrides", async () => {
      const result = await Effect.runPromise(
        pipe(
          get<string>("test.value"),
          Effect.provide(testLayer({ test: { value: "override" } }))
        )
      )
      expect(result).toBe("override")
    })
  })

  describe("withOverrides", () => {
    it("should run an effect with config overrides", async () => {
      const result = await Effect.runPromise(
        withOverrides({ key: "value" }, get<string>("key"))
      )
      expect(result).toBe("value")
    })
  })
})

describe("DotNotation", () => {
  describe("getPath", () => {
    const obj = {
      a: { b: { c: 1 } },
      arr: [1, 2, 3],
    }

    it("should get nested values", () => {
      const result = getPath(obj, "a.b.c")
      expect(result._tag).toBe("Some")
      if (result._tag === "Some") {
        expect(result.value).toBe(1)
      }
    })

    it("should return None for missing paths", () => {
      const result = getPath(obj, "a.b.missing")
      expect(result._tag).toBe("None")
    })

    it("should handle array access", () => {
      const result = getPath(obj, "arr.1")
      expect(result._tag).toBe("Some")
      if (result._tag === "Some") {
        expect(result.value).toBe(2)
      }
    })
  })

  describe("setPath", () => {
    it("should set nested values", () => {
      const obj = { a: { b: 1 } }
      const result = setPath(obj, "a.c", 2)
      expect(result).toEqual({ a: { b: 1, c: 2 } })
    })

    it("should create intermediate objects", () => {
      const obj = {}
      const result = setPath(obj, "a.b.c", 1)
      expect(result).toEqual({ a: { b: { c: 1 } } })
    })
  })

  describe("hasPath", () => {
    it("should return true for existing paths", () => {
      expect(hasPath({ a: { b: 1 } }, "a.b")).toBe(true)
    })

    it("should return false for missing paths", () => {
      expect(hasPath({ a: { b: 1 } }, "a.c")).toBe(false)
    })
  })

  describe("deepMerge", () => {
    it("should merge objects deeply", () => {
      const base = { a: { b: 1, c: 2 } }
      const override = { a: { c: 3, d: 4 } }
      const result = deepMerge(base, override)
      expect(result).toEqual({ a: { b: 1, c: 3, d: 4 } })
    })

    it("should handle arrays by replacing", () => {
      const base = { arr: [1, 2] }
      const override = { arr: [3, 4, 5] }
      const result = deepMerge(base, override)
      expect(result).toEqual({ arr: [3, 4, 5] })
    })
  })

  describe("flatten", () => {
    it("should flatten nested objects", () => {
      const obj = { a: { b: { c: 1 } }, d: 2 }
      const result = flatten(obj)
      expect(result).toEqual({ "a.b.c": 1, d: 2 })
    })
  })
})

describe("Environment", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env["GELLO_ENV"]
    delete process.env["APP_ENV"]
    delete process.env["NODE_ENV"]
  })

  it("should detect local environment by default", () => {
    expect(detectEnvironment()).toBe("local")
  })

  it("should detect environment from GELLO_ENV", () => {
    process.env["GELLO_ENV"] = "production"
    expect(detectEnvironment()).toBe("production")
  })

  it("should detect environment from APP_ENV", () => {
    process.env["APP_ENV"] = "staging"
    expect(detectEnvironment()).toBe("staging")
  })

  it("should detect environment from NODE_ENV", () => {
    process.env["NODE_ENV"] = "test"
    expect(detectEnvironment()).toBe("testing")
  })

  it("should handle aliases", () => {
    process.env["NODE_ENV"] = "dev"
    expect(detectEnvironment()).toBe("development")

    process.env["NODE_ENV"] = "prod"
    expect(detectEnvironment()).toBe("production")
  })
})

describe("parseEnvFile", () => {
  it("should parse simple key-value pairs", () => {
    const content = `
KEY1=value1
KEY2=value2
`
    const result = parseEnvFile(content)
    expect(result).toEqual({ KEY1: "value1", KEY2: "value2" })
  })

  it("should skip comments and empty lines", () => {
    const content = `
# This is a comment
KEY=value

# Another comment
`
    const result = parseEnvFile(content)
    expect(result).toEqual({ KEY: "value" })
  })

  it("should handle quoted values", () => {
    const content = `
DOUBLE="hello world"
SINGLE='single quoted'
`
    const result = parseEnvFile(content)
    expect(result).toEqual({
      DOUBLE: "hello world",
      SINGLE: "single quoted",
    })
  })

  it("should handle escape sequences", () => {
    const content = `KEY="line1\\nline2"`
    const result = parseEnvFile(content)
    expect(result.KEY).toBe("line1\nline2")
  })

  it("should handle values with equals signs", () => {
    const content = `URL=http://example.com?foo=bar`
    const result = parseEnvFile(content)
    expect(result.URL).toBe("http://example.com?foo=bar")
  })
})
