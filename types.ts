
export interface EntityAttribute {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validations: string;
  source: string;
}

export interface Entity {
  id: string;
  name: string;
  attributes: EntityAttribute[];
}

export interface Flow {
  id: string;
  trigger: string;
  condition: string;
  action: string;
  result: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  modules: string;
  restrictions: string;
}

export interface LegacyData {
  id: string;
  source: string;
  format: string;
  quality: number;
  action: string;
}

export interface Indicator {
  id: string;
  name: string;
  formula: string;
}

export interface DiscoveryData {
  id: string; // Unique ID for DB
  submissionDate?: string; // When it was sent
  status: 'draft' | 'submitted' | 'reviewed';
  
  // 1. Vision
  projectName: string;
  problem: string;
  mvpObjective: string;
  users: string;
  kpis: string;
  
  // 2. Architecture
  entities: Entity[];

  // 3. Flows
  flows: Flow[];

  // 4. Roles
  roles: Role[];

  // 5. Technical
  connectivity: string; // 'online', 'offline-first'
  devices: string[];
  volume: string;
  integrations: string; // 'none', 'yes'
  visualIdentity: string; // 'yes', 'no'
  
  // 5b. Ecosystem & Automation (New)
  ecosystemPreference: string; // 'google', 'microsoft', 'other', 'none'
  automationNeeds: string[]; // 'email', 'calendar', 'documents', 'storage'

  // 6. Migration
  legacyData: LegacyData[];

  // 7. Dashboard & Analytics
  indicators: Indicator[];
  analyticsLevel: string; // 'operational', 'bi', 'predictive'
  preferredBiTool: string; // 'looker', 'powerbi', 'custom'
  
  // Notes
  additionalNotes: string;
}

export const INITIAL_DATA: DiscoveryData = {
  id: '', // Will be generated on init
  status: 'draft',
  projectName: '',
  problem: '',
  mvpObjective: '',
  users: '',
  kpis: '',
  entities: [],
  flows: [],
  roles: [],
  connectivity: 'online',
  devices: [],
  volume: '',
  integrations: 'none',
  visualIdentity: 'no',
  ecosystemPreference: 'none',
  automationNeeds: [],
  legacyData: [],
  indicators: [
    { id: '1', name: '', formula: '' },
    { id: '2', name: '', formula: '' },
    { id: '3', name: '', formula: '' },
  ],
  analyticsLevel: 'operational',
  preferredBiTool: '',
  additionalNotes: ''
};

export const STEPS = [
  "Visión y Alcance",
  "Arquitectura de Datos",
  "Flujos y Lógica",
  "Roles y Seguridad",
  "Técnico y Ecosistema",
  "Migración y BI",
  "Finalizar y Enviar"
];
