import { CareerRoadmap, LearningStage } from '../../types';

export const DEVOPS_STAGES: LearningStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: Linux System Internals, Networking Protocols & Container Runtimes',
    description: 'Master Linux kernel namespaces, cgroups, systemd services, IP routing, iptables/eBPF, and container image layers with Docker.',
    estimatedWeeks: 2,
    topics: ['Linux Kernel Namespaces & CGroups', 'TCP/IP, DNS & Subnetting Mechanics', 'Multi-Stage Dockerfiles & Layer Caching', 'Linux Bash Automation & POSIX Standards', 'Rootless Containers & Container Security'],
    capstoneProject: {
      title: 'Containerized Microservice Mesh & Host Hardening Benchmark',
      description: 'Build and audit a secure Linux host configuration running rootless containerized services with strict resource limits and automated health checks.',
      deliverables: ['Custom systemd service with cgroup v2 memory limits', 'Multi-stage scratch/distroless Dockerfile', 'Bash automated diagnostic script'],
    },
    lessons: [
      {
        id: 'devops-l1',
        dayNumber: 1,
        stageId: 'stage-1',
        stageName: 'Stage 1: Linux Internals & Container Runtimes',
        title: 'Day 1: Linux Kernel Namespaces, CGroups & Containerization from Scratch',
        summary: 'Understand how containers actually work under the hood using Linux PID, Mount, Network namespaces, and cgroups v2 resource quotas.',
        estimatedMinutes: 60,
        isCompleted: true,
        completedAt: '2026-10-21T18:00:00Z',
        objectives: [
          'Deconstruct how Docker isolates processes using unshare and clone system calls.',
          'Configure memory and CPU limits using Linux cgroups v2 hierarchy.',
          'Create a minimal isolated chroot jail with mounted proc and network namespaces.',
        ],
        contentMarkdown: `### 1. Containers are NOT Virtual Machines
A container is simply a standard Linux process running with kernel-enforced isolation primitives:
1. **Namespaces** (What the process can *see*):
   - \`pid\`: Isolates the process ID space (the container process sees itself as PID 1).
   - \`net\`: Isolates network interfaces, routing tables, and firewall rules.
   - \`mnt\`: Isolates mount points and filesystem root.
   - \`ipc\`, \`uts\`, \`user\`: Isolates inter-process communication, hostnames, and user UIDs.
2. **Control Groups (CGroups)** (What the process can *use*):
   - Enforces hard limits on memory, CPU bandwidth, and disk I/O.

\`\`\`bash
# Create an isolated PID and Mount namespace with unshare
sudo unshare --pid --mount --fork /bin/bash

# Inspect cgroups v2 memory controller on modern Linux
cat /sys/fs/cgroup/memory.max
\`\`\`

### 2. CGroups v2 Memory Limiting
Modern Linux organizes control groups in a unified single hierarchy under \`/sys/fs/cgroup\`. When a process exceeds \`memory.max\`, the kernel Out-Of-Memory (OOM) killer terminates the process with exit code 137.`,
        codeSnippet: {
          language: 'bash',
          code: `#!/usr/bin/env bash
# Run an isolated sandbox process with custom cgroup limits
CGROUP_DIR="/sys/fs/cgroup/sandbox_demo"
mkdir -p "$CGROUP_DIR"

# Limit memory to 256 Megabytes
echo "268435456" > "$CGROUP_DIR/memory.max"

# Add current subshell PID to cgroup
echo $$ > "$CGROUP_DIR/cgroup.procs"

echo "Process $$ is now running under strict 256MB memory constraints"`,
          description: 'Bash automation creating an explicit Linux cgroup v2 memory quota'
        },
        keyTakeaways: [
          'Containers share the host Linux kernel; isolation is enforced by namespaces and cgroups.',
          'An OOM kill (exit code 137 = 128 + SIGKILL 9) occurs when a process breaches memory.max.',
          'Always specify memory and CPU requests/limits in production to prevent noisy-neighbor host crashes.'
        ],
        resources: [
          { id: 'do-res-1', title: 'Linux Kernel Documentation: Control Groups (cgroups v2)', url: 'https://docs.kernel.org/admin-guide/cgroup-v2.html', type: 'documentation', duration: '30 min', isFree: true },
          { id: 'do-res-2', title: 'Julia Evans: What is a container, really?', url: 'https://jvns.ca/blog/2016/10/10/what-even-is-a-container/', type: 'article', duration: '15 min', isFree: true }
        ],
        tasks: [
          {
            id: 'do-task-1',
            title: 'Create an Isolated PID Namespace',
            description: 'Use the Linux unshare command to run a subshell with an isolated PID namespace and observe ps aux behavior.',
            instructions: [
              'Run sudo unshare --pid --fork --mount-proc bash.',
              'Execute ps aux and verify the subshell is recognized as PID 1.',
              'Exit and check host ps aux to see its real host PID.'
            ],
            completed: true
          }
        ],
        quizQuestions: [
          {
            id: 'do-q1-1',
            question: 'Which Linux kernel primitive controls what an isolated container process is allowed to SEE (e.g. processes, network interfaces)?',
            options: ['Control Groups (CGroups)', 'Namespaces', 'SELinux', 'Systemd'],
            correctAnswerIndex: 1,
            explanation: 'Linux Namespaces isolate visibility (what a process sees), while CGroups enforce resource constraints (what a process uses).',
            topicTag: 'Linux Internals'
          },
          {
            id: 'do-q1-2',
            question: 'What exit code does a container process receive when terminated by the Linux OOM (Out Of Memory) killer?',
            options: ['0', '1', '137 (128 + SIGKILL 9)', '255'],
            correctAnswerIndex: 2,
            explanation: 'Exit code 137 signifies that the process was terminated by fatal signal 9 (SIGKILL), standard for Linux OOM kills.',
            topicTag: 'Container Internals'
          },
          {
            id: 'do-q1-3',
            question: 'Where is the unified cgroups v2 filesystem hierarchy mounted on modern Linux distributions?',
            options: ['/etc/cgroups', '/sys/fs/cgroup', '/proc/cgroups_v2', '/var/run/cgroup'],
            correctAnswerIndex: 1,
            explanation: 'cgroups v2 uses a unified single hierarchy mounted at /sys/fs/cgroup on systemd-based Linux systems.',
            topicTag: 'Linux Internals'
          },
          {
            id: 'do-q1-4',
            question: 'What is the passing threshold under RoadmapAI guidelines for a 5-question daily quiz?',
            options: ['3 correct answers', '4 correct answers (ceil(5 * 0.70))', '5 correct answers', '2 correct answers'],
            correctAnswerIndex: 1,
            explanation: 'Passing threshold is 70% rounded up: Math.ceil(5 * 0.70) = 4 correct answers required.',
            topicTag: 'Platform Rules'
          },
          {
            id: 'do-q1-5',
            question: 'Which namespace isolates hostname and domain name configuration?',
            options: ['UTS namespace', 'IPC namespace', 'USER namespace', 'NET namespace'],
            correctAnswerIndex: 0,
            explanation: 'The UTS (UNIX Timesharing System) namespace allows an isolated container to have its own independent hostname.',
            topicTag: 'Linux Internals'
          }
        ]
      },
      {
        id: 'devops-l2',
        dayNumber: 2,
        stageId: 'stage-1',
        stageName: 'Stage 1: Linux Internals & Container Runtimes',
        title: 'Day 2: Production Multi-Stage Dockerfile Optimization & Security Hardening',
        summary: 'Reduce image sizes from 1GB to 30MB using scratch/alpine/distroless base images, non-root users, and BuildKit layer cache mounts.',
        estimatedMinutes: 60,
        isCompleted: true,
        completedAt: '2026-10-22T19:00:00Z',
        objectives: [
          'Engineer multi-stage Docker builds separating compiler toolchains from production runtime artifacts.',
          'Enforce non-root execution (USER 10001) to protect against container breakout vulnerabilities.',
          'Accelerate build pipelines using Docker BuildKit cache mounts (--mount=type=cache).',
        ],
        contentMarkdown: `### 1. The Multi-Stage Architecture Pattern
A standard single-stage Dockerfile copies SDKs, package managers, and compilers into the final shipping image. This leads to bloated 1GB+ images with massive attack surfaces.

A **Multi-Stage Build** creates separate ephemeral build containers and copies *only* the compiled binary or production bundle into an ultra-lean runtime image:

\`\`\`dockerfile
# syntax=docker/dockerfile:1.4
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build && npm prune --production

# Stage 2: Minimal Distroless Production Runtime
FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000
CMD ["dist/main.js"]
\`\`\`

### 2. Why Non-Root (USER) Matters
If an attacker exploits an application vulnerability inside a container running as default \`root\` (UID 0), and a kernel escape bug exists, they gain immediate root control over the host node! Running as non-root mitigates container breakout risk.`,
        codeSnippet: {
          language: 'dockerfile',
          code: `# Best-practice Go minimal binary container (<15MB!)
FROM golang:1.23-alpine AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /bin/server .

# Production: static scratch container
FROM scratch
COPY --from=build /bin/server /bin/server
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["/bin/server"]`,
          description: 'Production zero-footprint Go container using scratch base image and non-root execution'
        },
        keyTakeaways: [
          'Multi-stage builds eliminate compiler bloat from the production image.',
          'Distroless and scratch images contain zero package managers or shells, stopping attackers from running curls or bash scripts.',
          'Always mount package manager caches using BuildKit to speed up CI/CD pipelines.'
        ],
        resources: [
          { id: 'do-res-3', title: 'Docker Official Best Practices for Writing Dockerfiles', url: 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/', type: 'documentation', duration: '25 min', isFree: true }
        ],
        tasks: [
          {
            id: 'do-task-2',
            title: 'Convert a Single-Stage Image to Distroless',
            description: 'Refactor a standard 900MB Node.js Dockerfile into a 60MB distroless multi-stage image.',
            instructions: [
              'Create a Dockerfile with builder and production stages.',
              'Compare docker images size before and after.',
              'Verify the container runs successfully as non-root.'
            ],
            completed: true
          }
        ],
        quizQuestions: [
          {
            id: 'do-q2-1',
            question: 'What is the primary security benefit of using a Google Distroless base image for containers?',
            options: [
              'It automatically updates host packages daily',
              'It contains only your application and its runtime dependencies, omitting shells, package managers, and standard utilities',
              'It runs containers in hardware virtualization mode',
              'It bypasses Docker daemon licensing'
            ],
            correctAnswerIndex: 1,
            explanation: 'Distroless images lack shells like /bin/sh or curl, preventing an attacker from executing arbitrary commands even if they exploit your app.',
            topicTag: 'Container Security'
          },
          {
            id: 'do-q2-2',
            question: 'What does the Docker instruction COPY --from=builder /app/dist ./dist accomplish?',
            options: [
              'It copies files from the local developer laptop',
              'It transfers compiled artifacts from an earlier named build stage into the current minimal stage',
              'It clones a remote Git repository',
              'It uploads artifacts to an S3 bucket'
            ],
            correctAnswerIndex: 1,
            explanation: 'COPY --from allows extracting artifacts from intermediate builder stages without inheriting their build tools in the final image.',
            topicTag: 'Docker Architecture'
          },
          {
            id: 'do-q2-3',
            question: 'Why should you avoid running containers as default root (UID 0)?',
            options: [
              'Root containers consume double the network bandwidth',
              'If a container breakout vulnerability occurs, the attacker immediately gains root privilege on the underlying host node',
              'Root containers cannot bind to ports below 1024',
              'Docker disables logging for root users'
            ],
            correctAnswerIndex: 1,
            explanation: 'Default container UID 0 maps directly to host root unless user namespaces are configured; escaping a root container compromises the host.',
            topicTag: 'Container Security'
          },
          {
            id: 'do-q2-4',
            question: 'Which BuildKit feature prevents re-downloading npm/pip packages on every Docker build when source code changes?',
            options: ['RUN --mount=type=cache,target=...', 'VOLUME /root/.cache', 'ADD https://...', 'EXPOSE 8080'],
            correctAnswerIndex: 0,
            explanation: 'BuildKit cache mounts preserve package manager directories across build invocations without baking them into final layers.',
            topicTag: 'Docker Architecture'
          },
          {
            id: 'do-q2-5',
            question: 'What does the .dockerignore file do?',
            options: [
              'It lists containers that should not be stopped by docker stop',
              'It excludes files (like node_modules, .git, and .env) from being sent in the build context to the Docker daemon',
              'It prevents Docker from writing logs to disk',
              'It disables Docker network bridge creation'
            ],
            correctAnswerIndex: 1,
            explanation: '.dockerignore prevents copying large directories like node_modules into the initial build context, speeding up build transfers.',
            topicTag: 'Docker Architecture'
          }
        ]
      }
    ]
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Kubernetes Architecture, Pod Lifecycle, Ingress & Helm',
    description: 'Deploy resilient microservices on Kubernetes. Master Deployments, Services, ConfigMaps, Secrets, Ingress Controllers, and Helm templating.',
    estimatedWeeks: 3,
    topics: ['Control Plane (API Server, ETCD, Scheduler)', 'Kubelet, Pod Lifecycle & Probes (liveness/readiness/startup)', 'Kubernetes Services (ClusterIP, NodePort, LoadBalancer)', 'Ingress Controllers & Cert-Manager TLS', 'Helm Package Management & Value Overrides'],
    capstoneProject: {
      title: 'Production Kubernetes Cluster Deployment with Automated TLS & Autoscaling',
      description: 'Deploy a multi-tier microservice architecture to Kubernetes with Horizontal Pod Autoscalers (HPA), automated Let’s Encrypt SSL, and zero-downtime rolling updates.',
      deliverables: ['Custom Helm chart with values.yaml schema', 'Ingress manifest with cert-manager annotations', 'HPA configuration with CPU/Memory metrics'],
    },
    lessons: []
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: Infrastructure as Code (IaC) with Terraform & AWS Cloud',
    description: 'Provision immutable cloud infrastructure using HashiCorp Terraform, remote state locking with S3/DynamoDB, and AWS VPC networking.',
    estimatedWeeks: 3,
    topics: ['Terraform State, Backends & State Locking', 'Terraform Modules, Variables & Outputs', 'AWS VPC, Subnets, Route Tables & NAT Gateways', 'AWS IAM Least-Privilege Policies & Roles', 'Terraform Drift Detection & CI Plan Validation'],
    capstoneProject: {
      title: 'Production Multi-AZ AWS Infrastructure Provisioned via Terraform',
      description: 'Author modular Terraform code to provision a highly-available VPC across 3 Availability Zones with private subnets, bastion hosts, and an EKS cluster.',
      deliverables: ['Terraform root module with remote state backend', 'VPC & Subnet networking module', 'Automated terraform plan pull-request check'],
    },
    lessons: []
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: CI/CD Pipelines, GitOps with ArgoCD & Observability',
    description: 'Automate deployments with GitHub Actions, implement declarative GitOps with ArgoCD, and monitor distributed systems with Prometheus and Grafana.',
    estimatedWeeks: 2,
    topics: ['GitHub Actions Workflows, Secrets & OIDC AWS Auth', 'Declarative GitOps with ArgoCD & Kubernetes CRDs', 'Prometheus Metrics Scraping & PromQL Queries', 'Grafana Dashboards & Alertmanager Notification Routing', 'Site Reliability Engineering (SLO, SLA, Error Budgets)'],
    capstoneProject: {
      title: 'End-to-End GitOps Continuous Delivery & Observability Platform',
      description: 'Configure automated pull request pipelines that build images, update Kubernetes GitOps manifests, trigger ArgoCD automated sync, and alert via Alertmanager.',
      deliverables: ['GitHub Actions workflow with OIDC cloud authentication', 'ArgoCD Application manifest with automated self-healing', 'Grafana dashboard monitoring p99 latency and error rates'],
    },
    lessons: []
  }
];

export const SAMPLE_DEVOPS_ROADMAP: CareerRoadmap = {
  id: 'roadmap-cloud-devops-architect',
  jobTitle: 'Cloud DevOps & Platform Engineer',
  skillLevel: 'Intermediate',
  targetDuration: '12 weeks',
  dailyTime: '2h',
  existingSkills: ['Linux CLI', 'Bash', 'Networking basics'],
  createdAt: '2026-10-21T09:00:00Z',
  updatedAt: '2026-10-28T09:00:00Z',
  totalDays: 28,
  summary: 'A 28-day intensive track transitioning from Linux kernel namespaces and Docker multi-stage builds to Kubernetes orchestration, Terraform IaC, and ArgoCD GitOps.',
  stages: DEVOPS_STAGES,
};

