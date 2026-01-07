
import { LogEntry, ThreatAnalysis, Severity } from "../types";

/**
 * Portable Local Forensic Engine (Signature & Behavioral)
 * 100% Offline - No External API Dependencies.
 * Utilizes a rule-based deterministic system for TTP identification on isolated networks.
 */
export async function analyzeLogs(logs: LogEntry[]): Promise<ThreatAnalysis> {
  // Simulate local computation overhead for deterministic analysis
  await new Promise(resolve => setTimeout(resolve, 800));

  const detectedTTPs = [];
  const recommendations = new Set<string>();
  let riskScore = 0;

  // Normalized search patterns for isolated environment threats
  const failedLogins = logs.filter(l => l.raw.toLowerCase().includes('failed password') || l.raw.toLowerCase().includes('authentication failure'));
  const unauthorizedAccess = logs.filter(l => l.raw.toLowerCase().includes('unauthorized') || l.raw.toLowerCase().includes('403') || l.raw.toLowerCase().includes('permission denied'));
  const resourcePressure = logs.filter(l => l.raw.toLowerCase().includes('kernel') && (l.raw.toLowerCase().includes('kill') || l.raw.toLowerCase().includes('oom')));
  const filterBlocks = logs.filter(l => l.raw.toLowerCase().includes('block') || l.raw.toLowerCase().includes('deny') || l.raw.toLowerCase().includes('drop'));

  // Logic: Credential Access Pattern (T1110)
  if (failedLogins.length > 2) {
    detectedTTPs.push({
      id: "T1110",
      name: "Local Brute Force Detection",
      description: `Identified ${failedLogins.length} failed login attempts. High correlation with password guessing or automated dictionary attacks.`
    });
    recommendations.add("Enforce strictly managed local account lockout policies.");
    recommendations.add("Review active sessions for host: " + (failedLogins[0]?.source || "Unknown"));
    riskScore += 45;
  }

  // Logic: Privilege Escalation/Discovery (T1078)
  if (unauthorizedAccess.length > 0) {
    detectedTTPs.push({
      id: "T1078",
      name: "Unauthorized Access Indicator",
      description: "Attempts detected to access restricted system objects or administrative configuration endpoints."
    });
    recommendations.add("Verify ACLs on high-value file directories.");
    riskScore += 20;
  }

  // Logic: Discovery/Reconnaissance (T1046)
  if (filterBlocks.length > 4) {
    detectedTTPs.push({
      id: "T1046",
      name: "Network Reconnaissance Signature",
      description: "Anomalous volume of dropped packets detected. Pattern consistent with internal port scanning or network discovery."
    });
    recommendations.add("Verify firewall rules on segment gateways.");
    riskScore += 15;
  }

  // Logic: Impact/DoS (T1499)
  if (resourcePressure.length > 0) {
    detectedTTPs.push({
      id: "T1499",
      name: "Endpoint Denial of Service Indicator",
      description: "Kernel reports process terminations due to memory exhaustion. Potential indication of malicious resource consumption."
    });
    recommendations.add("Perform memory dump analysis on affected production hosts.");
    riskScore += 15;
  }

  // Final Risk Score Calculation
  riskScore = Math.min(riskScore + 5, 100); // 5 base points for active monitoring

  // Baseline response if clean
  if (detectedTTPs.length === 0) {
    return {
      summary: "Forensic analysis complete. All signatures within normal operational baseline. No known malicious TTP patterns detected in this log segment.",
      riskScore: 5,
      detectedTTPs: [],
      recommendations: [
        "Maintain routine log rotation cycles.",
        "Ensure central SOC sync is performed as per isolated network policy."
      ]
    };
  }

  return {
    summary: `Local Forensic Engine identified ${detectedTTPs.length} actionable security alerts. Data points to a ${riskScore > 60 ? 'HIGH' : 'MEDIUM'} priority incident involving potential ${detectedTTPs[0].name.toLowerCase()}.`,
    riskScore,
    detectedTTPs,
    recommendations: Array.from(recommendations)
  };
}
