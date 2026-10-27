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
    return { ...base, template: 'calculator', subtitle: `Enter values and calculate with ${name}.`, fields: [
      { name: 'value1', label: 'Value', type: 'number', placeholder: '0', required: true },
      { name: 'value2', label: 'Second value', type: 'number', placeholder: '0' },
      { name: 'unit', label: 'Unit / type', type: 'text', placeholder: 'Optional' },
    ], primaryAction: 'Calculate', outputTitle: 'Calculation' };
  }
  if (/excel|csv|spreadsheet|pivot|data cleaner|data validator|data transformer|chart|analyzer|forecast|trend|duplicate|column mapper/i.test(n)) {
    return { ...base, template: 'data', subtitle: `Upload or describe the data for ${name}.`, fields: [
      { name: 'file', label: 'Data file', type: 'file' },
      { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'What should OopsMCP do with this data?' },
    ], primaryAction: 'Analyze data', outputTitle: 'Data result' };
  }
  if (/pdf|document|doc|report|presentation|contract|agreement|invoice|quotation|purchase order|sales order|credit note|debit note|payslip|certificate|form|template|letter|policy|statement/i.test(n)) {
    return { ...base, template: 'document', subtitle: `Create, inspect, or transform a document with ${name}.`, fields: [
      { name: 'title', label: 'Title', type: 'text', placeholder: name },
      { name: 'content', label: 'Content / instructions', type: 'textarea', placeholder: 'Enter text, requirements, or source content…' },
      { name: 'format', label: 'Format', type: 'select', options: ['PDF', 'DOCX', 'TXT', 'Markdown'] },
    ], primaryAction: 'Process document', outputTitle: 'Document result' };
  }
  if (/image|ocr|barcode|qr|thumbnail|crop|rotate|flip|grayscale|metadata|exif/i.test(n)) {
    return { ...base, template: 'image', subtitle: `Work with an image using ${name}.`, fields: [
      { name: 'file', label: 'Image', type: 'file', required: true },
      { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'Optional image instructions…' },
    ], primaryAction: 'Process image', outputTitle: 'Image result' };
  }
  if (/whatsapp|email|sms|message|communication|newsletter|social|campaign|notification|quick repl|greeting|away message|customer communication/i.test(n)) {
    return { ...base, template: 'communication', subtitle: `Compose or configure communications with ${name}.`, fields: [
      { name: 'recipient', label: 'Recipient / audience', type: 'text', placeholder: 'Name, number, group, or segment' },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Write the message…', required: true },
      { name: 'schedule', label: 'Schedule', type: 'text', placeholder: 'Optional date/time' },
    ], primaryAction: 'Prepare message', outputTitle: 'Communication preview' };
  }
  if (/ledger|book|finance|account|invoice|payment|receivable|payable|cash flow|budget|expense|income|financial|bank|gst|tax|tds|balance sheet|profit|loss|credit|debit/i.test(n)) {
    return { ...base, template: 'finance', subtitle: `Record or analyze financial information with ${name}.`, fields: [
      { name: 'party', label: 'Customer / supplier / account', type: 'text', placeholder: 'Optional' },
      { name: 'amount', label: 'Amount', type: 'number', placeholder: '0' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Details…' },
    ], primaryAction: 'Process finance entry', outputTitle: 'Financial result' };
  }
  if (/student|class|course|assignment|exam|grade|attendance|study|fee|lesson|quiz|flashcard|teacher|school|timetable|homework/i.test(n)) {
    return { ...base, template: 'education', subtitle: `Manage learning information with ${name}.`, fields: [
      { name: 'student', label: 'Student / class', type: 'text', placeholder: 'Name or class' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'details', label: 'Details', type: 'textarea', placeholder: 'Enter assignment, exam, lesson, or study details…' },
    ], primaryAction: 'Save education record', outputTitle: 'Education result' };
  }
  if (/api|json|xml|yaml|regex|jwt|base64|uuid|cron|sql|code|log|environment|hash|checksum|github|gitlab|webhook/i.test(n)) {
    return { ...base, template: 'developer', subtitle: `Developer workspace for ${name}.`, fields: [
      { name: 'input', label: 'Input', type: 'textarea', placeholder: 'Paste code, JSON, request, log, query, or value…', required: true },
      { name: 'options', label: 'Options', type: 'text', placeholder: 'Optional settings' },
    ], primaryAction: 'Run developer tool', outputTitle: 'Developer result' };
  }
  if (/calendar|reminder|alarm|schedule|planner|appointment|meeting|timesheet|milestone|deadline|follow-up|tracker|todo|task|checklist/i.test(n)) {
    return { ...base, template: 'schedule', subtitle: `Plan, track, or schedule work with ${name}.`, fields: [
      { name: 'title', label: 'Title', type: 'text', placeholder: name, required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'time', label: 'Time', type: 'time' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Details…' },
    ], primaryAction: 'Save', outputTitle: 'Saved result' };
  }
  if (/search|lookup|finder|directory|contacts|customer|lead|supplier|vendor|product|catalogue|portfolio/i.test(n)) {
    return { ...base, template: 'search', subtitle: `Find and manage records with ${name}.`, fields: [
      { name: 'query', label: 'Search', type: 'text', placeholder: 'Search…', required: true },
      { name: 'filters', label: 'Filters', type: 'text', placeholder: 'Optional filters' },
    ], primaryAction: 'Search', outputTitle: 'Matches' };
  }
  return base;
}