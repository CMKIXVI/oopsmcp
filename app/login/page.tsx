"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function signIn() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    setMessage(error ? error.message : "Check your email for the sign-in link.");
  }
  return <main className="min-h-screen grid place-items-center bg-[#f7f7f5] p-6"><div className="w-full max-w-md rounded-2xl bg-white border border-black/10 p-7"><h1 className="text-2xl font-semibold">OopsMCP</h1><p className="mt-2 text-sm text-black/55">Sign in to manage your private MCP server.</p><input className="mt-6 w-full rounded-lg border border-black/10 px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /><button className="mt-3 w-full rounded-lg bg-black text-white py-2" onClick={signIn}>Send sign-in link</button>{message && <p className="mt-4 text-sm text-black/55">{message}</p>}</div></main>;
}