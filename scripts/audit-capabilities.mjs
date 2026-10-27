import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataFiles = [1, 2, 3, 4].map((n) => path.join(root, "lib", `capability-data-${n}.ts`));
const expectedRoles = [
  "personal_user", "business_owner", "sales", "crm_customer_success", "finance_accountant",
  "inventory_store", "procurement_purchase", "billing_ar", "india_gst", "us_tax",
  "freelancer", "hr_employee", "student", "teacher", "marketing", "whatsapp_communication",
  "operations", "data_analyst", "developer", "it_technical", "project_manager", "ecommerce",
  "home_family", "vehicle_travel", "office_documents_ai",
];

const source = dataFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const rowPattern = /\[\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"\s*\]/g;
const rows = [...source.matchAll(rowPattern)].map((m) => ({ id: m[1], name: m[2], role: m[3] }));

const uiRules = [
  ["calculator", /calculator|converter|counter|percentage|interest|loan|emi|tax|profit|break-even|margin|ratio|salary|fuel cost|electricity cost|bmi|age|distance|mileage|storage|size/i],
  ["data", /excel|csv|spreadsheet|pivot|data cleaner|data validator|data transformer|chart|analyzer|forecast|trend|duplicate|column mapper/i],
  ["document", /pdf|document|doc|report|presentation|contract|agreement|invoice|quotation|purchase order|sales order|credit note|debit note|payslip|certificate|form|template|letter|policy|statement/i],
  ["image", /image|ocr|barcode|qr|thumbnail|crop|rotate|flip|grayscale|metadata|exif/i],
  ["communication", /whatsapp|email|sms|message|communication|newsletter|social|campaign|notification|quick repl|greeting|away message|customer communication/i],
  ["finance", /ledger|book|finance|account|invoice|payment|receivable|payable|cash flow|budget|expense|income|financial|bank|gst|tax|tds|balance sheet|profit|loss|credit|debit/i],
  ["education", /student|class|course|assignment|exam|grade|attendance|study|fee|lesson|quiz|flashcard|teacher|school|timetable|homework/i],
  ["developer", /api|json|xml|yaml|regex|jwt|base64|uuid|cron|sql|code|log|environment|hash|checksum|github|gitlab|webhook/i],
  ["schedule", /calendar|reminder|alarm|schedule|planner|appointment|meeting|timesheet|milestone|deadline|follow-up|tracker|todo|task|checklist/i],
  ["search", /search|lookup|finder|directory|contacts|customer|lead|supplier|vendor|product|catalogue|portfolio/i],
];

const templateFor = (name) => {
  for (const [template, rule] of uiRules) if (rule.test(name.toLowerCase())) return template;
  return "form";
};

const counts = Object.fromEntries(expectedRoles.map((role) => [role, 0]));
const duplicateIds = [];
const seen = new Set();
const empty = [];
const templateCounts = {};
const generic = [];

for (const row of rows) {
  counts[row.role] = (counts[row.role] ?? 0) + 1;
  if (seen.has(row.id)) duplicateIds.push(row.id);
  seen.add(row.id);
  if (!row.id || !row.name || !row.role) empty.push(row);
  const template = templateFor(row.name);
  templateCounts[template] = (templateCounts[template] ?? 0) + 1;
  if (template === "form") generic.push(row);
}

const unknownRoles = [...new Set(rows.map((r) => r.role).filter((r) => !expectedRoles.includes(r)))];
const badRoleCounts = expectedRoles.filter((role) => counts[role] !== 20).map((role) => `${role}=${counts[role]}`);
const duplicateNames = [...new Set(rows.map((r) => r.name))].filter((name) => rows.filter((r) => r.name === name).length > 1);

console.log("OopsMCP capability/UI audit");
console.log("===========================");
console.log(`Capabilities: ${rows.length}`);
console.log(`Roles: ${expectedRoles.length}`);
console.log(`Expected: 500 capabilities, 25 roles, 20 tools/role`);
console.log("");
console.log("Role counts:");
for (const role of expectedRoles) console.log(`  ${role}: ${counts[role]}`);
console.log("");
console.log("UI template coverage:");
for (const [template, count] of Object.entries(templateCounts).sort()) console.log(`  ${template}: ${count}`);
console.log("");
console.log(`Duplicate IDs: ${duplicateIds.length}`);
console.log(`Duplicate names: ${duplicateNames.length}`);
console.log(`Empty rows: ${empty.length}`);
console.log(`Unknown roles: ${unknownRoles.length}`);
console.log(`Generic form tools: ${generic.length}`);
if (generic.length) {
  console.log("Generic form tools:");
  for (const row of generic) console.log(`  ${row.id} — ${row.name}`);
}

const failed = rows.length !== 500 || expectedRoles.length !== 25 || badRoleCounts.length || duplicateIds.length || empty.length || unknownRoles.length;
if (failed) {
  console.error("\nAUDIT FAILED");
  if (badRoleCounts.length) console.error(`Role count errors: ${badRoleCounts.join(", ")}`);
  if (duplicateIds.length) console.error(`Duplicate IDs: ${duplicateIds.join(", ")}`);
  if (empty.length) console.error(`Empty rows: ${JSON.stringify(empty)}`);
  if (unknownRoles.length) console.error(`Unknown roles: ${unknownRoles.join(", ")}`);
  process.exit(1);
}

console.log("\nAUDIT PASSED: registry integrity is correct.");
console.log("Note: generic-form count is a UI-quality signal, not a registry failure.");
