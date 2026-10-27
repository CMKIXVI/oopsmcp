export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-8">
        <h1 className="text-3xl font-semibold">Install OopsMCP</h1>
        <p className="mt-3 text-black/60">
          Create your own OopsMCP installation by forking the official repository,
          deploying your fork to Vercel, and then configuring your MCP address.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-black/10 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-black/40">1</div>
            <h2 className="mt-2 font-semibold">Fork first</h2>
            <p className="mt-2 text-sm text-black/55">Create your own GitHub copy of OopsMCP.</p>
            <a className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm text-white" href="https://github.com/CMKIXVI/oopsmcp/fork" target="_blank" rel="noreferrer">Fork OopsMCP ↗</a>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-black/40">2</div>
            <h2 className="mt-2 font-semibold">Deploy your fork</h2>
            <p className="mt-2 text-sm text-black/55">In Vercel, import your own <code>username/oopsmcp</code> repository.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-black/40">3</div>
            <h2 className="mt-2 font-semibold">Set MCP address</h2>
            <p className="mt-2 text-sm text-black/55">Use your Vercel URL or custom domain with <code>/mcp</code>.</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-black/[.04] p-5 text-sm">
          <b>Your MCP address</b>
          <p className="mt-2 text-black/60">After deployment:</p>
          <code className="mt-2 block overflow-auto rounded-lg bg-white p-3">https://YOUR-PROJECT.vercel.app/mcp</code>
          <p className="mt-3 text-black/60">Or with your custom domain:</p>
          <code className="mt-2 block overflow-auto rounded-lg bg-white p-3">https://YOUR-DOMAIN/mcp</code>
        </div>

        <div className="mt-7 rounded-xl border border-black/10 p-5 text-sm">
          <b>Local setup</b>
          <pre className="mt-2 overflow-auto">npm install{"\n"}npm run dev</pre>
        </div>

        <a className="mt-6 inline-block text-sm underline" href="/">← Back to OopsMCP Studio</a>
      </div>
    </main>
  );
}
