import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true, service: "oopsmcp", mcp: "/mcp", storage: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase" : "memory", timestamp: new Date().toISOString() });
}