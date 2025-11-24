import type {
    Risk, RiskAssessment, MitigationMeasure, Incident, Irregularity,
    BusinessProcess, Project, Asset, Authority, AuthorityHolder,
    Regulation, Plan, Goal, GlossaryTerm, Employee, OrgUnit
} from '../types';

export const mockOrgUnits: OrgUnit[] = [
    { id: 'ou1', name: 'Uprava' },
    { id: 'ou2', name: 'Financije', parentId: 'ou1' },
    { id: 'ou3', name: 'IT Sektor', parentId: 'ou1' },
    { id: 'ou4', name: 'Ljudski resursi', parentId: 'ou1' },
    { id: 'ou5', name: 'Prodaja', parentId: 'ou1' },
    { id: 'ou6', name: 'Nabava', parentId: 'ou1' },
];

export const mockEmployees: Employee[] = [
    { id: 'emp1', firstName: 'Ivan', lastName: 'Horvat', email: 'ivan.horvat@risk.hr', position: 'Direktor', orgUnitId: 'ou1' },
    { id: 'emp2', firstName: 'Ana', lastName: 'Novak', email: 'ana.novak@risk.hr', position: 'Voditelj IT', orgUnitId: 'ou3' },
    { id: 'emp3', firstName: 'Marko', lastName: 'Marić', email: 'marko.maric@risk.hr', position: 'Analitičar rizika', orgUnitId: 'ou2' },
    { id: 'emp4', firstName: 'Petra', lastName: 'Kovač', email: 'petra.kovac@risk.hr', position: 'Voditelj HR', orgUnitId: 'ou4' },
    { id: 'emp5', firstName: 'Tomislav', lastName: 'Babić', email: 'tomislav.babic@risk.hr', position: 'Službenik za zaštitu podataka', orgUnitId: 'ou1' },
];

export const mockRisks: Risk[] = [
    {
        id: 'r1',
        name: 'Gubitak ključnih podataka',
        description: 'Rizik od gubitka podataka uslijed kvara sustava, ljudske pogreške ili kibernetičkog napada.',
        type: 'Operational',
        cause: 'Nedostatak adekvatnog backup rješenja i disaster recovery plana.',
        financialEstimate: 50000,
        reputationalRisk: true,
        complianceRisk: true,
        processId: 'p1',
        assetId: 'a1'
    },
    {
        id: 'r2',
        name: 'Promjena zakonske regulative (GDPR)',
        description: 'Rizik od neusklađenosti s novim smjernicama AZOP-a.',
        type: 'Compliance',
        cause: 'Česte izmjene tumačenja propisa.',
        financialEstimate: 20000,
        reputationalRisk: true,
        complianceRisk: true,
        regulationId: 'reg1'
    },
    {
        id: 'r3',
        name: 'Odljev ključnih zaposlenika',
        description: 'Rizik od odlaska senior inženjera i menadžmenta.',
        type: 'Strategic',
        cause: 'Nekonkurentna primanja u odnosu na tržište.',
        financialEstimate: 100000,
        reputationalRisk: false,
        complianceRisk: false,
        processId: 'p2'
    },
    {
        id: 'r4',
        name: 'Valutni rizik',
        description: 'Gubitak vrijednosti zbog promjene tečaja USD/EUR.',
        type: 'Financial',
        cause: 'Nestabilnost na globalnim tržištima.',
        financialEstimate: 15000,
        reputationalRisk: false,
        complianceRisk: false
    }
];

export const mockRiskAssessments: RiskAssessment[] = [
    {
        id: 'ra1',
        riskId: 'r1',
        periodFrom: '2025-01-01',
        periodTo: '2025-12-31',
        probability: 3,
        impact: 5,
        riskLevel: 15
    },
    {
        id: 'ra2',
        riskId: 'r2',
        periodFrom: '2025-01-01',
        periodTo: '2025-06-30',
        probability: 2,
        impact: 4,
        riskLevel: 8
    },
    {
        id: 'ra3',
        riskId: 'r3',
        periodFrom: '2025-01-01',
        periodTo: '2025-12-31',
        probability: 4,
        impact: 4,
        riskLevel: 16
    }
];

export const mockMitigationMeasures: MitigationMeasure[] = [
    {
        id: 'm1',
        name: 'Implementacija off-site backupa',
        description: 'Uvođenje dnevnog backupa na udaljenu lokaciju u oblaku.',
        riskId: 'r1',
        ownerEmployeeId: 'emp2',
        deadline: '2025-03-01',
        controlDescription: 'Mjesečna provjera restore procedure (testno vraćanje podataka).',
        documentationMethod: 'Logovi backup sustava i izvještaj o testiranju.',
        status: 'In Progress'
    },
    {
        id: 'm2',
        name: 'Revizija plaća i benefita',
        description: 'Analiza tržišta i korekcija plaća za ključne pozicije.',
        riskId: 'r3',
        ownerEmployeeId: 'emp4',
        deadline: '2025-04-01',
        controlDescription: 'Usporedba s industrijskim prosjekom.',
        documentationMethod: 'Odluka Uprave o novim platnim razredima.',
        status: 'Planned'
    },
    {
        id: 'm3',
        name: 'Edukacija o GDPR-u',
        description: 'Redovita edukacija svih zaposlenika o zaštiti podataka.',
        riskId: 'r2',
        ownerEmployeeId: 'emp5',
        deadline: '2025-02-15',
        controlDescription: 'Potpisne liste s edukacije.',
        documentationMethod: 'Certifikati o završenom tečaju.',
        status: 'Implemented'
    }
];

