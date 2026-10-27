"use client";

import { useEffect, useMemo, useState } from "react";

const UPSTREAM = "CMKIXVI/oopsmcp";

export default function InstallPage() {
  const [githubUser, setGithubUser] = useState("");
  const [vercelProject, setVercelProject] = useState("oopsmcp");
  const [mcpAddress, setMcpAddress] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGithubUser(localStorage.getItem("oopsmcp.githubUser") || "");
    setVercelProject(localStorage.getItem("oopsmcp.vercelProject") || "oopsmcp");
    setMcpAddress(localStorage.getItem("oopsmcp.mcpAddress") || "");
  }, []);

  const repositoryUrl = githubUser.trim()
    ? `https://github.com/${githubUser.trim()}/oopsmcp`
    : `https://github.com/${UPSTREAM}`;
  const vercelUrl = githubUser.trim()
    ? `https://vercel.com/new/import?s=https://github.com/${encodeURIComponent(githubUser.trim())}/oopsmcp`
    : "https://vercel.com/new";
  const suggestedMcp = useMemo(
    () => mcpAddress.trim() || (vercelProject.trim() ? `https://${vercelProject.trim()}.vercel.app/mcp` : ""),
    [mcpAddress, vercelProject]
  );

  function saveSetup() {
    const address = mcpAddress.trim() || suggestedMcp;
    localStorage.setItem("oopsmcp.githubUser", githubUser.trim());
    localStorage.setItem("oopsmcp.vercelProject", vercelProject.trim());
    localStorage.setItem("oopsmcp.mcpAddress", address);
    setMcpAddress(address);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f2] p-5 text-[#161616] md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center justify-between"><a href="/" className="text-sm font-medium">← OopsMCP Studio</a><span className="rounded-full bg-black px-3 py-1.5 text-[11px] text-white">v1.5.0</span></div>
        <section className="rounded-3xl bg-black p-7 text-white md:p-10"><div className="text-xs uppercase tracking-[.18em] text-white/45">Personal deployment</div><h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Fork first. Deploy second.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Your installation belongs to you. Fork the official repository into your GitHub account, deploy that fork to your Vercel account, then configure the MCP address you will give to your AI clients.</p></section>

        <div className="mt-5 grid gap-4 md:grid-cols-3"><Step n="1" title="Fork" body="Create your own GitHub copy." /><Step n="2" title="Deploy" body="Deploy your fork in your Vercel account." /><Step n="3" title="Configure" body="Set the MCP address for your clients." /></div>

        <section className="mt-5 rounded-3xl border border-black/10 bg-white p-6 md:p-8"><div className="text-xs font-semibold uppercase tracking-[.14em] text-black/35">Step 1</div><h2 className="mt-1 text-xl font-semibold">Fork OopsMCP to your GitHub</h2><p className="mt-1 text-sm text-black/50">This creates <code>YOUR-GITHUB/oopsmcp</code>, which becomes your source repository.</p><a href={`https://github.com/${UPSTREAM}/fork`} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">🍴 Fork OopsMCP ↗</a></section>

        <section className="mt-4 rounded-3xl border border-black/10 bg-white p-6 md:p-8"><div className="text-xs font-semibold uppercase tracking-[.14em] text-black/35">Step 2</div><h2 className="mt-1 text-xl font-semibold">Deploy your fork to Vercel</h2><p className="mt-1 text-sm text-black/50">Enter the GitHub account that owns your fork. The generated link targets your fork, not the upstream repository.</p><div className="mt-5 grid gap-3 md:grid-cols-2"><label className="text-sm font-medium">GitHub username<input value={githubUser} onChange={e => setGithubUser(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))} placeholder="your-github-username" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" /></label><label className="text-sm font-medium">Vercel project name<input value={vercelProject} onChange={e => setVercelProject(e.target.value.replace(/[^a-zA-Z0-9-]/g, "-"))} placeholder="oopsmcp" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" /></label></div><div className="mt-4 rounded-xl bg-[#f5f5f2] p-4 text-xs"><div className="font-semibold text-black/45">Repository to deploy</div><code className="mt-1 block break-all">{repositoryUrl}</code></div><a href={vercelUrl} target="_blank" rel="noreferrer" className={`mt-4 inline-flex rounded-xl px-5 py-3 text-sm font-medium ${githubUser.trim() ? "bg-black text-white" : "pointer-events-none bg-black/10 text-black/30"}`}>▲ Deploy my fork to Vercel ↗</a></section>

        <section className="mt-4 rounded-3xl border border-black/10 bg-white p-6 md:p-8"><div className="text-xs font-semibold uppercase tracking-[.14em] text-black/35">Step 3</div><h2 className="mt-1 text-xl font-semibold">Configure your MCP address</h2><p className="mt-1 text-sm text-black/50">After deployment, use your Vercel URL or a custom domain. The MCP endpoint is normally <code>/mcp</code>.</p><label className="mt-5 block text-sm font-medium">MCP address<input value={mcpAddress} onChange={e => setMcpAddress(e.target.value)} placeholder="https://your-domain.com/mcp" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" /></label><div className="mt-3 rounded-xl bg-[#f5f5f2] p-4"><div className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35">Address for ChatGPT / Claude / Gemini / IDEs</div><code className="mt-2 block break-all text-sm">{suggestedMcp || "https://your-domain.com/mcp"}</code></div><button onClick={saveSetup} className="mt-4 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">{saved ? "✓ Saved" : "Save MCP setup"}</button></section>

        <div className="mt-4 grid gap-4 md:grid-cols-2"><Help title="Supabase" body="For persistent authentication, memory and content, configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel." /><Help title="MCP endpoint" body="Your deployed OopsMCP exposes /mcp, for example https://your-project.vercel.app/mcp." /><Help title="500 tool UIs" body="Every registered capability has a dedicated interface at /tools/<tool-id>." /><Help title="OopsFlow" body="OopsFlow is bundled as the workflow and pipeline layer on top of OopsMCP capabilities." /></div>
      </div>
    </main>
  );
}
function Step({ n, title, body }: { n: string; title: string; body: string }) { return <div className="rounded-2xl border border-black/10 bg-white p-5"><div className="grid h-8 w-8 place-items-center rounded-lg bg-black text-xs font-semibold text-white">{n}</div><div className="mt-4 font-semibold">{title}</div><p className="mt-1 text-xs leading-5 text-black/45">{body}</p></div>; }
function Help({ title, body }: { title: string; body: string }) { return <div className="rounded-2xl border border-black/10 bg-white p-5"><div className="font-semibold">{title}</div><p className="mt-2 text-xs leading-5 text-black/50">{body}</p></div>; }
