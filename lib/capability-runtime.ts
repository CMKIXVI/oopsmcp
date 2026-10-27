import type { Capability } from "@/lib/capabilities";

export type ExecutionStatus = "registered" | "implemented" | "not_implemented" | "requires_configuration" | "executed" | "failed";

export type CapabilityExecution = {
  capability: string;
  name: string;
  role: Capability["role"];
  status: ExecutionStatus;
  performed: boolean;
  result?: unknown;
  message: string;
};

type Provider = (args: { capability: Capability; input?: string; data: Record<string, unknown> }) => Promise<unknown>;
const providers = new Map<string, Provider>();

export function registerCapabilityProvider(id: string, provider: Provider) { providers.set(id, provider); }
export function hasCapabilityProvider(id: string) { return providers.has(id); }

export async function executeCapability(capability: Capability, input?: string, data: Record<string, unknown> = {}): Promise<CapabilityExecution> {
  const provider = providers.get(capability.id);
  if (!provider) return { capability: capability.id, name: capability.name, role: capability.role, status: "not_implemented", performed: false, message: `No provider is configured for ${capability.name}. No external action was performed.` };
  try {
    const result = await provider({ capability, input, data });
    return { capability: capability.id, name: capability.name, role: capability.role, status: "executed", performed: true, result, message: `${capability.name} executed successfully.` };
  } catch (error) {
    return { capability: capability.id, name: capability.name, role: capability.role, status: "failed", performed: false, message: error instanceof Error ? error.message : "Capability provider failed." };
  }
}