export const mockIncidents: Incident[] = [
    {
        id: 'inc1',
        riskId: 'r1',
        dateFrom: '2024-11-10',
        dateTo: '2024-11-10',
        eventDescription: 'Kratkotrajni ispad servera za e-poštu.',
        consequenceDescription: 'Nemogućnost komunikacije 2 sata.',
        financialConsequence: 500
    },
    {
        id: 'inc2',
        riskId: 'r3',
        dateFrom: '2024-10-01',
        dateTo: '2024-10-01',
        eventDescription: 'Otkaz Senior Developera.',
        consequenceDescription: 'Kašnjenje na projektu PRJ-001.',
        financialConsequence: 5000
    }
];

export const mockIrregularities: Irregularity[] = [
    {
        id: 'irr1',
        reportedBy: 'Anonimno',
        dateFrom: '2024-12-01',
        dateTo: '2024-12-05',
        status: 'Under Investigation',
        receivedBy: 'Tomislav Babić',
        description: 'Sumnja na sukob interesa u nabavi uredskog materijala.'
    }
];

export const mockProcesses: BusinessProcess[] = [
    { id: 'p1', type: 'Process', name: 'Upravljanje IT sustavima', ownerOrgUnitId: 'ou3', ownerEmployeeId: 'emp2' },
    { id: 'p2', type: 'Process', name: 'Upravljanje ljudskim potencijalima', ownerOrgUnitId: 'ou4', ownerEmployeeId: 'emp4' },
    { id: 'p3', type: 'Subprocess', name: 'Regrutacija i selekcija', parentProcessId: 'p2', ownerOrgUnitId: 'ou4' },
    { id: 'p4', type: 'Process', name: 'Prodajni proces', ownerOrgUnitId: 'ou5' }
];

export const mockProjects: Project[] = [
    {
        id: 'prj1',
        code: 'PRJ-001',
        name: 'Migracija u oblak',
        projectManagerId: 'emp2',
        type: 'IT',
        durationFrom: '2025-01-01',
        durationTo: '2025-06-01',
        status: 'Active'
    },
    {
        id: 'prj2',
        code: 'PRJ-002',
        name: 'Implementacija ISO 27001',
        projectManagerId: 'emp5',
        type: 'Compliance',
        durationFrom: '2025-02-01',
        durationTo: '2025-12-31',
        status: 'Planned'
    }
];

export const mockAssets: Asset[] = [
    { id: 'a1', name: 'Server soba', type: 'Physical', value: 100000, status: 'Active', orgUnitId: 'ou3' },
    { id: 'a2', name: 'CRM Licenca', type: 'Software', value: 25000, status: 'Active', orgUnitId: 'ou5' },
    { id: 'a3', name: 'Službena vozila', type: 'Physical', value: 150000, status: 'Active', orgUnitId: 'ou1' }
];

export const mockAuthorities: Authority[] = [
    { id: 'auth1', name: 'Potpisivanje ugovora do 10.000 EUR', status: 'Active', type: 'Financijska' },
    { id: 'auth2', name: 'Odobravanje godišnjih odmora', status: 'Active', type: 'Upravljačka' }
];

export const mockAuthorityHolders: AuthorityHolder[] = [
    { id: 'ah1', employeeId: 'emp2', authorityId: 'auth2', dateFrom: '2024-01-01', note: 'Za IT odjel', assignedBy: 'Uprava' }
];

export const mockRegulations: Regulation[] = [
    { id: 'reg1', name: 'Zakon o zaštiti osobnih podataka', status: 'Active', effectiveDate: '2018-05-25', issuingBody: 'EU Parlament', classification: 'Zakon' },
    { id: 'reg2', name: 'Zakon o radu', status: 'Active', effectiveDate: '2023-01-01', issuingBody: 'Sabor RH', classification: 'Zakon' }
];

export const mockPlans: Plan[] = [
    { id: 'pl1', name: 'Strateški plan 2025-2027', type: 'Strategic', adoptingBody: 'Uprava', period: '2025-2027', status: 'Adopted' },
    { id: 'pl2', name: 'Plan nabave 2025', type: 'Operational', adoptingBody: 'Uprava', period: '2025', status: 'Draft' }
];

export const mockGoals: Goal[] = [
    { id: 'g1', name: 'Smanjenje operativnih rizika za 10%', planId: 'pl1', measure: 'Broj incidenata', value: '< 5 godišnje' },
    { id: 'g2', name: 'Povećanje zadovoljstva zaposlenika', planId: 'pl1', measure: 'Anketa zadovoljstva', value: '4.5/5' }
];

export const mockGlossary: GlossaryTerm[] = [
    { id: 't1', term: 'Rizik', explanation: 'Vjerojatnost nastanka štetnog događaja koji može negativno utjecati na postizanje ciljeva.' },
    { id: 't2', term: 'Rezidualni rizik', explanation: 'Rizik koji preostaje nakon primjene mjera ublažavanja.' },
    { id: 't3', term: 'Inherentni rizik', explanation: 'Rizik prije poduzimanja bilo kakvih mjera.' }
];
