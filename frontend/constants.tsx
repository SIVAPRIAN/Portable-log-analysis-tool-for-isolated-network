
import React from 'react';

export const COLORS = {
  CRITICAL: 'text-red-500 bg-red-500/10 border-red-500/20',
  HIGH: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  LOW: 'text-green-500 bg-green-500/10 border-green-500/20',
  INFO: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};

export const MOCK_LOGS = `
Feb 14 10:20:01 web-server-01 sshd[2341]: Failed password for root from 192.168.1.50 port 45231 ssh2
Feb 14 10:20:05 web-server-01 sshd[2341]: Failed password for root from 192.168.1.50 port 45235 ssh2
Feb 14 10:20:10 web-server-01 sshd[2341]: Failed password for root from 192.168.1.50 port 45239 ssh2
Feb 14 10:21:45 firewall-edge filter[450]: INBOUND BLOCK TCP 10.0.0.5:443 -> 192.168.1.2:80
Feb 14 10:25:12 database-prod kernel: [12345.678] Out of memory: Kill process 890 (mysqld)
Feb 14 10:30:00 app-gateway nginx: 192.168.1.100 - - [14/Feb/2025:10:30:00 +0000] "GET /admin/config HTTP/1.1" 403 562 "-" "Mozilla/5.0"
Feb 14 10:32:45 workstation-12 security[992]: Unauthorized file access attempt at C:\\Users\\Public\\Documents\\secret.pdf
`.trim();
