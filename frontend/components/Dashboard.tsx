
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LogEntry, Stats, Severity } from '../types';
import { COLORS } from '../constants';
import { AlertTriangle, ShieldCheck, Database, Zap } from 'lucide-react';

const data = [
  { name: '00:00', logs: 400, threats: 24 },
  { name: '04:00', logs: 300, threats: 13 },
  { name: '08:00', logs: 1200, threats: 98 },
  { name: '12:00', logs: 900, threats: 39 },
  { name: '16:00', logs: 1500, threats: 48 },
  { name: '20:00', logs: 2100, threats: 120 },
  { name: '23:59', logs: 600, threats: 25 },
];

const severityData = [
  { name: 'Critical', value: 12, fill: '#ef4444' },
  { name: 'High', value: 45, fill: '#f97316' },
  { name: 'Medium', value: 124, fill: '#eab308' },
  { name: 'Low', value: 500, fill: '#22c55e' },
];

interface DashboardProps {
  logs: LogEntry[];
  stats: Stats;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, stats }) => {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
              <Database size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-500">+12%</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Total Logs Ingested</h3>
          <p className="text-3xl font-bold mt-1">{stats.totalLogs.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <AlertTriangle size={24} />
            </div>
            <span className="text-xs font-bold text-red-500">Critical</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Critical Alerts</h3>
          <p className="text-3xl font-bold mt-1">{stats.criticalAlerts}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xs font-bold text-blue-400">Stable</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Unique Sources</h3>
          <p className="text-3xl font-bold mt-1">{stats.uniqueSources}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
              <Zap size={24} />
            </div>
            <span className="text-xs font-bold text-yellow-500">Live</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Anomalies Detected</h3>
          <p className="text-3xl font-bold mt-1">{stats.anomaliesDetected}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-6">Log Ingestion Trend (24h)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="logs" stroke="#6366f1" fillOpacity={1} fill="url(#colorLogs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-6">Severity Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-semibold">Recent High-Risk Events</h3>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20">
                <th className="px-6 py-3 font-medium text-slate-400">Timestamp</th>
                <th className="px-6 py-3 font-medium text-slate-400">Source</th>
                <th className="px-6 py-3 font-medium text-slate-400">Severity</th>
                <th className="px-6 py-3 font-medium text-slate-400">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.filter(l => l.severity === Severity.CRITICAL || l.severity === Severity.HIGH).slice(0, 5).map(log => (
                <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-slate-300 font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium">{log.source}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${COLORS[log.severity]}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
