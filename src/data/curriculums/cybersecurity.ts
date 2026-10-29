import { CareerRoadmap, LearningStage } from '../../types';

export const CYBERSECURITY_STAGES: LearningStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: Network Defense, Packet Analysis & Threat Vector Reconnaissance',
    description: 'Analyze network packets with Wireshark, dissect TCP/IP handshake anomalies, execute port scanning with Nmap, and configure defensive firewalls.',
    estimatedWeeks: 2,
    topics: ['Wireshark Deep Packet Inspection & PCAP Analysis', 'Nmap Port Scanning & Service Fingerprinting', 'DNS Spoofing, ARP Poisoning & Man-in-the-Middle', 'Stateful Firewalls & IPTables Rulesets', 'Linux Host Auditing & Log Forensics'],
    capstoneProject: {
      title: 'Defensive Network Audit & Malicious Traffic Detection Lab',
      description: 'Capture and dissect real network traffic to detect unauthorized port scans, SYN flood attempts, and DNS exfiltration attacks using Wireshark and Zeek.',
      deliverables: ['Wireshark packet capture analysis report', 'Hardened iptables firewall ruleset', 'Bash automated threat reconnaissance script'],
    },
    lessons: [
      {
        id: 'sec-l1',
        dayNumber: 1,
        stageId: 'stage-1',
        stageName: 'Stage 1: Network Defense & Reconnaissance',
        title: 'Day 1: Wireshark Packet Dissection, TCP Handshake Mechanics & Stream Reassembly',
        summary: 'Deconstruct TCP three-way handshakes, sequence/acknowledgment numbers, retransmission anomalies, and protocol dissection in Wireshark.',
        estimatedMinutes: 60,
        isCompleted: true,
        completedAt: '2026-10-21T18:00:00Z',
        objectives: [
          'Filter and analyze the SYN, SYN-ACK, ACK handshake sequence in live PCAP captures.',
          'Identify TCP reset (RST) flags and out-of-order retransmissions indicative of port scans or network attacks.',
          'Reassemble plaintext application streams (HTTP, SMTP, FTP) using Wireshark Follow Stream tools.',
        ],
        contentMarkdown: `### 1. The Anatomy of a TCP Handshake
A connection establishes via the reliable three-way handshake:
1. **Client &rarr; Server [SYN]**: Client picks random initial sequence number $ISN_C$.
2. **Server &rarr; Client [SYN-ACK]**: Server picks $ISN_S$ and acknowledges $ISN_C + 1$.
3. **Client &rarr; Server [ACK]**: Client acknowledges $ISN_S + 1$. Connection is ESTABLISHED.

### 2. Identifying Stealth SYN Scans
In a **Stealth SYN Scan** (e.g. \`nmap -sS\`), an attacker sends a [SYN] to probe an open port. When the server replies [SYN-ACK], the attacker immediately sends a **[RST]** instead of an [ACK]! This avoids completing the handshake, often evading primitive logging systems.

\`\`\`bash
# Capture packets on eth0 filtering only TCP SYN packets
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0' -w syn_capture.pcap
\`\`\``,
        codeSnippet: {
          language: 'bash',
          code: `# Wireshark Display Filters for Threat Hunting
# 1. Detect suspicious SYN scans without completed handshakes
tcp.flags.syn == 1 && tcp.flags.ack == 0

# 2. Detect failed connection attempts and RST tear-downs
tcp.flags.reset == 1

# 3. Locate DNS queries attempting data exfiltration via long subdomains
dns.qry.name.len > 50`,
          description: 'Production Wireshark display filter formulas for cyber threat investigation'
        },
        keyTakeaways: [
          'A stealth SYN scan tears down connections with RST before completing the 3-way handshake.',
          'Wireshark Follow TCP Stream reconstructs the conversation payload exactly as the application layer received it.',
          'High volumes of RST packets typically indicate port scanning or active firewall packet rejection.'
        ],
        resources: [
          { id: 'sec-res-1', title: 'Wireshark User Guide: Packet Filtering & Stream Analysis', url: 'https://www.wireshark.org/docs/wsug_html_chunked/', type: 'documentation', duration: '30 min', isFree: true },
          { id: 'sec-res-2', title: 'OWASP Network Security Verification Standard', url: 'https://owasp.org', type: 'documentation', duration: '20 min', isFree: true }
        ],
        tasks: [
          {
            id: 'sec-task-1',
            title: 'Capture and Dissect TCP Handshake with Tcpdump',
            description: 'Run tcpdump during a curl request and locate the SYN, SYN-ACK, and ACK packets with relative sequence numbers in Wireshark.',
            instructions: [
              'Start packet capture: sudo tcpdump -c 20 -w handshake.pcap port 80 or port 443.',
              'Execute curl -I http://example.com in another terminal.',
              'Open handshake.pcap in Wireshark and examine TCP sequence numbers.'
            ],
            completed: true
          }
        ],
        quizQuestions: [
          {
            id: 'sec-q1-1',
            question: 'In an Nmap stealth SYN scan (-sS), what packet flag does the attacker send after receiving a SYN-ACK from an open port?',
            options: ['ACK', 'FIN', 'RST (Reset)', 'URG'],
            correctAnswerIndex: 2,
            explanation: 'The attacker immediately sends RST to tear down the half-open connection before an application connection is logged.',
            topicTag: 'Network Security'
          },
          {
            id: 'sec-q1-2',
            question: 'Which Wireshark display filter isolates only packets initiating a new TCP connection?',
            options: ['tcp.flags.syn == 1 && tcp.flags.ack == 0', 'tcp.port == 80', 'ip.addr == 127.0.0.1', 'http.request'],
            correctAnswerIndex: 0,
            explanation: 'tcp.flags.syn == 1 and tcp.flags.ack == 0 matches solely the initial SYN packet without an acknowledgment.',
            topicTag: 'Wireshark Analysis'
          },
          {
            id: 'sec-q1-3',
            question: 'What is the purpose of Address Resolution Protocol (ARP) in IPv4 networks?',
            options: [
              'To map human-readable domain names to public IP addresses',
              'To map a known 32-bit IP address to a physical 48-bit MAC address on the local network link',
              'To encrypt web traffic using TLS certificates',
              'To allocate dynamic IP addresses automatically'
            ],
            correctAnswerIndex: 1,
            explanation: 'ARP translates network-layer IP addresses into data-link layer MAC addresses within a local broadcast domain.',
            topicTag: 'Network Security'
          },
          {
            id: 'sec-q1-4',
            question: 'What passing threshold is required for a 5-question daily quiz under RoadmapAI standards?',
            options: ['2 questions', '3 questions', '4 questions (Math.ceil(5 * 0.70))', '5 questions'],
            correctAnswerIndex: 2,
            explanation: 'RoadmapAI enforces a 70% threshold rounded up to the nearest question: ceil(5 * 0.70) = 4 correct answers.',
            topicTag: 'Platform Rules'
          },
          {
            id: 'sec-q1-5',
            question: 'Why are Initial Sequence Numbers (ISNs) randomized by modern operating systems during TCP handshakes?',
            options: [
              'To improve network bandwidth',
              'To prevent TCP Sequence Prediction and Session Hijacking attacks by malicious on-path observers',
              'To allow duplicate IP addresses on the same router',
              'To compress packet payloads'
            ],
            correctAnswerIndex: 1,
            explanation: 'Predictable sequence numbers allow attackers to spoof packets and inject arbitrary data into established connections.',
            topicTag: 'Network Security'
          }
        ]
      }
    ]
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Web Application Security, OWASP Top 10 & Vulnerability Exploitation',
    description: 'Audit and defend web architectures against SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, SSRF, and broken access controls.',
    estimatedWeeks: 2,
    topics: ['SQL Injection & Parameterized Query Defenses', 'Cross-Site Scripting (Stored, Reflected, DOM-based)', 'Server-Side Request Forgery (SSRF) Cloud Exploits', 'Broken Object Level Authorization (BOLA/IDOR)', 'Content Security Policy (CSP) & HTTP Security Headers'],
    capstoneProject: {
      title: 'Full-Stack Web Vulnerability Assessment & Remediation Report',
      description: 'Audit an intentionally vulnerable web application using Burp Suite and OWASP ZAP, document proof-of-concept exploits, and author code patches.',
      deliverables: ['Vulnerability penetration testing report', 'Parameterized query and CSP remediation code', 'Executive risk summary for CTO'],
    },
    lessons: []
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: Cryptography, Identity Access Management (IAM) & Zero Trust',
    description: 'Implement modern asymmetric cryptography (RSA, ECC), TLS handshake encryption, OAuth 2.0 / OpenID Connect, and Zero-Trust architecture.',
    estimatedWeeks: 2,
    topics: ['Symmetric vs Asymmetric Encryption (AES-GCM, RSA, ECC)', 'Hashing, Salts & Password Storage (Argon2, bcrypt)', 'PKI, Certificate Authorities & Mutual TLS (mTLS)', 'OAuth 2.0 Authorization Code Flow with PKCE', 'Zero-Trust Architecture & Principle of Least Privilege'],
    capstoneProject: {
      title: 'Zero-Trust Microsegmentation & mTLS Authentication Mesh',
      description: 'Architect a mutual TLS (mTLS) microservice communication mesh with dynamic short-lived certificates issued via HashiCorp Vault.',
      deliverables: ['HashiCorp Vault PKI engine configuration', 'Mutual TLS proxy configuration with certificate verification', 'OAuth 2.0 PKCE client implementation'],
    },
    lessons: []
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: Security Operations (SOC), SIEM Monitoring & Incident Response',
    description: 'Configure Security Information and Event Management (SIEM) pipelines with Splunk, analyze threat vectors with MITRE ATT&CK, and execute incident triage.',
    estimatedWeeks: 2,
    topics: ['SIEM Architecture & Syslog Ingestion (Splunk / Elastic Security)', 'MITRE ATT&CK Framework & Threat Hunting', 'Incident Response Lifecycle (NIST SP 800-61)', 'Endpoint Detection & Response (EDR) Forensics', 'Security Compliance Standards (SOC 2, ISO 27001, HIPAA)'],
    capstoneProject: {
      title: 'Automated SIEM Detection Rules & Incident Response Playbook',
      description: 'Build Splunk correlation search rules that detect lateral movement and credential dumping attacks, accompanied by an incident containment runbook.',
      deliverables: ['Splunk SPL detection queries for mimikatz/pass-the-hash', 'Automated incident escalation alert webhook', 'NIST-aligned incident response playbook'],
    },
    lessons: []
  }
];

export const SAMPLE_CYBERSECURITY_ROADMAP: CareerRoadmap = {
  id: 'roadmap-cybersecurity-threat-analyst',
  jobTitle: 'Cybersecurity & Threat Analyst',
  skillLevel: 'Intermediate',
  targetDuration: '8 weeks',
  dailyTime: '2h',
  existingSkills: ['Computer Networks', 'Operating Systems', 'Linux basics'],
  createdAt: '2026-10-21T09:00:00Z',
  updatedAt: '2026-10-28T09:00:00Z',
  totalDays: 28,
  summary: 'A 28-day defensive security curriculum covering Wireshark packet dissection, OWASP Top 10 vulnerabilities, asymmetric cryptography, and SIEM incident response.',
  stages: CYBERSECURITY_STAGES,
};

