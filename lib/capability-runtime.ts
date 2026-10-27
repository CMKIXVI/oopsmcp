import type { Capability } from "@/lib/capabilities";

export type ExecutionStatus = "registered" | "implemented" | "not_implemented" | "requires_configuration" | "executed" | "failed";
export type CapabilityExecution = { capability: string; name: string; role: Capability["role"]; status: ExecutionStatus; performed: boolean; result?: unknown; message: string };
type Provider = (args: { capability: Capability; input?: string; data: Record<string, unknown> }) => Promise<unknown>;
const providers = new Map<string, Provider>();
export function registerCapabilityProvider(id: string, provider: Provider) { providers.set(id, provider); }
export function hasCapabilityProvider(id: string) { return providers.has(id); }

function numbers(input: string | undefined, data: Record<string, unknown>) {
  const source = data.values ?? data.numbers ?? input ?? "";
  if (Array.isArray(source)) return source.map(Number).filter(Number.isFinite);
  return String(source).match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
}
function arithmetic(expression: string): number {
  const clean = expression.replace(/\s+/g, "");
  const tokens = clean.match(/\d+(?:\.\d+)?|[()+\-*/%]/g) ?? [];
  if (!tokens.length || tokens.join("") !== clean) throw new Error("Invalid arithmetic expression.");
  const values: number[] = [], ops: string[] = [];
  const precedence = (op: string) => op === "+" || op === "-" ? 1 : 2;
  const apply = () => { const op = ops.pop(); const b = values.pop(); const a = values.pop(); if (!op || a === undefined || b === undefined) throw new Error("Invalid arithmetic expression."); if (op === "+") values.push(a + b); else if (op === "-") values.push(a - b); else if (op === "*") values.push(a * b); else if (op === "/") { if (b === 0) throw new Error("Division by zero."); values.push(a / b); } else values.push(a % b); };
  for (const token of tokens) { if (/^\d/.test(token)) values.push(Number(token)); else if (token === "(") ops.push(token); else if (token === ")") { while (ops.at(-1) && ops.at(-1) !== "(") apply(); if (ops.pop() !== "(") throw new Error("Mismatched parentheses."); } else { while (ops.at(-1) && ops.at(-1) !== "(" && precedence(ops.at(-1)!) >= precedence(token)) apply(); ops.push(token); } }
  while (ops.length) { if (ops.at(-1) === "(") throw new Error("Mismatched parentheses."); apply(); }
  if (values.length !== 1 || !Number.isFinite(values[0])) throw new Error("Invalid arithmetic expression.");
  return values[0];
}
function pairs(data: Record<string, unknown>, input?: string) {
  const raw = data.items ?? data.layers ?? data.batches ?? input ?? [];
  if (!Array.isArray(raw)) throw new Error("Provide items as [{quantity, unitCost}] or numeric pairs.");
  return raw.map((x) => { if (typeof x === "object" && x !== null) { const o = x as Record<string, unknown>; return { quantity: Number(o.quantity), unitCost: Number(o.unitCost ?? o.cost ?? o.price) }; } return null; }).filter((x): x is { quantity: number; unitCost: number } => !!x && Number.isFinite(x.quantity) && Number.isFinite(x.unitCost));
}
function registerBuiltins() {
  registerCapabilityProvider("personal_user.calculator", async ({ input, data }) => ({ expression: input ?? String(data.expression ?? ""), value: arithmetic(input ?? String(data.expression ?? "")) }));
  registerCapabilityProvider("personal_user.percentage_calculator", async ({ input, data }) => { const n = numbers(input, data); if (n.length < 2) throw new Error("Provide value and percentage."); return { value:n[0], percentage:n[1], result:n[0]*n[1]/100 }; });
  registerCapabilityProvider("personal_user.statistics_calculator", async ({ input, data }) => { const n=numbers(input,data); if (!n.length) throw new Error("Provide a list of numbers."); const sorted=[...n].sort((a,b)=>a-b), sum=n.reduce((a,b)=>a+b,0), mean=sum/n.length, median=sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2; return {count:n.length,sum,mean,median,min:sorted[0],max:sorted.at(-1)}; });
  registerCapabilityProvider("sales.discount_calculator", async ({ input, data }) => { const n=numbers(input,data); if(n.length<2) throw new Error("Provide price and discount percentage."); return {price:n[0],discountPercentage:n[1],discountAmount:n[0]*n[1]/100,finalPrice:n[0]*(1-n[1]/100)}; });

  registerCapabilityProvider("inventory_store.reorder_point_calculator", async ({ input, data }) => { const n=numbers(input,data); if(n.length<3) throw new Error("Provide daily demand, lead time days, and safety stock."); return {dailyDemand:n[0],leadTimeDays:n[1],safetyStock:n[2],reorderPoint:n[0]*n[1]+n[2]}; });
  registerCapabilityProvider("inventory_store.weighted_average_cost", async ({ input, data }) => { const p=pairs(data,input); if(!p.length) throw new Error("Provide inventory layers with quantity and unitCost."); const qty=p.reduce((s,x)=>s+x.quantity,0), value=p.reduce((s,x)=>s+x.quantity*x.unitCost,0); return {totalQuantity:qty,totalValue:value,weightedAverageCost:value/qty}; });
  registerCapabilityProvider("inventory_store.fifo_inventory_calculator", async ({ input, data }) => { const layers=pairs(data,input); const issue=Number(data.issueQuantity ?? numbers(input,data).at(-1)); if(!layers.length || !Number.isFinite(issue) || issue<=0) throw new Error("Provide layers and issueQuantity."); let remaining=issue,cost=0; const consumed=[]; for(const layer of layers){if(remaining<=0) break; const q=Math.min(remaining,layer.quantity); cost+=q*layer.unitCost; consumed.push({quantity:q,unitCost:layer.unitCost}); remaining-=q;} if(remaining>0) throw new Error("Issue quantity exceeds available inventory."); return {issueQuantity:issue,costOfGoodsIssued:cost,remainingQuantity:layers.reduce((s,x)=>s+x.quantity,0)-issue,consumedLayers:consumed}; });
  registerCapabilityProvider("finance_accountant.financial_ratio_calculator", async ({ input, data }) => { const n=numbers(input,data); if(n.length<4) throw new Error("Provide currentAssets, currentLiabilities, totalDebt, equity."); const [ca,cl,debt,equity]=n; if(cl===0||equity===0) throw new Error("Liabilities and equity must be non-zero."); return {currentRatio:ca/cl,debtToEquity:debt/equity,workingCapital:ca-cl,debtToCapital:debt/(debt+equity)}; });
  registerCapabilityProvider("sales.pipeline_forecast", async ({ input, data }) => { const raw=data.deals ?? data.opportunities; const deals=Array.isArray(raw)?raw:[]; if(!deals.length) throw new Error("Provide deals as [{amount, probability}]."); const rows=deals.map((d)=>{const o=d as Record<string,unknown>; return {amount:Number(o.amount),probability:Number(o.probability)};}).filter(x=>Number.isFinite(x.amount)&&Number.isFinite(x.probability)); if(!rows.length) throw new Error("No valid deals supplied."); return {dealCount:rows.length,totalPipeline:rows.reduce((s,d)=>s+d.amount,0),weightedForecast:rows.reduce((s,d)=>s+d.amount*d.probability/100,0)}; });
}
registerBuiltins();

export async function executeCapability(capability: Capability, input?: string, data: Record<string, unknown> = {}): Promise<CapabilityExecution> {
  const provider = providers.get(capability.id);
  if (!provider) return { capability:capability.id,name:capability.name,role:capability.role,status:"not_implemented",performed:false,message:`No provider is configured for ${capability.name}. No external action was performed.` };
  try { const result=await provider({capability,input,data}); return {capability:capability.id,name:capability.name,role:capability.role,status:"executed",performed:true,result,message:`${capability.name} executed successfully.`}; }
  catch(error){ return {capability:capability.id,name:capability.name,role:capability.role,status:"failed",performed:false,message:error instanceof Error?error.message:"Capability provider failed."}; }
}
