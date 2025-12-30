# PolicyPulse | DPDP Compliance Engine

![Project Hero](https://github.com/tanishapritha/dpdp-audit-frontend/raw/main/public/vite.svg)

A high-fidelity compliance auditing platform designed to verify privacy policies against the **Digital Personal Data Protection (DPDP) Act 2023**. Built with a specialized RAG (Retrieval-Augmented Generation) pipeline for legal precision and evidence-based verification.

## 🚀 Key Features

- **Automated Clause Segmentation**: Deconstructs complex PDF policies into navigable sections.
- **AI-Powered Gap Analysis**: Uses RAG gateways to identify missing or non-compliant clauses.
- **Deterministic Risk Scoring**: Categorical verdicts (Green/Yellow/Red) based on regulatory requirements.
- **Immutable Evidence Binding**: Every finding is linked to specific page-level evidence in the source document.
- **RAGAS Validation**: Algorithmic verification of faithfulness and answer relevancy to prevent hallucinations.

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Modern Vanilla CSS (Glassmorphism Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: Axios (Targeting FastAPI Backend)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tanishapritha/dpdp-audit-frontend.git
   cd dpdp-audit-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📐 Architecture

PolicyPulse operates on a three-tier verification protocol:
1. **Ingestion Layer**: OCR and structured text extraction.
2. **Analysis Layer**: Specialized RAG pipeline for legal mapping.
3. **Certification Layer**: Severity calculation and report generation.

---

*Designed for regulatory precision and enterprise-grade auditing.*
