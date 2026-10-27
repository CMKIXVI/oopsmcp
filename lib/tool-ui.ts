export type ToolField = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'time' | 'select' | 'checkbox' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

export type ToolUi = {
  template: 'calculator' | 'form' | 'tracker' | 'document' | 'data' | 'communication' | 'finance' | 'education' | 'developer' | 'image' | 'file' | 'schedule' | 'search';
  subtitle: string;
  fields: ToolField[];
  primaryAction: string;
  outputTitle: string;
};

const words = (tool: string) => tool.toLowerCase();

const roleFallback = (role: string, name: string, base: ToolUi): ToolUi => {
  const common = { ...base, subtitle: `Use ${name} in the ${role.replaceAll('_', ' ')} workspace.` };
  switch (role) {
    case 'sales':
      return { ...common, template: 'search', fields: [{ name: 'query', label: 'Customer / opportunity', type: 'text', required: true, placeholder: 'Name, company, deal, or opportunity' }, { name: 'notes', label: 'Sales context', type: 'textarea', placeholder: 'Next step, need, or conversation notes…' }], primaryAction: 'Open sales workspace', outputTitle: 'Sales result' };
    case 'crm_customer_success':
      return { ...common, template: 'search', fields: [{ name: 'customer', label: 'Customer', type: 'text', required: true, placeholder: 'Customer name or ID' }, { name: 'query', label: 'Request / issue', type: 'textarea', placeholder: 'What do you need to find or resolve?' }], primaryAction: 'Find customer', outputTitle: 'Customer result' };
    case 'inventory_store':
      return { ...common, template: 'data', fields: [{ name: 'item', label: 'Item / SKU', type: 'text', required: true, placeholder: 'SKU or product name' }, { name: 'quantity', label: 'Quantity', type: 'number', placeholder: '0' }, { name: 'notes', label: 'Inventory context', type: 'textarea', placeholder: 'Location, movement, reorder note…' }], primaryAction: 'Process inventory', outputTitle: 'Inventory result' };
    case 'procurement_purchase':
      return { ...common, template: 'document', fields: [{ name: 'supplier', label: 'Supplier', type: 'text', placeholder: 'Supplier name' }, { name: 'request', label: 'Purchase request', type: 'textarea', required: true, placeholder: 'Items, quantities, specifications, delivery needs…' }, { name: 'format', label: 'Output', type: 'select', options: ['Purchase request', 'RFQ', 'Purchase order', 'Comparison'] }], primaryAction: 'Prepare procurement', outputTitle: 'Procurement result' };
    case 'hr_employee':
      return { ...common, template: 'schedule', fields: [{ name: 'employee', label: 'Employee', type: 'text', required: true, placeholder: 'Employee name or ID' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'details', label: 'HR action / note', type: 'textarea', placeholder: 'Attendance, leave, onboarding, review, or HR note…' }], primaryAction: 'Process HR record', outputTitle: 'HR result' };
    case 'student':
    case 'teacher':
      return { ...common, template: 'education', fields: [{ name: 'subject', label: 'Subject / class', type: 'text', required: true, placeholder: 'Subject, class, or course' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'details', label: 'Learning task', type: 'textarea', placeholder: 'Lesson, assignment, study plan, or assessment…' }], primaryAction: 'Process learning task', outputTitle: 'Learning result' };
    case 'marketing':
    case 'whatsapp_communication':
      return { ...common, template: 'communication', fields: [{ name: 'audience', label: 'Audience', type: 'text', required: true, placeholder: 'Customer segment, group, or contact' }, { name: 'message', label: 'Content', type: 'textarea', required: true, placeholder: 'Write the campaign or message…' }, { name: 'schedule', label: 'Schedule', type: 'text', placeholder: 'Optional date/time' }], primaryAction: 'Prepare campaign', outputTitle: 'Communication result' };
    case 'operations':
    case 'project_manager':
      return { ...common, template: 'schedule', fields: [{ name: 'workItem', label: 'Work item', type: 'text', required: true, placeholder: 'Task, milestone, or operational item' }, { name: 'date', label: 'Target date', type: 'date' }, { name: 'details', label: 'Plan / status', type: 'textarea', placeholder: 'Owner, dependency, status, or next action…' }], primaryAction: 'Update plan', outputTitle: 'Operations result' };
    case 'data_analyst':
      return { ...common, template: 'data', fields: [{ name: 'file', label: 'Data file', type: 'file' }, { name: 'question', label: 'Analysis question', type: 'textarea', required: true, placeholder: 'What should be measured, compared, cleaned, or explained?' }], primaryAction: 'Analyze data', outputTitle: 'Analysis result' };
    case 'developer':
    case 'it_technical':
      return { ...common, template: 'developer', fields: [{ name: 'input', label: 'Technical input', type: 'textarea', required: true, placeholder: 'Code, API request, log, query, config, or error…' }, { name: 'context', label: 'Context', type: 'textarea', placeholder: 'Environment, expected behavior, or constraints…' }], primaryAction: 'Run technical tool', outputTitle: 'Technical result' };
    case 'ecommerce':
      return { ...common, template: 'search', fields: [{ name: 'query', label: 'Product / order', type: 'text', required: true, placeholder: 'Product, order, customer, or SKU' }, { name: 'filters', label: 'Filters', type: 'text', placeholder: 'Status, channel, date, or category' }], primaryAction: 'Search commerce', outputTitle: 'Commerce result' };
    case 'home_family':
      return { ...common, template: 'schedule', fields: [{ name: 'item', label: 'Family / home item', type: 'text', required: true, placeholder: 'Task, appointment, bill, or household item' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'notes', label: 'Details', type: 'textarea', placeholder: 'Notes, people involved, or reminders…' }], primaryAction: 'Save plan', outputTitle: 'Home result' };
    case 'vehicle_travel':
      return { ...common, template: 'calculator', fields: [{ name: 'value1', label: 'Distance / amount', type: 'number', required: true, placeholder: '0' }, { name: 'value2', label: 'Rate / mileage', type: 'number', placeholder: '0' }, { name: 'unit', label: 'Unit', type: 'text', placeholder: 'km, km/L, ₹/L, etc.' }], primaryAction: 'Calculate travel', outputTitle: 'Travel result' };
    case 'office_documents_ai':
      return { ...common, template: 'document', fields: [{ name: 'title', label: 'Document', type: 'text', required: true, placeholder: name }, { name: 'content', label: 'Content / instructions', type: 'textarea', placeholder: 'Paste content or describe the document task…' }, { name: 'format', label: 'Format', type: 'select', options: ['PDF', 'DOCX', 'TXT', 'Markdown'] }], primaryAction: 'Process document', outputTitle: 'Document result' };
    case 'finance_accountant':
    case 'billing_ar':
    case 'india_gst':
    case 'us_tax':
      return { ...common, template: 'finance', fields: [{ name: 'party', label: 'Party / account', type: 'text', placeholder: 'Customer, supplier, or account' }, { name: 'amount', label: 'Amount', type: 'number', placeholder: '0' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'details', label: 'Transaction / tax context', type: 'textarea', placeholder: 'Details, period, tax treatment, or notes…' }], primaryAction: 'Process finance task', outputTitle: 'Finance result' };
    case 'business_owner':
      return { ...common, template: 'finance', fields: [{ name: 'topic', label: 'Business item', type: 'text', required: true, placeholder: 'Customer, expense, supplier, KPI, or decision' }, { name: 'amount', label: 'Amount', type: 'number', placeholder: 'Optional' }, { name: 'details', label: 'Business context', type: 'textarea', placeholder: 'What should OopsMCP calculate, record, or prepare?' }], primaryAction: 'Process business task', outputTitle: 'Business result' };
    case 'freelancer':
      return { ...common, template: 'schedule', fields: [{ name: 'client', label: 'Client / project', type: 'text', required: true, placeholder: 'Client or project' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'details', label: 'Work / billing context', type: 'textarea', placeholder: 'Deliverable, hours, invoice, proposal, or follow-up…' }], primaryAction: 'Process freelance task', outputTitle: 'Freelance result' };
    case 'personal_user':
      return { ...common, template: 'schedule', fields: [{ name: 'item', label: 'Personal item', type: 'text', required: true, placeholder: 'Task, reminder, appointment, or note' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'details', label: 'Details', type: 'textarea', placeholder: 'What do you want to organize or track?' }], primaryAction: 'Save personal item', outputTitle: 'Personal result' };
    default:
      return common;
  }
};

