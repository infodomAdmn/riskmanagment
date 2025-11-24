import * as mock from './mockData';
import type {
    Risk, RiskAssessment, MitigationMeasure, Incident, Irregularity,
    BusinessProcess, Project, Asset, Authority, AuthorityHolder,
    Regulation, Plan, Goal, GlossaryTerm, Employee, OrgUnit
} from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    getRisks: async (): Promise<Risk[]> => { await delay(300); return mock.mockRisks; },
    getRiskAssessments: async (): Promise<RiskAssessment[]> => { await delay(300); return mock.mockRiskAssessments; },
    getMitigationMeasures: async (): Promise<MitigationMeasure[]> => { await delay(300); return mock.mockMitigationMeasures; },
    getIncidents: async (): Promise<Incident[]> => { await delay(300); return mock.mockIncidents; },
    getIrregularities: async (): Promise<Irregularity[]> => { await delay(300); return mock.mockIrregularities; },
    getProcesses: async (): Promise<BusinessProcess[]> => { await delay(300); return mock.mockProcesses; },
    getProjects: async (): Promise<Project[]> => { await delay(300); return mock.mockProjects; },
    getAssets: async (): Promise<Asset[]> => { await delay(300); return mock.mockAssets; },
    getAuthorities: async (): Promise<Authority[]> => { await delay(300); return mock.mockAuthorities; },
    getAuthorityHolders: async (): Promise<AuthorityHolder[]> => { await delay(300); return mock.mockAuthorityHolders; },
    getRegulations: async (): Promise<Regulation[]> => { await delay(300); return mock.mockRegulations; },
    getPlans: async (): Promise<Plan[]> => { await delay(300); return mock.mockPlans; },
    getGoals: async (): Promise<Goal[]> => { await delay(300); return mock.mockGoals; },
    getGlossary: async (): Promise<GlossaryTerm[]> => { await delay(300); return mock.mockGlossary; },
    getEmployees: async (): Promise<Employee[]> => { await delay(300); return mock.mockEmployees; },
    getOrgUnits: async (): Promise<OrgUnit[]> => { await delay(300); return mock.mockOrgUnits; }
};
