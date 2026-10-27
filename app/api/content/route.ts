import { NextResponse } from "next/server";
import { getContent, upsertContent } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  return NextResponse.json({ items: await getContent() });
}

const schema = z.object({
  id: z.string().min(1), type: z.enum(["tool","resource","prompt","workflow","agent"]), name: z.string().min(1), description: z.string().min(1), status: z.enum(["published","draft"]), category: z.string().min(1), updatedAt: z.string().min(1),
});

export async function POST(req: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid content item", details: parsed.error.flatten() }, { status: 400 });
  const item = await upsertContent(parsed.data);
  return NextResponse.json({ item });
}
