# 🧾 DocChain — Blockchain-Supported Digitized Transcript of Records Managing System

**DocChain** is a full-stack web application designed to securely manage and verify **Transcripts of Records (TORs)** using **blockchain technology**.  
The system aims to modernize document management in academic institutions by ensuring **authenticity**, **transparency**, and **privacy compliance**, while preventing tampering or falsification.

## 🚀 Features

- 🔐 **Blockchain Verification** – Each TOR is hashed (via **Keccak-256**) and stored on the blockchain, ensuring immutability and authenticity.  
- 🧾 **PDF Generation** – Generate previewable and downloadable TORs in PDF format using **jsPDF**.  
- 👥 **User Roles** – Four access levels: **Guest**, **Student**, **Registrar**, and **Admin**, each with specific permissions and views.  
- 🧠 **Smart Contracts** – Built with **Solidity** on **ZkSync Sepolia** for secure, decentralized transaction recording.  
- 🗂️ **Full CRUD Functionality** – Manage records with create, read, update, delete, and archiving capabilities.  
- ⚙️ **Relational Data Model** – Entity relationships managed with **Drizzle ORM** on **Neon Postgres**.  
- ⚡ **Performance & Caching** – Utilizes **Upstash Redis** for optimized caching and session control.  
- 📩 **Secure Authentication** – Managed with **Auth.js** and **EmailJS** for user verification and route protection.  
- 🎨 **Responsive UI/UX** – Built using **Next.js (React)**, **TailwindCSS**, and **shadcn/ui** for a clean, modern interface.  
- 🧾 **QR Code Verification** – Each TOR includes a verifiable QR code linked to its blockchain hash.  
- ☁️ **Deployment** – Hosted on **Vercel** for seamless accessibility and scalability.  

---

## 🏗️ Tech Stack

**Frontend:** Next.js (React), TailwindCSS, shadcn/ui  
**Backend:** Node.js, Drizzle ORM, Neon Postgres, Upstash Redis  
**Blockchain:** Solidity, ZkSync Sepolia, Keccak-256  
**Authentication:** Auth.js, EmailJS  
**Utilities:** jsPDF, qrcode, Git/GitHub  
**Deployment:** Vercel  

---

## 🧩 System Architecture Overview

DocChain follows a **modular full-stack architecture**:

Frontend (Next.js + TailwindCSS)
↓
API Routes (Node.js + Next.js)
↓
Database (Neon Postgres via Drizzle ORM)
↓
Blockchain Layer (Solidity Smart Contracts on ZkSync Sepolia)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+  
- PostgreSQL database (Neon Postgres recommended)  
- Metamask (for blockchain interaction)  

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/KingNoran/DocChainv2.git
cd DocChainv2

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in your database credentials, Auth.js secrets, Redis, and blockchain settings.

# 4. Run the development server
npm run dev
App runs locally at http://localhost:3000.
```

Each TOR is hashed before being recorded on the blockchain, maintaining privacy while ensuring verifiable authenticity.  

---

## 🧑‍💻 Roles and Access Control

| Role       | Permissions                                                                 |
|-------------|------------------------------------------------------------------------------|
| **Guest**   | Can view general information and verify TOR hashes.                         |
| **Student** | Can request and download their verified TOR.                                |
| **Registrar** | Can create, update, and archive TOR records.                              |
| **Admin**   | Has full control over the system, user management, and transaction approval. |

---

# 🔒 Blockchain Functionality

Each generated TOR is hashed with Keccak-256.

The resulting hash is stored on ZkSync Sepolia via Solidity smart contracts.

Verifiers can confirm document authenticity by comparing the hash on-chain with the locally generated one.

The actual TOR data is never stored on-chain, ensuring compliance with data privacy laws.

# 📜 Data Privacy & Security

DocChain was designed with data protection in mind:

No personal data or full documents are stored on the blockchain.

Only hashed identifiers are used for verification.

Smart contracts are written with gas optimization and security best practices.

All document interactions follow strict access control logic.

# 👥 Contributors

Reyes, Ken Jervis G.
 — Project Lead / Full-Stack Developer
Requioma, Ronald John
 — Blockchain Developer
Justo, John Dave
 — Designer
Ilagan, Mark Vincent
 — Documentation

Team of 4 developers under the guidance of Cavite State University – Bacoor Branch

📄 License

This project is for academic and educational purposes under the supervision of STI College Las Piñas.
All rights reserved © 2025.
