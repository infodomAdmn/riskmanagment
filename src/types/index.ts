export type RiskType = 'Strategic' | 'Operational' | 'Financial' | 'Compliance' | 'Reputational' | 'Other';

export interface Risk {
    id: string;
    name: string;
    description: string;
    type: RiskType;
    cause: string;
    financialEstimate: number; // Financijska procjena
    prescribedSanction?: string; // Propisana sankcija
    reputationalRisk: boolean; // DA/NE
    complianceRisk: boolean; // DA/NE

    // Relations IDs
    processId?: string;
    goalId?: string;
    projectId?: string;
    assetId?: string;
    regulationId?: string;
}

export interface RiskAssessment {
    id: string;
    riskId: string;
    periodFrom: string; // ISO Date
    periodTo: string; // ISO Date
    probability: number; // 1-5 or similar scale
    impact: number; // 1-5 or similar scale
    riskLevel: number; // probability * impact
}

export type MeasureStatus = 'Planned' | 'In Progress' | 'Implemented' | 'Delayed' | 'Cancelled';

export interface MitigationMeasure {
    id: string;
    name: string;
    description: string;
    riskId: string;
    ownerEmployeeId?: string;
    ownerOrgUnitId?: string;
    deadline: string; // Date
    controlDescription: string;
    frequency?: string;
    documentationMethod: string;
    status: MeasureStatus;
}

export interface Incident {
    id: string;
    riskId: string;
    dateFrom: string;
    dateTo: string;
    eventDescription: string;
    consequenceDescription: string;
    financialConsequence: number;
}

export type IrregularityStatus = 'Reported' | 'Under Investigation' | 'Resolved' | 'Closed';

export interface Irregularity {
    id: string;
    reportedBy: string; // Text field
    dateFrom: string;
    dateTo: string;
    status: IrregularityStatus;
    receivedBy: string;
    description: string;
}

export interface IrregularityMeasure {
    id: string;
    irregularityId: string; // Assuming link to irregularity
    description: string;
    personInChargeId: string;
    orgUnitInChargeId: string;
    type: string;
    externalBody?: string;
}

export type ProcessType = 'Process' | 'Subprocess' | 'Activity';

export interface BusinessProcess {
    id: string;
    type: ProcessType;
    name: string;
    parentProcessId?: string;
    ownerOrgUnitId: string;
    ownerEmployeeId?: string;
}

export type ProjectStatus = 'Planned' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';

export interface Project {
    id: string;
    code: string; // Oznaka projekta
    name: string;
    projectManagerId: string;
    type: string;
    durationFrom: string;
    durationTo: string;
    status: ProjectStatus;
}

export interface Asset {
    id: string;
    name: string;
    type: string;
    value: number;
    status: string;
    orgUnitId?: string;
}

export interface Authority {
    id: string;
    name: string;
    status: string;
    type: string; // List of values, classification
}

export interface AuthorityHolder {
    id: string;
    employeeId: string;
    authorityId: string;
    dateFrom: string;
    dateTo?: string;
    note: string;
    assignedBy: string; // Person or Body
}

export interface Regulation {
    id: string;
    name: string;
    status: string;
    effectiveDate: string;
    issuingBody: string;
    classification: string;
}

export interface Plan {
    id: string;
    name: string;
    type: string;
    adoptingBody: string;
    period: string; // Could be a year or range
    status: string;
}

export interface Goal {
    id: string;
    name: string;
    planId: string;
    measure: string;
    value: string; // Target value
}

export interface GlossaryTerm {
    id: string;
    term: string;
    explanation: string;
}

// MDM
export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    orgUnitId: string;
}

export interface OrgUnit {
    id: string;
    name: string;
    parentId?: string;
}

// Canvas Builder Types
export type CanvasNodeType = 'risk' | 'process' | 'asset' | 'measure' | 'incident' | 'regulation';

export interface CanvasNodeData {
    label: string;
    type: CanvasNodeType;
    entityData?: Risk | BusinessProcess | Asset | MitigationMeasure | Incident | Regulation;
}

export interface CanvasNode {
    id: string;
    type: CanvasNodeType;
    position: { x: number; y: number };
    data: CanvasNodeData;
}

export interface CanvasEdge {
    id: string;
    source: string;
    target: string;
    type?: string;
    label?: string;
}

export interface CanvasState {
    id?: string;
    nodes: CanvasNode[];
    edges: CanvasEdge[];
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SimulationState {
    isRunning: boolean;
    speed: number;
    currentStep: number;
    affectedNodes: Set<string>;
    riskPath: string[];
    impactLevel: Map<string, number>;
}
