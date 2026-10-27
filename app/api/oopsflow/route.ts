import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

function readManifest() {
  const p = path.join(process.cwd(), "integrations", "oopsflow-manifest.json");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export async function GET() {
  return NextResponse.json(readManifest());
}