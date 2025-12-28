import { n as jsxRuntimeExports } from "../server.js";
import { L as Link } from "./router-_Z8es15s.js";
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
      "A sophisticated TypeScript backend framework powered by",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Effect" }),
      ". Express-like HTTP, Laravel-like DI, type-safe everything."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-4 mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/docs", className: "inline-flex items-center justify-center rounded-lg bg-violet-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500", children: "Get Started" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/gello/gello", className: "inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800", target: "_blank", rel: "noopener noreferrer", children: "GitHub" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-3 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Effect-Powered", description: "Built on Effect for type-safe error handling, dependency injection, and composable architecture.", icon: "⚡" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Laravel-like DX", description: "Familiar patterns like service providers, migrations, queues, and Artisan-like CLI tools.", icon: "🎯" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Type-Safe Database", description: "Drizzle ORM integration with Effect for fully type-safe database operations.", icon: "🗄️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Powerful Queues", description: "Background job processing with retry logic, failure handling, and multiple drivers.", icon: "📬" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "Express-like HTTP", description: "Intuitive routing API that feels like Express but with full type safety.", icon: "🌐" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { title: "CLI Tooling", description: "Generate models, migrations, jobs, and more with the Gello CLI.", icon: "⌨️" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 rounded-xl bg-zinc-900 border border-zinc-800 p-8 max-w-3xl w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-lg font-semibold text-white", children: "Quick Start" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto rounded-lg bg-zinc-950 p-4 text-left text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-zinc-300", children: `npm create gello@latest my-app
cd my-app
npm run dev` }) })
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
