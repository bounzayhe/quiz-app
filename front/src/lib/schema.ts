
import * as z from 'zod';

export const loginSchema = z.object({
  name: z.string().min(1, { message: "auth.nameRequired" }),
  email: z.string().email({ message: "auth.invalidEmail" }).min(1, { message: "auth.emailRequired" }),
  password: z.string().min(1, { message: "auth.passwordRequired" }),
});

export const companyInfoSchema = z.object({
  name: z.string().min(1, { message: "surveyBuilder.companyName" }),
  email: z.string().email().min(1),
  phoneNumber: z.string().min(1),
  representativeName: z.string().min(1),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1),
  score: z.number().int().min(0),
  explanation: z.string().optional(),
  detail: z.string().optional(),
});

export const questionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.enum(['radio', 'text']),
  answers: z.array(answerSchema).optional(),
});

export const sectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  image: z.string().optional(),
  questions: z.array(questionSchema),
});

export const surveySchema = z.object({
  companyInfo: companyInfoSchema,
  sections: z.array(sectionSchema),
});
