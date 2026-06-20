import { Request } from "express";
import { AppError } from "../utils/error.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {
  createQuestionnaire,
  getAllQuestionnaires,
  getQuestionnaireById,
  updateQuestionnaire,
  createQuestion,
  getAllQuestions,
  getQuestionsByQuestionnaire,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  createBulkQuestionResponses,
  getQuestionResponsesByDonation,
  getQuestionResponseById,
} from "../services/question.service.js";

// ==========================================
// QUESTIONNAIRE CONTROLLERS
// ==========================================

export const createQuestionnaireController = asyncHandler(
  async (req: Request) => {
    return await createQuestionnaire(req.body);
  },
  {
    createdMessage: "Questionnaire created successfully",
  },
);

export const getAllQuestionnairesController = asyncHandler(async () => {
  return await getAllQuestionnaires();
});

export const getQuestionnaireByIdController = asyncHandler(
  async (req: Request) => {
    const questionnaireId = parseInt(req.params.questionnaireId);
    if (!questionnaireId || isNaN(questionnaireId)) {
      throw new AppError("Invalid questionnaire ID", 400);
    }
    return await getQuestionnaireById(questionnaireId);
  },
);

export const updateQuestionnaireController = asyncHandler(
  async (req: Request) => {
    const questionnaireId = parseInt(req.params.questionnaireId);
    if (!questionnaireId || isNaN(questionnaireId)) {
      throw new AppError("Invalid questionnaire ID", 400);
    }
    return await updateQuestionnaire({
      ...req.body,
      questionnaireId,
    });
  },
  {
    successMessage: "Questionnaire updated successfully",
  },
);

// ==========================================
// QUESTION CONTROLLERS
// ==========================================

export const createQuestionController = asyncHandler(
  async (req: Request) => {
    return await createQuestion(req.body);
  },
  {
    createdMessage: "Question created successfully",
  },
);

export const getAllQuestionsController = asyncHandler(async () => {
  return await getAllQuestions();
});

export const getQuestionsByQuestionnaireController = asyncHandler(
  async (req: Request) => {
    const questionnaireId = parseInt(req.params.questionnaireId);
    if (!questionnaireId || isNaN(questionnaireId)) {
      throw new AppError("Invalid questionnaire ID", 400);
    }
    return await getQuestionsByQuestionnaire(questionnaireId);
  },
);

export const getQuestionByIdController = asyncHandler(async (req: Request) => {
  const questionId = parseInt(req.params.questionId);
  if (!questionId || isNaN(questionId)) {
    throw new AppError("Invalid question ID", 400);
  }
  return await getQuestionById(questionId);
});

export const updateQuestionController = asyncHandler(
  async (req: Request) => {
    const questionId = parseInt(req.params.questionId);
    if (!questionId || isNaN(questionId)) {
      throw new AppError("Invalid question ID", 400);
    }
    return await updateQuestion({
      ...req.body,
      questionId,
    });
  },
  {
    successMessage: "Question updated successfully",
  },
);

export const deleteQuestionController = asyncHandler(
  async (req: Request) => {
    const questionId = parseInt(req.params.questionId);
    if (!questionId || isNaN(questionId)) {
      throw new AppError("Invalid question ID", 400);
    }
    return await deleteQuestion(questionId);
  },
  {
    successMessage: "Question deleted successfully",
  },
);

// ==========================================
// QUESTION RESPONSE CONTROLLERS
// ==========================================

export const createBulkQuestionResponsesController = asyncHandler(
  async (req: Request) => {
    return await createBulkQuestionResponses(req.body);
  },
  {
    createdMessage: "Question responses saved successfully",
  },
);

export const getQuestionResponsesByDonationController = asyncHandler(
  async (req: Request) => {
    const donationId = parseInt(req.params.donationId);
    if (!donationId || isNaN(donationId)) {
      throw new AppError("Invalid donation ID", 400);
    }
    return await getQuestionResponsesByDonation(donationId);
  },
);

export const getQuestionResponseByIdController = asyncHandler(
  async (req: Request) => {
    const responseId = parseInt(req.params.responseId);
    if (!responseId || isNaN(responseId)) {
      throw new AppError("Invalid response ID", 400);
    }
    return await getQuestionResponseById(responseId);
  },
);
