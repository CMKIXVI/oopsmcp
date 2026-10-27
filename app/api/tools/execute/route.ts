import { NextResponse } from "next/server";
import { capabilities } from "@/lib/capabilities";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tool = capabilities.find((item) => item.id === body.toolId);
  if (!tool) return NextResponse.json({ error: "Unknown OopsMCP tool" }, { status: 404 });
  return NextResponse.json({ capability: tool.id, name: tool.name, role: tool.role, status: "accepted", values: body.values || {}, message: `UI execution contract accepted for ${tool.name}. Connect a provider implementation to enable production execution.`, protocol: "MCP" });
}