
import React, { useState } from 'react';
import { Upload, FileText, Globe, Usb, Cpu, Loader2, CheckCircle2 } from 'lucide-react';
import { parseRawLogs } from '../utils/logParser';
import { LogEntry } from '../types';

interface IngestPanelProps {
  onIngest: (newLogs: LogEntry[]) => void;
}

const IngestPanel: React.FC<IngestPanelProps> = ({ onIngest }) => {
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const sources = [
    { id: 'syslog', name: 'Syslog (Network)', icon: Globe, protocol: 'UDP/514', status: 'Listening...' },
    { id: 'usb', name: 'Mass Storage (USB)', icon: Usb, protocol: 'Filesystem', status: 'Ready' },
    { id: 'ftp', name: 'FTP Backup', icon: FileText, protocol: 'TCP/21', status: 'Disconnected' },
    { id: 'peripheral', name: 'UART/Serial', icon: Cpu, protocol: 'COM3', status: 'Inactive' },
  ];

  const handleIngest = async () => {
    if (!textInput.trim()) return;
    setIsIngesting(true);
    setIngestStatus('Parsing and normalizing logs...');
    
    // Simulate portable tool overhead
    await new Promise(r => setTimeout(r, 1200));
    
    const parsed = parseRawLogs(textInput);
    onIngest(parsed);
    
    setIsIngesting(false);
    setIngestStatus('Success! Ingested ' + parsed.length + ' log entries.');
    setTextInput('');
    
    setTimeout(() => setIngestStatus(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Live Ingestion Sources</h3>
          <p className="text-slate-400 text-sm mb-4">Configure collectors for isolated network protocols.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sources.map(source => (
              <div key={source.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-indigo-500/50 transition-colors group">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-indigo-500/10 transition-colors">
                  <source.icon size={20} className="text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{source.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-mono">{source.protocol}</p>
                  <p className={`text-[10px] mt-1 ${source.status.includes('List') ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {source.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-xl">
          <h4 className="text-indigo-400 font-semibold mb-2 flex items-center gap-2">
            <Usb size={18} />
            Portable Media Import
          </h4>
          <p className="text-sm text-slate-300 mb-4">The tool is optimized for importing logs from isolated air-gapped systems via USB drives.</p>
          <div className="flex gap-2">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
              <Upload size={16} />
              Scan USB Drive
            </button>
            <button className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all">
              Docs
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-2">Manual Log Injection</h3>
        <p className="text-slate-400 text-sm mb-4">Paste raw log data for instantaneous on-the-spot analysis.</p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste raw log lines here... (e.g. Syslog, JSON, Auth logs)"
            className="w-full h-80 bg-transparent p-6 font-mono text-xs focus:outline-none resize-none text-emerald-400"
          ></textarea>
          <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {textInput.split('\n').filter(l => l.trim()).length} lines detected
            </div>
            <button
              onClick={handleIngest}
              disabled={isIngesting || !textInput.trim()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              {isIngesting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Ingest Logs
                </>
              )}
            </button>
          </div>
        </div>
        {ingestStatus && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
            {ingestStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngestPanel;
