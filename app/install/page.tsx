export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] p-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white border border-black/10 p-8">
        <h1 className="text-3xl font-semibold">Install OopsMCP</h1>
        <p className="mt-3 text-black/60">OopsMCP is a web-installable personal MCP server. Deploy it once to Vercel, then use the same MCP endpoint from compatible AI clients.</p>
        <div className="mt-6 space-y-3 text-sm"><div><b>Web app:</b> <code>/</code></div><div><b>MCP endpoint:</b> <code>/mcp</code></div><div><b>Setup:</b> configure Supabase, deploy to Vercel, then register the MCP URL in your MCP-capable client.</div></div>
        <div className="mt-7 rounded-xl bg-black/[.04] p-4 text-sm"><b>Local setup</b><pre className="mt-2 overflow-auto">npm install{"\n"}npm run dev</pre></div>
      </div>
    </main>
  );
}