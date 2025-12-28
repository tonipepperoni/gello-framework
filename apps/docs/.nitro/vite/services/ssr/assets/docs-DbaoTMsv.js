import { u as useRouterState, n as jsxRuntimeExports, O as Outlet } from "../server.js";
import { L as Link } from "./router-CRyDoK5j.js";
import "node:async_hooks";
import "node:stream";
import "stream";
import "util";
import "node:stream/web";
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "Directory Structure", href: "/docs/directory-structure" }
    ]
  },
  {
    title: "Core Concepts",
    items: [
      { title: "HTTP Server", href: "/docs/http" },
      { title: "Routing", href: "/docs/routing" },
      { title: "Middleware", href: "/docs/middleware" },
      { title: "Dependency Injection", href: "/docs/dependency-injection" },
      { title: "Validation", href: "/docs/validation" },
      { title: "Error Handling", href: "/docs/error-handling" }
    ]
  },
  {
    title: "Database",
    items: [
      { title: "Introduction", href: "/docs/database" },
      { title: "Drizzle ORM", href: "/docs/drizzle" },
      { title: "Migrations", href: "/docs/migrations" },
      { title: "Repositories", href: "/docs/repositories" }
    ]
  },
  {
    title: "Queues",
    items: [
      { title: "Introduction", href: "/docs/queues" },
      { title: "Creating Jobs", href: "/docs/jobs" },
      { title: "Workers", href: "/docs/workers" },
      { title: "Drivers", href: "/docs/queue-drivers" }
    ]
  },
  {
    title: "CLI",
    items: [
      { title: "Introduction", href: "/docs/cli" },
      { title: "Commands", href: "/docs/commands" }
    ]
  }
];
function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-64 shrink-0 border-r border-zinc-800 overflow-y-auto h-[calc(100vh-4rem)] sticky top-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-4 space-y-6", children: navigation.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2", children: section.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: section.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: item.href,
        className: clsx(
          "block px-3 py-2 text-sm rounded-lg transition-colors",
          currentPath === item.href ? "bg-violet-500/10 text-violet-400 font-medium" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
        ),
        children: item.title
      }
    ) }, item.href)) })
  ] }, section.title)) }) });
}
function DocsLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 min-w-0 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  DocsLayout as component
};
