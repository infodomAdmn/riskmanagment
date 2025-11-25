import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { RiskMatrixPage } from './pages/RiskMatrixPage';
import { RiskCanvas } from './pages/RiskCanvas';
import { CanvasBuilder } from './pages/CanvasBuilder';
import { RiskRegister } from './pages/RiskRegister';
import { RiskAssessments } from './pages/RiskAssessments';
import { MitigationMeasures } from './pages/MitigationMeasures';
import { Incidents } from './pages/Incidents';
import { Irregularities } from './pages/Irregularities';
import { BusinessProcesses } from './pages/BusinessProcesses';
import { Projects } from './pages/Projects';
import { Assets } from './pages/Assets';
import { Authorities } from './pages/Authorities';
import { Regulations } from './pages/Regulations';
import { Plans } from './pages/Plans';
import { Glossary } from './pages/Glossary';
import './styles/variables.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="canvas" element={<RiskCanvas />} />
          <Route path="canvas-builder" element={<CanvasBuilder />} />
          <Route path="matrix" element={<RiskMatrixPage />} />
          <Route path="risks" element={<RiskRegister />} />
          <Route path="assessments" element={<RiskAssessments />} />
          <Route path="measures" element={<MitigationMeasures />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="irregularities" element={<Irregularities />} />
          <Route path="processes" element={<BusinessProcesses />} />
          <Route path="projects" element={<Projects />} />
          <Route path="assets" element={<Assets />} />
          <Route path="authorities" element={<Authorities />} />
          <Route path="regulations" element={<Regulations />} />
          <Route path="plans" element={<Plans />} />
          <Route path="glossary" element={<Glossary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
