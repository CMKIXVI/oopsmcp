import { createHash, randomBytes } from "node:crypto";
import { registerCapabilityProvider } from "@/lib/capability-runtime";

function source(input: string | undefined, data: Record<string, unknown>): string {
  return String(data.value ?? data.text ?? data.input ?? input ?? "");
}

function numbers(input: string | undefined, data: Record<string, unknown>): number[] {
  const value = data.values ?? data.numbers ?? input ?? "";
  if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite);
  return String(value).match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
}

function dateValue(input: string | undefined, data: Record<string, unknown>): Date {
  const value = data.date ?? data.value ?? input;
  const date = value ? new Date(String(value)) : new Date();
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date.");
  return date;
}

function diffText(a: string, b: string) {
  const left = a.split(/\r?\n/);
  const right = b.split(/\r?\n/);
  const max = Math.max(left.length, right.length);
  const changes: Array<{ line: number; left?: string; right?: string }> = [];
  for (let i = 0; i < max; i++) {
    if (left[i] !== right[i]) changes.push({ line: i + 1, left: left[i], right: right[i] });
  }
  return { changedLines: changes.length, changes };
}

export function registerBuiltinProviders() {
  registerCapabilityProvider("personal_user.unit_converter", async ({ input, data }) => {
    const from = String(data.from ?? "").toLowerCase();
    const to = String(data.to ?? "").toLowerCase();
    const value = Number(data.value ?? input);
    const key = `${from}:${to}`;
    const factors: Record<string, number> = {
      "km:m": 1000, "m:km": 0.001, "m:cm": 100, "cm:m": 0.01,
      "kg:g": 1000, "g:kg": 0.001, "lb:kg": 0.45359237, "kg:lb": 2.2046226218,
      "c:f": 1, "f:c": 1, "l:ml": 1000, "ml:l": 0.001,
    };
    if (!Number.isFinite(value)) throw new Error("Provide a numeric value.");
    if (key === "c:f") return { value, from, to, result: value * 9 / 5 + 32 };
    if (key === "f:c") return { value, from, to, result: (value - 32) * 5 / 9 };
    if (!(key in factors)) throw new Error("Unsupported conversion. Use a supported from/to unit pair.");
    return { value, from, to, result: value * factors[key] };
  });

  registerCapabilityProvider("personal_user.hash_generator", async ({ input, data }) => {
    const algorithm = String(data.algorithm ?? "sha256").toLowerCase();
    if (!/^(sha256|sha384|sha512|md5)$/.test(algorithm)) throw new Error("Unsupported hash algorithm.");
    return { algorithm, hash: createHash(algorithm).update(source(input, data)).digest("hex") };
  });

  registerCapabilityProvider("personal_user.password_generator", async ({ data }) => {
    const length = Math.min(128, Math.max(8, Number(data.length ?? 20)));
    const alphabet = String(data.alphabet ?? "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*");
    if (!alphabet) throw new Error("Password alphabet cannot be empty.");
    const bytes = randomBytes(length);
    let password = "";
    for (const byte of bytes) password += alphabet[byte % alphabet.length];
    return { length, password };
  });

  registerCapabilityProvider("personal_user.text_diff", async ({ input, data }) => {
    const a = String(data.left ?? data.a ?? input ?? "");
    const b = String(data.right ?? data.b ?? "");
    return diffText(a, b);
  });

  registerCapabilityProvider("personal_user.statistics_calculator", async ({ input, data }) => {
    const n = numbers(input, data);
    if (!n.length) throw new Error("Provide a list of numbers.");
    const sorted = [...n].sort((a, b) => a - b);
    const sum = n.reduce((a, b) => a + b, 0);
    const mean = sum / n.length;
    const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
    return { count: n.length, sum, mean, median, min: sorted[0], max: sorted[sorted.length - 1] };
  });

  registerCapabilityProvider("personal_user.date_calculator", async ({ input, data }) => {
    const start = dateValue(input, data);
    const days = Number(data.days ?? data.addDays ?? 0);
    if (!Number.isFinite(days)) throw new Error("Days must be numeric.");
    const result = new Date(start);
    result.setDate(result.getDate() + days);
    return { start: start.toISOString(), days, result: result.toISOString() };
  });

  registerCapabilityProvider("personal_user.time_calculator", async ({ input, data }) => {
    const seconds = Number(data.seconds ?? input ?? 0);
    if (!Number.isFinite(seconds)) throw new Error("Seconds must be numeric.");
    const sign = seconds < 0 ? "-" : "";
    const absolute = Math.abs(seconds);
    const hours = Math.floor(absolute / 3600);
    const minutes = Math.floor((absolute % 3600) / 60);
    const secs = absolute % 60;
    return { seconds, hours, minutes, remainingSeconds: secs, formatted: `${sign}${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}` };
  });
}

registerBuiltinProviders();
