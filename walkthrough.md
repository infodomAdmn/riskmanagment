# Risk Management System Walkthrough

I have created a complete React TypeScript application for the Risk Management System ("Sustav za upravljanje rizicima").

## Features Implemented

- **Tech Stack**: React, TypeScript, Vite, Recharts, CSS Modules.
- **Design**: Modern, premium aesthetic with responsive layout and data visualization.
- **Navigation**: Full sidebar navigation with icons for all registries.
- **Data Layer**: Comprehensive mock data service (`src/services/mockData.ts`) covering all entities.

## Pages & Functionality

1.  **Dashboard**: 
    - Key metrics summary cards.
    - Interactive charts (Pie Chart for Risk Types, Bar Chart for Top Risks).
2.  **Risk Register**: Detailed table of risks with financial estimates and classifications.
3.  **Risk Assessments**: History of risk assessments with visual risk level indicators.
4.  **Mitigation Measures**: Tracking of measures, deadlines, and status.
5.  **Incidents**: Registry of realized risks and financial consequences.
6.  **Irregularities**: Reporting and tracking of irregularities.
7.  **Business Processes**: Catalog of processes and owners.
8.  **Projects**: Project portfolio status and timelines.
9.  **Assets**: Asset registry with value tracking.
10. **Authorities**: Management of authorities and assignments.
11. **Regulations**: Compliance tracking.
12. **Plans & Goals**: Strategic planning and goal monitoring.
13. **Glossary**: System definitions.

## Project Structure

- `src/components`: Reusable UI components (`Table`, etc.).
- `src/layout`: Main application layout.
- `src/pages`: Individual page components for each registry.
- `src/services`: Mock data and API abstraction.
- `src/styles`: Global variables and theming.
- `src/types`: TypeScript definitions for all 16+ entities.

## How to Run

1.  Open the terminal in `c:\dev\Upravljanje rizicima`.
2.  Run `npm install` (if not already done).
3.  Run `npm run dev` to start the development server.
4.  Open the URL shown in the terminal (usually `http://localhost:5173`).
