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
function rows(data: Record<string, unknown>, input?: string): Record<string, unknown>[] {
  const raw = data.rows ?? data.records ?? data.data ?? input;
  if (Array.isArray(raw)) return raw.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null);
  if (typeof raw === "string") { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) return parsed.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null); }
  throw new Error("Provide rows as an array of objects.");
}
function jsonValue(data: Record<string, unknown>, input?: string): unknown { return data.json ?? input ?? ""; }
function parseJson(data: Record<string, unknown>, input?: string): unknown { const raw = jsonValue(data, input); return typeof raw === "string" ? JSON.parse(raw) : raw; }

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

  registerCapabilityProvider("developer.json_formatter", async ({ input, data }) => ({ valid:true, json:JSON.stringify(parseJson(data,input), null, Number(data.indent ?? 2)) }));
  registerCapabilityProvider("developer.json_validator", async ({ input, data }) => { try { const value=parseJson(data,input); return {valid:true,type:Array.isArray(value)?"array":value===null?"null":typeof value}; } catch(error) { return {valid:false,error:error instanceof Error?error.message:"Invalid JSON"}; } });
  registerCapabilityProvider("data_analyst.data_validator", async ({ input, data }) => { const rs=rows(data,input), required=Array.isArray(data.requiredColumns)?data.requiredColumns.map(String):[]; const missing=rs.map((r,i)=>({row:i+1,columns:required.filter(c=>r[c]===undefined||r[c]===null||r[c]==="")})).filter(x=>x.columns.length); return {valid:missing.length===0, rowCount:rs.length, requiredColumns:required, invalidRows:missing}; });
  registerCapabilityProvider("data_analyst.data_cleaner", async ({ input, data }) => { const rs=rows(data,input), trim= data.trimStrings !== false; const cleaned=rs.map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,typeof v==="string"&&trim?v.trim():v]))); return {rowCount:cleaned.length,rows:cleaned}; });
  registerCapabilityProvider("data_analyst.duplicate_detector", async ({ input, data }) => { const rs=rows(data,input), keys=Array.isArray(data.keys)?data.keys.map(String):Object.keys(rs[0]??{}), seen=new Map<string,number>(), duplicates: Record<string,unknown>[]=[]; for(const r of rs){const key=JSON.stringify(keys.map(k=>r[k])); if(seen.has(key)) duplicates.push(r); else seen.set(key,1);} return {rowCount:rs.length,uniqueCount:seen.size,duplicateCount:duplicates.length,duplicates}; });
  registerCapabilityProvider("data_analyst.data_transformer", async ({ input, data }) => { const rs=rows(data,input), select=Array.isArray(data.select)?data.select.map(String):null, rename=typeof data.rename==="object"&&data.rename!==null?data.rename as Record<string,unknown>:{}, filtered=rs.map(r=>{const base=select?Object.fromEntries(select.map(k=>[k,r[k]])):({...r}); return Object.fromEntries(Object.entries(base).map(([k,v])=>[String(rename[k]??k),v]));}); return {rowCount:filtered.length,rows:filtered}; });
  registerCapabilityProvider("data_analyst.table_comparator", async ({ data }) => { const left=Array.isArray(data.left)?data.left:[], right=Array.isArray(data.right)?data.right:[], key=String(data.key??"id"), rightMap=new Map(right.map((r)=>[JSON.stringify((r as Record<string,unknown>)[key]),r])); const onlyLeft=left.filter(r=>!rightMap.has(JSON.stringify((r as Record<string,unknown>)[key]))); const leftKeys=new Set(left.map(r=>JSON.stringify((r as Record<string,unknown>)[key]))); const onlyRight=right.filter(r=>!leftKeys.has(JSON.stringify((r as Record<string,unknown>)[key]))); return {leftCount:left.length,rightCount:right.length,onlyLeft,onlyRight,matchingCount:left.length-onlyLeft.length}; });
  registerCapabilityProvider("data_analyst.dataset_profiler", async ({ input, data }) => { const rs=rows(data,input), columns=Object.keys(rs[0]??{}); const profile=Object.fromEntries(columns.map(c=>{const vals=rs.map(r=>r[c]).filter(v=>v!==null&&v!==undefined&&v!==""); const numeric=vals.filter(v=>typeof v==="number"&&Number.isFinite(v as number)).map(Number); return [c,{nonEmpty:vals.length,missing:rs.length-vals.length,unique:new Set(vals.map(v=>JSON.stringify(v))).size,numericCount:numeric.length,min:numeric.length?Math.min(...numeric):undefined,max:numeric.length?Math.max(...numeric):undefined}];})); return {rowCount:rs.length,columnCount:columns.length,columns,profile}; });
  registerCapabilityProvider("data_analyst.kpi_calculator", async ({ data }) => { const rs=rows(data), valueColumn=String(data.valueColumn??"value"), values=rs.map(r=>Number(r[valueColumn])).filter(Number.isFinite); if(!values.length) throw new Error(`No numeric values found in ${valueColumn}.`); const sum=values.reduce((a,b)=>a+b,0); return {count:values.length,sum,average:sum/values.length,min:Math.min(...values),max:Math.max(...values)}; });
}
registerBuiltins();

export async function executeCapability(capability: Capability, input?: string, data: Record<string, unknown> = {}): Promise<CapabilityExecution> {
  const provider = providers.get(capability.id);
  if (!provider) return { capability:capability.id,name:capability.name,role:capability.role,status:"not_implemented",performed:false,message:`No provider is configured for ${capability.name}. No external action was performed.` };
  try { const result=await provider({capability,input,data}); return {capability:capability.id,name:capability.name,role:capability.role,status:"executed",performed:true,result,message:`${capability.name} executed successfully.`}; }
  catch(error){ return {capability:capability.id,name:capability.name,role:capability.role,status:"failed",performed:false,message:error instanceof Error?error.message:"Capability provider failed."}; }
}
