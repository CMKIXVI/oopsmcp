import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { user: null, response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  }
  return { user: data.user, response: null };
}

export function requireMcpKey(request: Request) {
  const configuredKey = process.env.OOPS_MCP_API_KEY;
  if (!configuredKey) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "MCP authentication is not configured" }, { status: 503 });
    }
    return null;
  }

  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (token !== configuredKey) {
    return NextResponse.json({ error: "Unauthorized MCP request" }, { status: 401 });
  }
  return null;
}
