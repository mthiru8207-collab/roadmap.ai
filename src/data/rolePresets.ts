export interface RolePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultSkills: string[];
  suggestedDuration: '4 weeks' | '8 weeks' | '12 weeks' | '16 weeks';
  recommendedDaily: '1h' | '2h' | '3h';
  popularTechnologies: string[];
  inDemandTag?: string;
}

export const POPULAR_ROLES: RolePreset[] = [
  {
    id: 'ai-engineer',
    title: 'AI & Machine Learning Engineer',
    category: 'Artificial Intelligence',
    description: 'Master neural networks, PyTorch, LLM fine-tuning, RAG architecture, vector embeddings, and production model serving.',
    defaultSkills: ['Python', 'Linear Algebra', 'NumPy'],
    suggestedDuration: '8 weeks',
    recommendedDaily: '2h',
    popularTechnologies: ['PyTorch', 'Transformers', 'LangChain', 'LlamaIndex', 'Pinecone', 'FastAPI'],
    inDemandTag: '#1 Most Demanded 2026',
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Cloud Developer',
    category: 'Software Engineering',
    description: 'Build enterprise-grade full-stack applications with React, TypeScript, Next.js, PostgreSQL, Docker, and AWS.',
    defaultSkills: ['JavaScript', 'HTML/CSS', 'Git basics'],
    suggestedDuration: '8 weeks',
    recommendedDaily: '2h',
    popularTechnologies: ['React 19', 'TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Docker', 'AWS'],
    inDemandTag: 'Top Enterprise Demand',
  },
  {
    id: 'frontend-architect',
    title: 'Frontend Engineer & UI Architect',
    category: 'Software Engineering',
    description: 'Master modern React, component architecture, state machines, web performance optimization, and accessible design systems.',
    defaultSkills: ['JavaScript', 'HTML5', 'CSS3'],
    suggestedDuration: '8 weeks',
    recommendedDaily: '1h',
    popularTechnologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Zustand', 'Storybook', 'Vitest'],
    inDemandTag: 'High Growth',
  },
  {
    id: 'devops-architect',
    title: 'Cloud DevOps & Platform Engineer',
    category: 'Infrastructure & Ops',
    description: 'Automate CI/CD pipelines, container orchestration with Kubernetes, infrastructure-as-code with Terraform, and cloud reliability.',
    defaultSkills: ['Linux CLI', 'Bash', 'Networking basics'],
    suggestedDuration: '12 weeks',
    recommendedDaily: '2h',
    popularTechnologies: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'AWS', 'Prometheus', 'Grafana'],
    inDemandTag: 'Critical Infrastructure',
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity & Threat Analyst',
    category: 'Security & Defense',
    description: 'Defend systems against zero-day threats, implement OWASP Top 10 defenses, penetration testing, SIEM monitoring, and zero-trust.',
    defaultSkills: ['Computer Networks', 'Operating Systems', 'Linux'],
    suggestedDuration: '8 weeks',
    recommendedDaily: '2h',
    popularTechnologies: ['Wireshark', 'Burp Suite', 'Splunk', 'Metasploit', 'Nmap', 'OWASP ZAP'],
    inDemandTag: 'Defensive Priority',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist & AI Analytics Engineer',
    category: 'Data & Analytics',
    description: 'Transform raw data into predictive machine learning models, statistical ETL pipelines, and business intelligence dashboards.',
    defaultSkills: ['Python', 'SQL', 'Statistics'],
    suggestedDuration: '8 weeks',
    recommendedDaily: '1h',
    popularTechnologies: ['Pandas', 'Scikit-Learn', 'XGBoost', 'dbt', 'Snowflake', 'PowerBI', 'Tableau'],
    inDemandTag: 'High Impact',
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer & Big Data Architect',
    category: 'Data & Analytics',
    description: 'Design distributed data streaming pipelines, modern lakehouses, real-time Kafka queues, and Apache Spark data workflows.',
    defaultSkills: ['Python', 'SQL', 'Database design'],
    suggestedDuration: '12 weeks',
    recommendedDaily: '2h',
    popularTechnologies: ['Apache Spark', 'Apache Kafka', 'Airflow', 'dbt', 'Snowflake', 'PostgreSQL'],
    inDemandTag: 'Core Backbone',
  },
  {
    id: 'product-designer',
    title: 'Product Designer & UX/UI Architect',
    category: 'Design & UX',
    description: 'Architect world-class user experiences, scalable Figma design tokens, user research protocols, usability testing, and prototypes.',
    defaultSkills: ['Figma basics', 'User empathy', 'Visual layout'],
    suggestedDuration: '4 weeks',
    recommendedDaily: '1h',
    popularTechnologies: ['Figma', 'FigJam', 'Tokens Studio', 'UsabilityHub', 'Miro', 'CSS Design Systems'],
    inDemandTag: 'Studio Caliber',
  },
  {
    id: 'blockchain-engineer',
    title: 'Blockchain & Smart Contract Engineer',
    category: 'Web3 & Distributed Systems',
    description: 'Engineer secure EVM smart contracts, decentralized finance (DeFi) protocols, and audited Solidity distributed applications.',
    defaultSkills: ['JavaScript', 'Basic Cryptography', 'Git'],
    suggestedDuration: '8 weeks',
    recommendedDaily: '2h',
    popularTechnologies: ['Solidity', 'Foundry', 'Hardhat', 'Ethers.js', 'OpenZeppelin', 'IPFS'],
    inDemandTag: 'Specialized Niche',
  },
  {
    id: 'product-manager',
    title: 'Technical Product Manager',
    category: 'Product & Strategy',
    description: 'Bridge engineering execution, product analytics, customer discovery interviews, PRD writing, and Agile product-market fit.',
    defaultSkills: ['Agile / Scrum', 'Clear Writing', 'User Research'],
    suggestedDuration: '4 weeks',
    recommendedDaily: '1h',
    popularTechnologies: ['Jira', 'SQL', 'Figma', 'Mixpanel', 'PostHog', 'Linear', 'Amplitude'],
    inDemandTag: 'Leadership Track',
  },
];
