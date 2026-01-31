# Company Compliance Frontend

Frontend interface for DPDP compliance auditing. This application allows users to upload privacy policies and receive automated regulatory assessments.

## Core Features
1. PDF policy upload and clause extraction.
2. Real-time status tracking for analysis pipelines.
3. Detailed compliance reports with evidence mapping.
4. Support for RAGAS evaluation metrics.

## API Integration
The frontend communicates with a FastAPI backend via the following v1 endpoints:

### Audit Management
- POST /upload: Accepts a PDF file and returns a unique policy_id.
- GET /{policy_id}/status: Returns the current processing state (PENDING, EXTRACTING, ANALYZING, COMPLETED, FAILED).
- GET /{policy_id}/report: Returns the finalized compliance findings, evidence segments, and risk scores.

### Administrative Functions
- GET /admin/users: List authorized auditors.
- GET /admin/logs: Access immutable system audit logs.
- PATCH /admin/users/{user_id}: Update user authorization or status.

## Configuration
Set VITE_API_URL in your .env file to point to the backend service.
