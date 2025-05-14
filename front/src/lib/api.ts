import axios from "axios";
import {
  User,
  Company,
  Client,
  SurveyResponse,
  Survey,
  Section,
} from "./types";

// Create axios instance with base URL (pointing to our backend server)
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Update this with your actual backend URL
});

// Add request interceptor to include JWT token in headers
// This automatically adds the Authorization header to every request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
// This handles cases where the token is invalid or expired
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401 (Unauthorized) or 403 (Forbidden) status
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication - sends credentials to backend and receives JWT token
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; role: "admin" | "company" }> => {
    try {
      // POST request to /auth/login endpoint
      const response = await apiClient.post("/auth/login", { email, password });
      return {
        token: response.data.token,
        role: response.data.role,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Authentication failed. Please check your credentials.");
    }
  },

  // Admin data - Protected endpoint, only accessible with admin role
  getAdmins: async (): Promise<User[]> => {
    try {
      // GET request to /admin/overview endpoint (token is automatically added via interceptor)
      const response = await apiClient.get("/admin/overview");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching admin data:", error);
      throw new Error("Failed to fetch admin data");
    }
  },

  // Company data - Protected endpoint for admin to see company stats
  getCompanies: async (): Promise<Company[]> => {
    try {
      // GET request to /companies/stats endpoint (token is automatically added)
      const response = await apiClient.get("/companies/stats");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw new Error("Failed to fetch company data");
    }
  },

  // Client data - Can be filtered by company ID
  getClients: async (companyId?: string): Promise<Client[]> => {
    try {
      // Determine URL based on whether companyId is provided
      const url = companyId
        ? `/companies/${companyId}/clients`
        : "/companies/clients";
      const response = await apiClient.get(url);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw new Error("Failed to fetch client data");
    }
  },

  // Client registration - For company users to register new clients
  registerClient: async (fullname: string): Promise<{ client_id: string }> => {
    try {
      // POST request to register a new client
      const response = await apiClient.post("/companies/register-client", {
        fullname,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering client:", error);
      throw new Error("Failed to register client");
    }
  },

  // Survey responses - For company users to see their clients' responses
  getClientResponses: async (): Promise<SurveyResponse[]> => {
    try {
      // GET request to fetch client responses (token identifies the company)
      const response = await apiClient.get("/companies/clients-responses");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching survey responses:", error);
      throw new Error("Failed to fetch client responses");
    }
  },

  // Create new tentative - Starts a new survey attempt for a client
  createTentative: async (
    clientId: string,
    questionnaireId: string
  ): Promise<{ tentative_id: string }> => {
    try {
      // POST request to create a new tentative (survey attempt)
      const response = await apiClient.post("/tentatives", {
        client_id: clientId,
        questionnaire_id: questionnaireId,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating tentative:", error);
      throw new Error("Failed to create new questionnaire attempt");
    }
  },

  // Survey builder - For creating new surveys
  createSurvey: async (
    companyInfo: Partial<Company>,
    sections: Section[]
  ): Promise<Survey> => {
    try {
      // POST request to create a new survey
      const response = await apiClient.post("/surveys", {
        companyInfo,
        sections,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating survey:", error);
      throw new Error("Failed to create survey");
    }
  },
};
