
import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, ChevronDown } from 'lucide-react';
import { LogEntry, Severity } from '../types';
import { COLORS } from '../constants';

interface LogExplorerProps {
  logs: LogEntry[];
}

const LogExplorer: React.FC<LogExplorerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.raw.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [logs, searchTerm, severityFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search logs by keyword, IP, message..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
          >
            <option value="ALL">All Severities</option>
            <option value={Severity.CRITICAL}>Critical</option>
            <option value={Severity.HIGH}>High</option>
            <option value={Severity.MEDIUM}>Medium</option>
            <option value={Severity.LOW}>Low</option>
            <option value={Severity.INFO}>Info</option>
          </select>
          <button className="bg-slate-800 p-2.5 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map(log => (
                <React.Fragment key={log.id}>
                  <tr 
                    className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${expandedLog === log.id ? 'bg-slate-800/40' : ''}`}
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  >
                    <td className="px-4 py-3">
                      {expandedLog === log.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold border ${COLORS[log.severity]}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{log.source}</td>
                    <td className="px-4 py-3 text-slate-400">{log.service}</td>
                    <td className="px-4 py-3 text-slate-200 truncate max-w-md">{log.message}</td>
                  </tr>
                  {expandedLog === log.id && (
                    <tr>
                      <td colSpan={6} className="px-8 py-6 bg-slate-950/50 border-y border-slate-800">
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Log Detail</h4>
                          <div className="bg-slate-900 p-4 rounded-lg font-mono text-[13px] text-emerald-400 border border-slate-800 shadow-inner overflow-x-auto whitespace-pre-wrap">
                            {log.raw}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <p className="text-slate-500 mb-1">Log ID</p>
                              <p className="font-mono text-slate-300">{log.id}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 mb-1">Source Host</p>
                              <p className="text-slate-300">{log.source}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 mb-1">Internal Severity</p>
                              <p className="text-slate-300">{log.severity}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 mb-1">Normalized Protocol</p>
                              <p className="text-slate-300">Syslog (RFC5424)</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500 italic">
                    No logs matching your filters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogExplorer;
