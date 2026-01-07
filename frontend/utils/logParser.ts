
import { LogEntry, Severity } from '../types';

export function parseRawLogs(rawText: string): LogEntry[] {
  const lines = rawText.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    // Basic heuristics for parsing
    let severity = Severity.INFO;
    if (line.toLowerCase().includes('fail') || line.toLowerCase().includes('error')) severity = Severity.HIGH;
    if (line.toLowerCase().includes('critical') || line.toLowerCase().includes('unauthorized')) severity = Severity.CRITICAL;
    if (line.toLowerCase().includes('warn') || line.toLowerCase().includes('block')) severity = Severity.MEDIUM;

    const parts = line.split(' ');
    const timestamp = parts.slice(0, 3).join(' ');
    const source = parts[3] || 'unknown';
    const message = parts.slice(4).join(' ');

    return {
      id: `log-${Date.now()}-${index}`,
      timestamp,
      source,
      service: source.split('[')[0] || 'System',
      message,
      severity,
      raw: line
    };
  });
}
