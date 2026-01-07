
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LogExplorer from './components/LogExplorer';
import IngestPanel from './components/IngestPanel';
import ThreatAnalysisView from './components/ThreatAnalysisView';
import { LogEntry, Stats, Severity, View } from './types';
import { parseRawLogs } from './utils/logParser';
import { MOCK_LOGS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLogs: 0,
    criticalAlerts: 0,
    uniqueSources: 0,
    anomaliesDetected: 0,
  });

  // Load initial mock logs
  useEffect(() => {
    const initialLogs = parseRawLogs(MOCK_LOGS);
    setLogs(initialLogs);
  }, []);

  // Update stats whenever logs change
  useEffect(() => {
    const uniqueSources = new Set(logs.map(l => l.source)).size;
    const criticals = logs.filter(l => l.severity === Severity.CRITICAL).length;
    const highRisk = logs.filter(l => l.severity === Severity.HIGH).length;

    setStats({
      totalLogs: logs.length,
      criticalAlerts: criticals,
      uniqueSources: uniqueSources,
      anomaliesDetected: Math.floor(highRisk * 0.8) + criticals,
    });
  }, [logs]);

  const handleIngestLogs = (newLogs: LogEntry[]) => {
    setLogs(prev => [...newLogs, ...prev]);
    setActiveView('explorer');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard logs={logs} stats={stats} />;
      case 'explorer':
        return <LogExplorer logs={logs} />;
      case 'ingest':
        return <IngestPanel onIngest={handleIngestLogs} />;
      case 'analysis':
        return <ThreatAnalysisView logs={logs} />;
      case 'reports':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <h3 className="text-xl font-bold mb-4">Report Generator</h3>
            <p className="max-w-md text-center mb-8">
              Generate structured PDF/Markdown reports for offline situational awareness and compliance auditing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all">
                Daily Incident Summary
              </button>
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all">
                Full Forensics Export
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard logs={logs} stats={stats} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
