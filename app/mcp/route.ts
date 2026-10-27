import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { getContent } from "@/lib/db";
import { requireMcpKey } from "@/lib/auth";
import { capabilities, FUNCTIONAL_TOOL_COUNT } from "@/lib/capabilities";
import { executeCapability } from "@/lib/capability-runtime";

const capabilityInput = { input: z.string().optional().describe("Natural-language request or primary input for this capability."), data: z.record(z.any()).optional().describe("Optional structured input for the capability.") };

const handler = createMcpHandler(async (server) => {
  server.registerTool("personal.get_server_info", { title: "Get OopsMCP Info", description: "Return OopsMCP identity, role model and capability counts.", inputSchema: {} }, async () => ({ content: [{ type: "text", text: `OopsMCP — 500 functional capabilities organized by role, plus platform services.` }], structuredContent: { name: "OopsMCP", endpoint: "/mcp", functionalCapabilities: FUNCTIONAL_TOOL_COUNT, roles: [...new Set(capabilities.map(c => c.role))].length, contentTypes: ["tools", "resources", "prompts", "workflows", "agents"], timestamp: new Date().toISOString() } }));
  server.registerTool("personal.list_content", { title: "List OopsMCP Content", description: "List the capabilities currently published by this OopsMCP.", inputSchema: { type: z.enum(["tool","resource","prompt","workflow","agent"]).optional(), query: z.string().optional() } }, async ({ type, query }) => { const all = await getContent(); const q = (query || "").toLowerCase(); const items = all.filter(x => x.status === "published" && (!type || x.type === type) && (!q || `${x.name} ${x.description} ${x.category}`.toLowerCase().includes(q))); return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }], structuredContent: { items } }; });
  server.registerTool("personal.search", { title: "Search OopsMCP", description: "Search the role-based OopsMCP capability registry.", inputSchema: { query: z.string().min(1) } }, async ({ query }) => { const all = await getContent(); const q = query.toLowerCase(); const items = all.filter(x => x.status === "published" && `${x.name} ${x.description} ${x.category}`.toLowerCase().includes(q)); return { content: [{ type: "text", text: items.map(x => `${x.type}: ${x.name} — ${x.description}`).join("\n") || "No matching content." }], structuredContent: { query, items } }; });
  for (const capability of capabilities) {
    server.registerTool(capability.id, { title: capability.name, description: capability.description, inputSchema: capabilityInput }, async ({ input, data }) => {
      const execution = await executeCapability(capability, input, data);
      return { content: [{ type: "text" as const, text: JSON.stringify(execution, null, 2) }], structuredContent: execution };
    });
  }
  server.registerResource("personal-profile", "knowledge://profile", { title: "Personal Profile", description: "OopsMCP server profile.", mimeType: "text/plain" }, async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/plain", text: `OopsMCP\nFunctional capabilities: ${FUNCTIONAL_TOOL_COUNT}\nRole-based capability discovery: enabled\nEndpoint: /mcp\nContent managed through OopsMCP Studio.` }] }));
});

async function authorizedHandler(request: Request) {
  const rejection = requireMcpKey(request);
  if (rejection) return rejection;
  return handler(request);
}

export const GET = authorizedHandler;
export const POST = authorizedHandler;
