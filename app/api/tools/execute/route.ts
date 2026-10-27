import { NextResponse } from "next/server";
import { capabilities } from "@/lib/capabilities";
import { requireUser } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => ({}));
  const tool = capabilities.find((item) => item.id === body.toolId);
  if (!tool) return NextResponse.json({ error: "Unknown OopsMCP tool" }, { status: 404 });

  return NextResponse.json({
    capability: tool.id,
    name: tool.name,
    role: tool.role,
    status: "not_implemented",
    values: body.values || {},
    message: `The UI and capability registry recognize ${tool.name}, but no production provider is connected yet. No external action was performed.`,
    protocol: "MCP",
  }, { status: 501 });
}
