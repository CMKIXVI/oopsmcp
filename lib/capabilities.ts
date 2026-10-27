export type RoleId = 'personal_user' | 'business_owner' | 'sales' | 'crm_customer_success' | 'finance_accountant' | 'inventory_store' | 'procurement_purchase' | 'billing_ar' | 'india_gst' | 'us_tax' | 'freelancer' | 'hr_employee' | 'student' | 'teacher' | 'marketing' | 'whatsapp_communication' | 'operations' | 'data_analyst' | 'developer' | 'it_technical' | 'project_manager' | 'ecommerce' | 'home_family' | 'vehicle_travel' | 'office_documents_ai';
export type Capability = { id: string; name: string; description: string; role: RoleId; category: string; };
import { rows as r1 } from './capability-data-1';
import { rows as r2 } from './capability-data-2';
import { rows as r3 } from './capability-data-3';
import { rows as r4 } from './capability-data-4';
const rows = [...r1, ...r2, ...r3, ...r4] as readonly [string, string, RoleId][];
export const capabilities: Capability[] = rows.map(([id, name, role]) => ({ id, name, description: `${name} capability for the ${role.replaceAll('_', ' ')} role. Execute or assist with this everyday business/personal task through OopsMCP.`, role, category: role }));
export const FUNCTIONAL_TOOL_COUNT = capabilities.length;