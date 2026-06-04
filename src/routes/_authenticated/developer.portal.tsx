import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/developer/portal")({
  component: DeveloperPortalPage,
});

const SECTIONS = [
  {
    title: "Platform APIs",
    description: "RESTful endpoints for investigations, narratives, sources, and events.",
    items: [
      { method: "GET",  path: "/v2/investigations",           desc: "List investigations (paginated)" },
      { method: "POST", path: "/v2/investigations",           desc: "Create a new investigation" },
      { method: "GET",  path: "/v2/narratives",               desc: "List narrative clusters" },
      { method: "GET",  path: "/v2/sources",                  desc: "List intelligence sources" },
      { method: "GET",  path: "/v2/platform/events",          desc: "Browse the event catalog" },
      { method: "POST", path: "/v2/platform/events/subscribe",desc: "Subscribe to an event type" },
      { method: "GET",  path: "/v2/platform/data-products",   desc: "List data products" },
      { method: "GET",  path: "/health",                      desc: "Platform liveness probe" },
    ],
  },
  {
    title: "SDKs",
    description: "Official client libraries for building on the VERITAS platform.",
    items: [
      { method: "PY",   path: "pip install veritas-sdk",              desc: "Python SDK (v0.1.0)" },
      { method: "TS",   path: "npm install @veritas/sdk",             desc: "TypeScript SDK (v0.1.0)" },
    ],
  },
];

const PLUGINS = [
  { id: "com.veritas.narrative-bert-v2",   type: "NarrativeDetector", version: "2.1.0", status: "Active" },
  { id: "com.veritas.rss-connector",       type: "SourceConnector",   version: "1.4.2", status: "Active" },
  { id: "com.veritas.pdf-report-gen",      type: "ReportGenerator",   version: "1.0.0", status: "Active" },
  { id: "com.acme.custom-analytics",       type: "AnalyticsEngine",   version: "0.9.1", status: "Beta" },
];

const DATA_PRODUCTS = [
  { name: "Source Intelligence",  owner: "SourceIntelService",      records: "4,200",  quality: "92.4%", freshness: "0.5h" },
  { name: "Narrative Dataset",    owner: "NarrativeService",        records: "891",    quality: "94.1%", freshness: "0.2h" },
  { name: "Topic Intelligence",   owner: "TopicService",            records: "312",    quality: "89.7%", freshness: "1.0h" },
  { name: "Investigation Dataset",owner: "InvestigationService",    records: "1,540",  quality: "96.3%", freshness: "0.1h" },
  { name: "Entity Graph",         owner: "EntityService",           records: "18,400", quality: "87.2%", freshness: "0.3h" },
];

function DeveloperPortalPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 bg-secondary/5 gap-8">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-lg font-medium">Developer Portal</h1>
        <p className="text-muted-foreground mt-1">API documentation, SDKs, plugins, and data products for the VERITAS Intelligence OS.</p>
      </div>

      {/* API Reference */}
      {SECTIONS.map((section) => (
        <div key={section.title} className="border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium">{section.title}</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{section.description}</p>
          </div>
          <div className="divide-y divide-border">
            {section.items.map((item) => (
              <div key={item.path} className="flex items-center gap-4 px-4 py-2.5 hover:bg-secondary/30 transition-colors">
                <span className={`font-mono text-[10px] font-bold uppercase tracking-widest w-12 shrink-0 ${
                  item.method === "GET" ? "text-[color:var(--color-ok)]" :
                  item.method === "POST" ? "text-accent" :
                  "text-muted-foreground"
                }`}>{item.method}</span>
                <span className="font-mono text-[11px] flex-1">{item.path}</span>
                <span className="text-[11px] text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Plugin Registry */}
      <div className="border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium">Plugin Registry</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Installed platform extensions. Plugins extend core capabilities without modifying services.</p>
        </div>
        <div className="divide-y divide-border">
          {PLUGINS.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-4 py-2.5">
              <span className="font-mono text-[10px] text-muted-foreground flex-1">{p.id}</span>
              <span className="text-[11px] uppercase tracking-widest w-32">{p.type}</span>
              <span className="font-mono text-[10px] w-16">{p.version}</span>
              <span className={`px-1.5 py-0.5 border rounded-sm text-[9px] uppercase tracking-widest ${
                p.status === "Active" ? "border-[color:var(--color-ok)] text-[color:var(--color-ok)]" : "border-[color:var(--color-warn)] text-[color:var(--color-warn)]"
              }`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Products */}
      <div className="border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium">Data Products</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Platform datasets treated as first-class products with ownership, quality, and lineage.</p>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Records</th>
              <th className="px-4 py-2">Quality</th>
              <th className="px-4 py-2">Freshness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DATA_PRODUCTS.map((d) => (
              <tr key={d.name} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-2.5 font-medium">{d.name}</td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{d.owner}</td>
                <td className="px-4 py-2.5 font-mono">{d.records}</td>
                <td className="px-4 py-2.5 font-mono text-[color:var(--color-ok)]">{d.quality}</td>
                <td className="px-4 py-2.5 font-mono">{d.freshness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
