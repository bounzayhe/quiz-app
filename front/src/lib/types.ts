
export type Role = 'admin' | 'company';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastAccess?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  representativeName: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  clientCount?: number; // Added for stats endpoint
}

export interface Client {
  id: string;
  name: string;
  email: string;
  companyId: string;
  fullname?: string; // Added for API response
}

export interface Answer {
  id: string;
  text: string;
  score: number;
  explanation?: string;
  detail?: string;
}

// Extended Answer interface for client responses
export interface ClientAnswer {
  questionId: string;
  questionTitle?: string;
  questionType?: string;
  questionOrder?: number;
  response: string;
  score?: number;
}

export interface Question {
  id: string;
  title: string;
  type: 'radio' | 'text';
  answers: Answer[];
}

export interface Section {
  id: string;
  title: string;
  image?: string;
  questions: Question[];
}

export interface Survey {
  id: string;
  companyId: string;
  sections: Section[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  clientId: string;
  clientName?: string; // Added for API response
  answers: ClientAnswer[];
  totalScore: number;
  completedAt: string;
}
