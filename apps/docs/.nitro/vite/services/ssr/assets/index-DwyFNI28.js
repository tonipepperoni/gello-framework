import { n as jsxRuntimeExports } from "../server.js";
import { L as Link } from "./router-CRyDoK5j.js";
import "node:async_hooks";
import "node:stream";
import "stream";
import "util";
import "node:stream/web";
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-1 flex-col items-center justify-center px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.svg", alt: "Gello", className: "w-32 h-32 mx-auto" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-4 text-5xl font-bold tracking-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent", children: "Gello" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-8 max-w-2xl text-xl text-zinc-400", children: [
      "FP-core backend framework built on",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Effect" }),
      ". Non-modular, purely functional — program = value, interpret at the edge."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-4 mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/docs", className: "inline-flex items-center justify-center rounded-lg bg-violet-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500", children: "Get Started" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/tonipepperoni/gello-framework", className: "inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800", target: "_blank", rel: "noopener noreferrer", children: "GitHub" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-3 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Context.Tag + Layer", description: "No DI container, no decorators. Just compose Layers for dependencies and yield* from context.", icon: "⚡" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Scoped Resources", description: "Database pools, Redis connections — all managed with Layer.scoped and acquireRelease.", icon: "🔒" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "@effect/platform HTTP", description: "Type-safe routing with HttpRouter, schema validation at boundaries, proper middleware.", icon: "🌐" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Single Composition Point", description: "All layers merge at one root, then Layer.launch. No scattered configuration.", icon: "🎯" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Drizzle + Effect", description: "Type-safe database with proper resource lifecycle. Pool created, used, closed.", icon: "🗄️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "BullMQ Queues", description: "Jobs as values, workers as Layers. Effect manages the lifecycle, BullMQ does the work.", icon: "📬" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 rounded-xl bg-zinc-900 border border-zinc-800 p-8 max-w-3xl w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-lg font-semibold text-white", children: "Quick Start" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto rounded-lg bg-zinc-950 p-4 text-left text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-zinc-300", children: `pnpm add effect @effect/schema @effect/platform @effect/platform-node` }) })
    ] })
  ] });
}
function FeatureCard({
  title,
  description,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-left transition-colors hover:border-violet-500/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-3xl", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-lg font-semibold text-white", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400", children: description })
  ] });
}
export {
  HomePage as component
};
