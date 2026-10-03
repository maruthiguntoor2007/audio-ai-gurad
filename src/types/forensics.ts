export type TabId = 'dashboard' | 'timeline' | 'model-lab' | 'case-logs';

export type ViewMode = 'forensic' | 'simplified';

export type ScenarioType = 'synthetic' | 'genuine' | 'noisy';

export interface AnomalyMarker {
  id: string;
  name: string;
  code: string;
  timeRange: string;
  startSec: number;
  endSec: number;
  severity: number;
  severityLabel: string;
  frameRange: string;
  description: string;
  mathematicalProof: string;
  color: string;
}

export interface MetricSignature {
  name: string;
  level: string;
  score: number;
  description: string;
  color: string;
}

export interface IncidentRecord {
  id: string;
  fileName: string;
  category: 'deepfake' | 'genuine' | 'flagged';
  verdict: string;
  confidence: number;
  timestamp: string;
  duration: string;
  details: string;
  node: string;
  technicalTag: string;
  keyFinding: string;
}

export interface ModelTelemetry {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  confidence: number;
  status: string;
  latency: string;
  detail: string;
  boundaryTrigger: string;
  weight: number;
  color: string;
}

export interface ScenarioData {
  id: ScenarioType;
  title: string;
  tagLabel: string;
  fileName: string;
  spec: string;
  duration: number;
  verdictTitle: string;
  verdictSubtitle: string;
  simplifiedTitle: string;
  simplifiedSubtitle: string;
  confidence: number;
  statusType: 'critical' | 'authentic' | 'warning';
  classificationClass: string;
  findings: Array<{
    title: string;
    description: string;
    icon: string;
    type: 'error' | 'warning' | 'tertiary';
  }>;
  simplifiedFindings: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  anomalies: AnomalyMarker[];
  signatures: MetricSignature[];
}

export interface AnalystUser {
  name: string;
  role: string;
  department: string;
  email: string;
  badgeId: string;
  clearance: string;
}
