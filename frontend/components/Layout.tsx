
import React from 'react';
import { LayoutDashboard, FileText, Search, ShieldAlert, Upload, Download, Terminal } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Log Explorer', icon: Search },
    { id: 'ingest', label: 'Ingest Logs', icon: Upload },
    { id: 'analysis', label: 'Threat Intelligence', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Terminal size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SentinelLog</h1>
            <p className="text-xs text-slate-400 font-medium">Isolated Network</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as View)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-500">OFFLINE MODE</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 text-center italic">Version 2.4.0 (Portable)</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        <header className="sticky top-0 z-10 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold capitalize">{activeView}</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-md text-sm hover:bg-slate-700 transition-colors">
              <Download size={16} />
              Export Session
            </button>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
