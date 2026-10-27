import { capabilities } from "./capabilities";

export type ContentType = "tool" | "resource" | "prompt" | "workflow" | "agent";

export type ContentItem = {
  id: string;
  type: ContentType;
  name: string;
  description: string;
  status: "published" | "draft";
  category: string;
  updatedAt: string;
};

const today = "2026-10-27";

export const defaultContent: ContentItem[] = [
  ...capabilities.map((c) => ({
    id: c.id,
    type: "tool" as const,
    name: c.name,
    description: c.description,
    status: "published" as const,
    category: c.role,
    updatedAt: today,
  })),
  { id: "personal.search", type: "tool", name: "Personal Search", description: "Search the personal knowledge and content registry.", status: "published", category: "Platform", updatedAt: today },
  { id: "personal.get_server_info", type: "tool", name: "Get OopsMCP Info", description: "Return OopsMCP identity and capability counts.", status: "published", category: "Platform", updatedAt: today },
  { id: "knowledge://profile", type: "resource", name: "Personal Profile", description: "Stable preferences and server configuration.", status: "published", category: "Knowledge", updatedAt: today },
  { id: "knowledge://projects", type: "resource", name: "Projects", description: "Projects and active initiatives exposed to the MCP client.", status: "published", category: "Knowledge", updatedAt: today },
  { id: "prompt.opportunity-hunter", type: "prompt", name: "Opportunity Hunter", description: "Find and prioritize real opportunities with a path to payment.", status: "published", category: "AI", updatedAt: today },
  { id: "workflow.research-to-report", type: "workflow", name: "Research → Report", description: "Research a topic, synthesize evidence, and produce a report.", status: "draft", category: "Workflow", updatedAt: today },
  { id: "agent.researcher", type: "agent", name: "Research Agent", description: "Delegated research capability using registered tools.", status: "draft", category: "Agents", updatedAt: today },
];

export const contentStats = (items: ContentItem[]) => ({
  tool: items.filter(x => x.type === "tool").length,
  resource: items.filter(x => x.type === "resource").length,
  prompt: items.filter(x => x.type === "prompt").length,
  workflow: items.filter(x => x.type === "workflow").length,
  agent: items.filter(x => x.type === "agent").length,
});