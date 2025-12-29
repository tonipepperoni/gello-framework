import { n as jsxRuntimeExports } from "../server.js";
import { L as Link } from "./router-BgLrGqx4.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-1 flex-col items-center justify-center px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-gruvbox-orange text-xs sm:text-sm font-mono leading-none", children: ` ██████╗ ███████╗██╗     ██╗      ██████╗
██╔════╝ ██╔════╝██║     ██║     ██╔═══██╗
██║  ███╗█████╗  ██║     ██║     ██║   ██║
██║   ██║██╔══╝  ██║     ██║     ██║   ██║
╚██████╔╝███████╗███████╗███████╗╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-8 max-w-2xl text-xl text-gruvbox-fg-4", children: [
      "A TypeScript backend framework built on",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gruvbox-fg", children: "Effect" }),
      ", inspired by",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gruvbox-fg", children: "Laravel" }),
      ",",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gruvbox-fg", children: "Rails" }),
      ", and",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gruvbox-fg", children: "NestJS" }),
      ". Functional, type-safe, composable."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-4 mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/docs", className: "inline-flex items-center justify-center rounded-lg bg-gruvbox-orange px-8 py-3 text-sm font-medium text-gruvbox-bg-hard transition-colors hover:bg-gruvbox-yellow", children: "Get Started" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/tonipepperoni/gello-framework", className: "inline-flex items-center justify-center rounded-lg border border-gruvbox-bg-3 bg-gruvbox-bg-1 px-8 py-3 text-sm font-medium text-gruvbox-fg transition-colors hover:bg-gruvbox-bg-2 hover:border-gruvbox-bg-4", target: "_blank", rel: "noopener noreferrer", children: "GitHub" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-3 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Context.Tag + Layer", description: "No DI container, no decorators. Just compose Layers for dependencies and yield* from context.", color: "green" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Scoped Resources", description: "Database pools, Redis connections — all managed with Layer.scoped and acquireRelease.", color: "blue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "@effect/platform HTTP", description: "Type-safe routing with HttpRouter, schema validation at boundaries, proper middleware.", color: "aqua" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Single Composition Point", description: "All layers merge at one root, then Layer.launch. No scattered configuration.", color: "yellow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Drizzle + Effect", description: "Type-safe database with proper resource lifecycle. Pool created, used, closed.", color: "purple" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Effect Queues", description: "Jobs as values, workers as Layers. Pure Effect — no external queue dependency.", color: "orange" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 rounded-xl bg-gruvbox-bg-1 border border-gruvbox-bg-2 p-8 max-w-3xl w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-lg font-semibold text-gruvbox-fg", children: "Quick Start" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto rounded-lg bg-gruvbox-bg-hard p-4 text-left text-sm border border-gruvbox-bg-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-gruvbox-fg-2", children: `pnpm add effect @effect/schema @effect/platform @effect/platform-node` }) })
    ] })
  ] });
}
const colorClasses = {
  green: {
    border: "hover:border-gruvbox-green/50",
    text: "text-gruvbox-green"
  },
  blue: {
    border: "hover:border-gruvbox-blue/50",
    text: "text-gruvbox-blue"
  },
  aqua: {
    border: "hover:border-gruvbox-aqua/50",
    text: "text-gruvbox-aqua"
  },
  yellow: {
    border: "hover:border-gruvbox-yellow/50",
    text: "text-gruvbox-yellow"
  },
  purple: {
    border: "hover:border-gruvbox-purple/50",
    text: "text-gruvbox-purple"
  },
  orange: {
    border: "hover:border-gruvbox-orange/50",
    text: "text-gruvbox-orange"
  }
};
function FeatureCard({
  title,
  description,
  color
}) {
  const colors = colorClasses[color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border border-gruvbox-bg-2 bg-gruvbox-bg-1 p-6 text-left transition-colors ${colors.border}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `mb-2 text-lg font-semibold ${colors.text}`, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gruvbox-fg-4", children: description })
  ] });
}
export {
  HomePage as component
};
