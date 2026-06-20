import { z } from "zod";

// ==========================================
// REUSABLE SCHEMAS
// ==========================================
const IdSchema = z.number().int().positive();

// ==========================================
// CREATE QUESTION
// ==========================================
export const createQuestionSchema = z.object({
  questionnaireId: IdSchema,
  question: z.string().min(5).max(500),
  questionType: z.enum(["yes_no", "text", "multiple_choice"]).default("yes_no"),
  options: z.string().optional().nullable(), // JSON string for multiple choice
  isRequired: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// ==========================================
// UPDATE QUESTION
// ==========================================
export const updateQuestionSchema = z.object({
  questionId: IdSchema,
  question: z.string().min(5).max(500).optional(),
  questionType: z.enum(["yes_no", "text", "multiple_choice"]).optional(),
  options: z.string().optional().nullable(),
  isRequired: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// DELETE QUESTION
// ==========================================
export const deleteQuestionSchema = z.object({
  questionId: IdSchema,
});

// ==========================================
// GET QUESTIONS BY QUESTIONNAIRE
// ==========================================
export const getQuestionsByQuestionnaireSchema = z.object({
  questionnaireId: IdSchema,
});

// ==========================================
// CREATE QUESTIONNAIRE
// ==========================================
export const createQuestionnaireSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().default(true),
});

// ==========================================
// UPDATE QUESTIONNAIRE
// ==========================================
export const updateQuestionnaireSchema = z.object({
  questionnaireId: IdSchema,
  name: z.string().min(3).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().optional(),
});

// ==========================================
// QUESTION RESPONSE
// ==========================================
export const createQuestionResponseSchema = z.object({
  donationId: IdSchema,
  questionId: IdSchema,
  answer: z.string().min(1).max(5000),
});

export const createBulkQuestionResponseSchema = z.object({
  donationId: IdSchema,
  responses: z.array(
    z.object({
      questionId: IdSchema,
      answer: z.string().min(1).max(5000),
    }),
  ),
});
