import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PolicyUploadResponse {
  policy_id: string;
  filename: string;
}

export interface PolicyStatusResponse {
  policy_id: string;
  status: 'PENDING' | 'EXTRACTING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  progress: number;
}

export interface RequirementAudit {
  requirement_id: string;
  status: 'COVERED' | 'PARTIAL' | 'NOT_COVERED';
  reason: string;
  evidence: string[];
  page_numbers: number[];
}

export interface PolicyReportResponse {
  policy_id: string;
  filename: string;
  evaluated_at: string;
  overall_verdict: 'GREEN' | 'YELLOW' | 'RED';
  requirements: RequirementAudit[];
  ragas_faithfulness?: number;
  ragas_answer_relevancy?: number;
}

// Policy API
export const policyAPI = {
  uploadPolicy: async (file: File): Promise<PolicyUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReport: async (policyId: string): Promise<PolicyReportResponse> => {
    const response = await api.get(`/${policyId}/report`);
    return response.data;
  },

  getStatus: async (policyId: string): Promise<PolicyStatusResponse> => {
    const response = await api.get(`/${policyId}/status`);
    return response.data;
  }
};

export default api;