export function getToolUi(name: string, role: string): ToolUi {
  const n = words(name);
  const base: ToolUi = {
    template: 'form',
    subtitle: `Use ${name} directly in OopsMCP.`,
    fields: [{ name: 'input', label: 'Input', type: 'textarea', placeholder: `Enter what you want ${name} to work with…`, required: true }],
    primaryAction: 'Run tool',
    outputTitle: 'Result',
  };

  if (/calculator|converter|counter|percentage|interest|loan|emi|tax|profit|break-even|margin|ratio|salary|fuel cost|electricity cost|bmi|age|distance|mileage|storage|size/i.test(n)) {
    return { ...base, template: 'calculator', subtitle: `Enter values and calculate with ${name}.`, fields: [{ name: 'value1', label: 'Value', type: 'number', placeholder: '0', required: true }, { name: 'value2', label: 'Second value', type: 'number', placeholder: '0' }, { name: 'unit', label: 'Unit / type', type: 'text', placeholder: 'Optional' }], primaryAction: 'Calculate', outputTitle: 'Calculation' };
  }
  if (/excel|csv|spreadsheet|pivot|data cleaner|data validator|data transformer|chart|analyzer|forecast|trend|duplicate|column mapper/i.test(n)) {
    return { ...base, template: 'data', subtitle: `Upload or describe the data for ${name}.`, fields: [{ name: 'file', label: 'Data file', type: 'file' }, { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'What should OopsMCP do with this data?' }], primaryAction: 'Analyze data', outputTitle: 'Data result' };
  }
  if (/pdf|document|doc|report|presentation|contract|agreement|invoice|quotation|purchase order|sales order|credit note|debit note|payslip|certificate|form|template|letter|policy|statement/i.test(n)) {
    return { ...base, template: 'document', subtitle: `Create, inspect, or transform a document with ${name}.`, fields: [{ name: 'title', label: 'Title', type: 'text', placeholder: name }, { name: 'content', label: 'Content / instructions', type: 'textarea', placeholder: 'Enter text, requirements, or source content…' }, { name: 'format', label: 'Format', type: 'select', options: ['PDF', 'DOCX', 'TXT', 'Markdown'] }], primaryAction: 'Process document', outputTitle: 'Document result' };
  }
  if (/image|ocr|barcode|qr|thumbnail|crop|rotate|flip|grayscale|metadata|exif/i.test(n)) {
    return { ...base, template: 'image', subtitle: `Work with an image using ${name}.`, fields: [{ name: 'file', label: 'Image', type: 'file', required: true }, { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'Optional image instructions…' }], primaryAction: 'Process image', outputTitle: 'Image result' };
  }
  if (/whatsapp|email|sms|message|communication|newsletter|social|campaign|notification|quick repl|greeting|away message|customer communication/i.test(n)) {
    return { ...base, template: 'communication', subtitle: `Compose or configure communications with ${name}.`, fields: [{ name: 'recipient', label: 'Recipient / audience', type: 'text', placeholder: 'Name, number, group, or segment' }, { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Write the message…', required: true }, { name: 'schedule', label: 'Schedule', type: 'text', placeholder: 'Optional date/time' }], primaryAction: 'Prepare message', outputTitle: 'Communication preview' };
  }
  if (/ledger|book|finance|account|invoice|payment|receivable|payable|cash flow|budget|expense|income|financial|bank|gst|tax|tds|balance sheet|profit|loss|credit|debit/i.test(n)) {
    return { ...base, template: 'finance', subtitle: `Record or analyze financial information with ${name}.`, fields: [{ name: 'party', label: 'Customer / supplier / account', type: 'text', placeholder: 'Optional' }, { name: 'amount', label: 'Amount', type: 'number', placeholder: '0' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Details…' }], primaryAction: 'Process finance entry', outputTitle: 'Financial result' };
  }
  if (/student|class|course|assignment|exam|grade|attendance|study|fee|lesson|quiz|flashcard|teacher|school|timetable|homework/i.test(n)) {
    return { ...base, template: 'education', subtitle: `Manage learning information with ${name}.`, fields: [{ name: 'student', label: 'Student / class', type: 'text', placeholder: 'Name or class' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'details', label: 'Details', type: 'textarea', placeholder: 'Enter assignment, exam, lesson, or study details…' }], primaryAction: 'Save education record', outputTitle: 'Education result' };
  }
  if (/api|json|xml|yaml|regex|jwt|base64|uuid|cron|sql|code|log|environment|hash|checksum|github|gitlab|webhook/i.test(n)) {
    return { ...base, template: 'developer', subtitle: `Developer workspace for ${name}.`, fields: [{ name: 'input', label: 'Input', type: 'textarea', placeholder: 'Paste code, JSON, request, log, query, or value…', required: true }, { name: 'options', label: 'Options', type: 'text', placeholder: 'Optional settings' }], primaryAction: 'Run developer tool', outputTitle: 'Developer result' };
  }
  if (/calendar|reminder|alarm|schedule|planner|appointment|meeting|timesheet|milestone|deadline|follow-up|tracker|todo|task|checklist/i.test(n)) {
    return { ...base, template: 'schedule', subtitle: `Plan, track, or schedule work with ${name}.`, fields: [{ name: 'title', label: 'Title', type: 'text', placeholder: name, required: true }, { name: 'date', label: 'Date', type: 'date' }, { name: 'time', label: 'Time', type: 'time' }, { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Details…' }], primaryAction: 'Save', outputTitle: 'Saved result' };
  }
  if (/search|lookup|finder|directory|contacts|customer|lead|supplier|vendor|product|catalogue|portfolio/i.test(n)) {
    return { ...base, template: 'search', subtitle: `Find and manage records with ${name}.`, fields: [{ name: 'query', label: 'Search', type: 'text', placeholder: 'Search…', required: true }, { name: 'filters', label: 'Filters', type: 'text', placeholder: 'Optional filters' }], primaryAction: 'Search', outputTitle: 'Matches' };
  }
  return roleFallback(role, name, base);
}
