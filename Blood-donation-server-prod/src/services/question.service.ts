import prisma from "../config/db.js";
import {
  createQuestionSchema,
  updateQuestionSchema,
  deleteQuestionSchema,
  createQuestionnaireSchema,
  updateQuestionnaireSchema,
  createBulkQuestionResponseSchema,
} from "../validations/question.validation.js";
import { AppError } from "../utils/error.js";
import { ZodError } from "zod";

// ==========================================
// QUESTIONNAIRE CRUD
// ==========================================

export async function createQuestionnaire(data: unknown) {
  try {
    const validatedData = createQuestionnaireSchema.parse(data);

    const questionnaire = await prisma.questionnaire.create({
      data: validatedData,
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return questionnaire;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    throw new AppError(`Failed to create questionnaire: ${error}`, 500);
  }
}

export async function getAllQuestionnaires() {
  try {
    const questionnaires = await prisma.questionnaire.findMany({
      where: { isActive: true },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return questionnaires;
  } catch (error) {
    throw new AppError(`Failed to fetch questionnaires: ${error}`, 500);
  }
}

export async function getQuestionnaireById(questionnaireId: number) {
  try {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { questionnaireId },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!questionnaire) {
      throw new AppError("Questionnaire not found", 404);
    }

    return questionnaire;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch questionnaire: ${error}`, 500);
  }
}

export async function updateQuestionnaire(data: unknown) {
  try {
    const validatedData = updateQuestionnaireSchema.parse(data);
    const { questionnaireId, ...updateData } = validatedData;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { questionnaireId },
    });

    if (!questionnaire) {
      throw new AppError("Questionnaire not found", 404);
    }

    const updated = await prisma.questionnaire.update({
      where: { questionnaireId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return updated;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to update questionnaire: ${error}`, 500);
  }
}

// ==========================================
// QUESTION CRUD
// ==========================================

export async function createQuestion(data: unknown) {
  try {
    const validatedData = createQuestionSchema.parse(data);

    // Verify questionnaire exists
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { questionnaireId: validatedData.questionnaireId },
    });

    if (!questionnaire) {
      throw new AppError("Questionnaire not found", 404);
    }

    const question = await prisma.question.create({
      data: validatedData,
    });

    return question;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to create question: ${error}`, 500);
  }
}

export async function getAllQuestions() {
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      include: {
        questionnaire: true,
      },
      orderBy: [{ questionnaireId: "asc" }, { order: "asc" }],
    });

    return questions;
  } catch (error) {
    throw new AppError(`Failed to fetch questions: ${error}`, 500);
  }
}

export async function getQuestionsByQuestionnaire(questionnaireId: number) {
  try {
    // Verify questionnaire exists
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { questionnaireId },
    });

    if (!questionnaire) {
      throw new AppError("Questionnaire not found", 404);
    }

    const questions = await prisma.question.findMany({
      where: { questionnaireId, isActive: true },
      orderBy: { order: "asc" },
    });

    return questions;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch questions: ${error}`, 500);
  }
}

export async function getQuestionById(questionId: number) {
  try {
    const question = await prisma.question.findUnique({
      where: { questionId },
      include: {
        questionnaire: true,
      },
    });

    if (!question) {
      throw new AppError("Question not found", 404);
    }

    return question;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch question: ${error}`, 500);
  }
}

export async function updateQuestion(data: unknown) {
  try {
    const validatedData = updateQuestionSchema.parse(data);
    const { questionId, ...updateData } = validatedData;

    const question = await prisma.question.findUnique({
      where: { questionId },
    });

    if (!question) {
      throw new AppError("Question not found", 404);
    }

    const updated = await prisma.question.update({
      where: { questionId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        questionnaire: true,
      },
    });

    return updated;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to update question: ${error}`, 500);
  }
}

export async function deleteQuestion(questionId: number) {
  try {
    const question = await prisma.question.findUnique({
      where: { questionId },
    });

    if (!question) {
      throw new AppError("Question not found", 404);
    }

    // Soft delete
    const deleted = await prisma.question.update({
      where: { questionId },
      data: { isActive: false, updatedAt: new Date() },
      include: {
        questionnaire: true,
      },
    });

    return deleted;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to delete question: ${error}`, 500);
  }
}

// ==========================================
// QUESTION RESPONSES
// ==========================================

export async function createBulkQuestionResponses(data: unknown) {
  try {
    const validatedData = createBulkQuestionResponseSchema.parse(data);
    const { donationId, responses } = validatedData;

    // Verify donation exists
    const donation = await prisma.donation.findUnique({
      where: { donationId },
    });

    if (!donation) {
      throw new AppError("Donation not found", 404);
    }

    // Delete existing responses for this donation
    await prisma.questionResponse.deleteMany({
      where: { donationId },
    });

    // Create new responses
    const createdResponses = await prisma.questionResponse.createMany({
      data: responses.map((r) => ({
        donationId,
        questionId: r.questionId,
        answer: r.answer,
      })),
    });

    // Fetch created responses with question details
    const allResponses = await prisma.questionResponse.findMany({
      where: { donationId },
      include: {
        question: {
          include: {
            questionnaire: true,
          },
        },
      },
      orderBy: { question: { order: "asc" } },
    });

    return allResponses;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to create question responses: ${error}`, 500);
  }
}

export async function getQuestionResponsesByDonation(donationId: number) {
  try {
    // Verify donation exists
    const donation = await prisma.donation.findUnique({
      where: { donationId },
    });

    if (!donation) {
      throw new AppError("Donation not found", 404);
    }

    const responses = await prisma.questionResponse.findMany({
      where: { donationId },
      include: {
        question: {
          include: {
            questionnaire: true,
          },
        },
      },
      orderBy: { question: { order: "asc" } },
    });

    return responses;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch question responses: ${error}`, 500);
  }
}

export async function getQuestionResponseById(responseId: number) {
  try {
    const response = await prisma.questionResponse.findUnique({
      where: { responseId },
      include: {
        question: {
          include: {
            questionnaire: true,
          },
        },
        donation: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!response) {
      throw new AppError("Question response not found", 404);
    }

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch question response: ${error}`, 500);
  }
}
