import { createClient as createSupabaseServerClient } from "./supabase/server";
import { defaultContent, type ContentItem } from "./content";

function supabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function getContent(): Promise<ContentItem[]> {
  if (!supabaseConfigured()) return defaultContent;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("mcp_content").select("id,type,name,description,status,category,updated_at").order("type").order("name");
  if (error || !data?.length) return defaultContent;
  return data.map((r: any) => ({ id: r.id, type: r.type, name: r.name, description: r.description, status: r.status, category: r.category, updatedAt: r.updated_at }));
}

export async function upsertContent(item: ContentItem) {
  if (!supabaseConfigured()) return item;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("mcp_content").upsert({ id: item.id, type: item.type, name: item.name, description: item.description, status: item.status, category: item.category, updated_at: item.updatedAt });
  if (error) throw error;
  return item;
}