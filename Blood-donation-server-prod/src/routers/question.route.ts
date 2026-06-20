import {
  createQuestionnaireController,
  getAllQuestionnairesController,
  getQuestionnaireByIdController,
  updateQuestionnaireController,
  createQuestionController,
  getAllQuestionsController,
  getQuestionsByQuestionnaireController,
  getQuestionByIdController,
  updateQuestionController,
  deleteQuestionController,
  createBulkQuestionResponsesController,
  getQuestionResponsesByDonationController,
  getQuestionResponseByIdController,
} from "../apis/v1/question.controller.js";
import { Router } from "express";
import { authenticateUser, authenticateAdmin } from "../middleware/auth.js";

const router = Router();

// ==========================================
// QUESTIONNAIRE ROUTES
// ==========================================

// Admin only - Create questionnaire
router.post(
  "/questionnaires",
  authenticateAdmin,
  createQuestionnaireController,
);

// All authenticated users can view questionnaires
router.get("/questionnaires", authenticateUser, getAllQuestionnairesController);

router.get(
  "/questionnaires/:questionnaireId",
  authenticateUser,
  getQuestionnaireByIdController,
);

// Admin only - Update questionnaire
router.put(
  "/questionnaires/:questionnaireId",
  authenticateAdmin,
  updateQuestionnaireController,
);

// ==========================================
// QUESTION ROUTES
// ==========================================

// Admin only - Create question
router.post("/questions", authenticateAdmin, createQuestionController);

// All authenticated users can view questions
router.get("/questions", authenticateUser, getAllQuestionsController);

router.get(
  "/questionnaires/:questionnaireId/questions",
  authenticateUser,
  getQuestionsByQuestionnaireController,
);

router.get(
  "/questions/:questionId",
  authenticateUser,
  getQuestionByIdController,
);

// Admin only - Update question
router.put(
  "/questions/:questionId",
  authenticateAdmin,
  updateQuestionController,
);

// Admin only - Delete question
router.delete(
  "/questions/:questionId",
  authenticateAdmin,
  deleteQuestionController,
);

// ==========================================
// QUESTION RESPONSE ROUTES
// ==========================================

// User - Submit question responses for a donation
router.post(
  "/donations/question-responses",
  authenticateUser,
  createBulkQuestionResponsesController,
);

// User/Admin - Get question responses for a specific donation
router.get(
  "/donations/:donationId/question-responses",
  authenticateUser,
  getQuestionResponsesByDonationController,
);

router.get(
  "/question-responses/:responseId",
  authenticateUser,
  getQuestionResponseByIdController,
);

export default router;
