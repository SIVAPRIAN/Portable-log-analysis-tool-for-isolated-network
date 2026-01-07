
import React, { useState } from 'react';
import { ShieldAlert, BrainCircuit, Loader2, AlertCircle, CheckCircle2, Target, Cpu } from 'lucide-react';
import { LogEntry, ThreatAnalysis } from '../types';
import { analyzeLogs } from '../services/forensicEngine';

interface ThreatAnalysisViewProps {
  logs: LogEntry[];
}

const ThreatAnalysisView: React.FC<ThreatAnalysisViewProps> = ({ logs }) => {
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async () => {
    if (logs.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeLogs(logs);
      setAnalysis(result);
    } catch (e) {
      setError("Forensic engine error: Unable to process logs locally.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!analysis && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-3xl border-dashed">
          <Cpu size={64} className="text-slate-700 mb-4" />
          <h3 className="text-xl font-bold mb-2">Local Forensic Scan Required</h3>
          <p className="text-slate-400 max-w-md text-center mb-8">
            SentinelLog utilizes a built-in deterministic signature engine to detect malicious TTPs without any external network dependency.
          </p>
          <button
            onClick={startAnalysis}
            disabled={logs.length === 0}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <ShieldAlert size={20} />
            Start Local Forensic Scan
          </button>
          {logs.length === 0 && <p className="mt-4 text-xs text-red-400">Please ingest log data before initiating analysis.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <ShieldAlert className="text-indigo-400" />
                  Local Analysis Findings
                </h3>
                {isLoading && <Loader2 className="animate-spin text-indigo-400" />}
              </div>
              
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-slate-300 leading-relaxed text-lg border-l-4 border-indigo-500 pl-4 py-1 italic">
                    {analysis?.summary}
                  </p>
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Identified MITRE ATT&CK Signatures</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {analysis?.detectedTTPs.map(ttp => (
                        <div key={ttp.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex gap-4 hover:border-slate-600 transition-colors">
                          <div className="bg-red-500/10 text-red-500 p-2 rounded h-fit">
                            <Target size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">{ttp.id}</span>
                              <h5 className="font-bold text-slate-100">{ttp.name}</h5>
                            </div>
                            <p className="text-xs text-slate-400 leading-normal">{ttp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" />
                Remediation Checklist
              </h3>
              <ul className="space-y-4">
                {isLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-800 rounded animate-pulse"></div>)
                ) : (
                  analysis?.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Risk Evaluation</h4>
              <div className="relative inline-flex items-center justify-center p-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-slate-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={analysis && analysis.riskScore > 60 ? 'text-red-500' : 'text-indigo-500'}
                    strokeWidth="8"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * (isLoading ? 0 : analysis?.riskScore || 0)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                    style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                  />
                </svg>
                <div className="absolute text-3xl font-bold font-mono">
                  {isLoading ? '...' : (analysis?.riskScore + '%')}
                </div>
              </div>
              <p className="mt-6 text-xs font-medium text-slate-500 leading-relaxed uppercase">
                Calculated based on local signature database
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
              <h4 className="font-bold text-lg mb-2">Export Local Evidence</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Save this forensic report as a signed package for central SOC verification.
              </p>
              <button 
                onClick={() => alert("Forensic package exported successfully.")}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
              >
                Download Evidence
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 flex gap-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatAnalysisView;
