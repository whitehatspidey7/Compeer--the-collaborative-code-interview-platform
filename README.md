Compeer 🚀
Collaborative Interview IDE with Real-Time Execution
Compeer is a scalable, real-time collaborative IDE designed for technical interviews. It enables multiple users to write, execute, and discuss code in a synchronized environment with built-in peer-to-peer video communication.

🛠 Tech Stack
Frontend: Next.js, TypeScript, Tailwind CSS, Monaco Editor

Real-time Sync: Y.js (CRDTs), Socket.io, Redis Pub/Sub

Execution: Docker-based sandboxed environment

Database: PostgreSQL, Prisma ORM

Communication: WebRTC for P2P video/audio

✨ Key Features
1. Collaborative Editor
Conflict-Free Editing: Powered by Y.js (CRDTs) to ensure seamless synchronization across distributed servers without text overlapping.

Presence Awareness: Real-time display of remote cursors and user-specific color coding.

Multi-language Support: Intelligent syntax highlighting for C++, JavaScript, Python, and SQL.

2. Secure Code Execution
Sandboxed Environment: Executes user-submitted code within isolated Docker containers to prevent system-level vulnerabilities.

Resource Constraints: Time-limited (5s) and memory-capped execution to ensure high availability.

3. Distributed Architecture
Scalability: Utilizes Redis Pub/Sub to synchronize state across multiple server instances, allowing the platform to scale horizontally.

Event-Driven: Low-latency communication protocol built on Socket.io.

🏗 System Architecture
Client Layer: Next.js frontend capturing keystrokes and binding them to a Y.js document.

Signaling Layer: Socket.io server facilitating WebRTC handshakes and broadcasting Y.js binary updates.

Sync Layer: Redis Pub/Sub ensuring all distributed backend nodes share a unified room state.

Execution Layer: A pool of Docker containers that receive code via REST, execute it safely, and return output.

🚀 Getting Started
Clone the repo: git clone https://github.com/whitehatspidey7/compeer.git

Install dependencies: npm install

Environment Setup: Configure your .env with PostgreSQL, Redis, and JWT secret keys.

Spin up Docker: docker-compose up to start the database and execution runner.

Run Dev Server: npm run dev

🛡 Security & Reliability
RBAC: Role-Based Access Control to manage Interviewer and Candidate permissions.

Vulnerability Scanning: CI/CD integration with rule-based security misconfiguration detection.

JWT Auth: Secure session management using JSON Web Tokens.
