import { NextResponse } from "next/server";
import "@/lib/builtin-providers";
import { capabilities } from "@/lib/capabilities";
import { executeCapability } from "@/lib/capability-runtime";
import { requireUser } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => ({}));
  const tool = capabilities.find((item) => item.id === body.toolId);
  if (!tool) return NextResponse.json({ error: "Unknown OopsMCP tool" }, { status: 404 });

  const execution = await executeCapability(
    tool,
    typeof body.input === "string" ? body.input : undefined,
    body.values && typeof body.values === "object" ? body.values : {},
  );

  const httpStatus = execution.status === "executed" ? 200 : execution.status === "failed" ? 500 : 501;
  return NextResponse.json({ ...execution, protocol: "MCP" }, { status: httpStatus });
}
