
export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  INFO = 'INFO'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  service: string;
  message: string;
  severity: Severity;
  raw: string;
  metadata?: Record<string, any>;
}

export interface ThreatAnalysis {
  summary: string;
  detectedTTPs: {
    id: string;
    name: string;
    description: string;
  }[];
  recommendations: string[];
  riskScore: number;
}

export interface Stats {
  totalLogs: number;
  criticalAlerts: number;
  uniqueSources: number;
  anomaliesDetected: number;
}

export type View = 'dashboard' | 'explorer' | 'analysis' | 'ingest' | 'reports';
