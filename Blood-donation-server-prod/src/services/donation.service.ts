import prisma from "../config/db.js";
import {
  createDonationSchema,
  updateDonationSchema,
  validateDonationSchema,
} from "../validations/donation.validation.js";
import { AppError } from "../utils/error.js";
import { ZodError } from "zod";

//////////////////////////////////////////////////////////////////////////////////////////

async function checkDonationEligibility(
  userId: number,
  answeredQuestionnaire: boolean,
) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const recentDonationCount = await prisma.donation.count({
    where: {
      userId,
      donationDate: {
        gte: threeMonthsAgo,
      },

      status: "confirmed",
    },
  });
  if (recentDonationCount > 0) {
    throw new AppError(
      "User can only donate once every three months",
      400,
      true,
    );
  }

  // check if he answered and successfully passed the questionnaire
  if (!answeredQuestionnaire) {
    throw new AppError(
      "User must complete the health questionnaire",
      400,
      true,
    );
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function createDonation(data: unknown) {
  try {
    const validatedData = createDonationSchema.parse(data);

    await checkDonationEligibility(
      validatedData.userId,
      validatedData.questionnaireCompleted,
    );

    const donation = await prisma.donation.create({
      data: {
        userId: validatedData.userId,
        alertId: validatedData.alertId,
        donationDate: validatedData.donationDate,
        quantityUnits: 1, // The user only donates 1 unit at a time
        status: "planned",
        createdBy: validatedData.createdBy,
        questionnaireCompleted: validatedData.questionnaireCompleted,
        questionnaireId: validatedData.questionnaireId,
      },
      include: {
        user: true,
        alert: true,
        questionnaire: true,
      },
    });

    // Create question responses if provided
    if (
      validatedData.questionResponses &&
      validatedData.questionResponses.length > 0
    ) {
      await prisma.questionResponse.createMany({
        data: validatedData.questionResponses.map((response) => ({
          donationId: donation.donationId,
          questionId: response.questionId,
          answer: response.answer,
        })),
      });
    }

    // Fetch donation with all related data
    const completeDonation = await prisma.donation.findUnique({
      where: { donationId: donation.donationId },
      include: {
        user: true,
        alert: true,
        questionnaire: {
          include: {
            questions: true,
          },
        },
        questionResponses: {
          include: {
            question: true,
          },
        },
      },
    });

    return completeDonation;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    throw new AppError(`Failed to create donation: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function updateDonationByAdmin(data: unknown, adminId: number) {
  try {
    const validatedData = updateDonationSchema.parse(data);
    const { donationId, status, notes } = validatedData;

    // Check if donation exists
    const existingDonation = await prisma.donation.findUnique({
      where: { donationId },
    });

    if (!existingDonation) {
      throw new AppError("Donation not found", 404);
    }

    const donation = await prisma.donation.update({
      where: { donationId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedBy: adminId,
        approvedBy:
          status === "confirmed" ? adminId : existingDonation.approvedBy,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        alert: true,
        approvedByAdmin: true,
      },
    });

    return donation;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to update donation: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function validateDonationByAdmin(data: unknown, adminId: number) {
  try {
    const validatedData = validateDonationSchema.parse(data);
    const { donationId, status, notes } = validatedData;

    // Check if donation exists
    const existingDonation = await prisma.donation.findUnique({
      where: { donationId },
    });

    if (!existingDonation) {
      throw new AppError("Donation not found", 404);
    }

    // Validate status transition
    const validTransitions: { [key: string]: string[] } = {
      planned: ["confirmed", "rejected", "cancelled"],
      confirmed: ["rejected", "cancelled"],
      rejected: ["planned"],
      cancelled: ["planned"],
    };

    const currentStatus = existingDonation.status;
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      throw new AppError(
        `Cannot transition from ${currentStatus} to ${status}`,
        400,
      );
    }

    const donation = await prisma.donation.update({
      where: { donationId },
      data: {
        status,
        ...(notes !== undefined && { notes }),
        updatedBy: adminId,
        approvedBy:
          status === "confirmed" ? adminId : existingDonation.approvedBy,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        alert: true,
        approvedByAdmin: true,
      },
    });

    return donation;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to validate donation: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

/**
 * Added: Get all donations for a specific blood alert.
 * The frontend admin panel navigates to /alerts/:id/donations to see
 * which donors responded to a specific alert. This endpoint did not
 * exist before — the route GET /alert/:alertId/donations was missing.
 */
export async function getDonationsByAlertId(alertId: number) {
  try {
    const donations = await prisma.donation.findMany({
      where: { alertId },
      include: {
        user: true,
        alert: true,
        approvedByAdmin: true,
      },
    });

    return donations;
  } catch (error) {
    throw new AppError(`Failed to fetch donations by alert: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getDonations() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        user: true,
        alert: true,
        approvedByAdmin: true,
      },
    });

    return donations;
  } catch (error) {
    throw new AppError(`Failed to fetch donations: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getUserDonations(userId: number) {
  try {
    return await prisma.donation.findMany({
      where: { userId },
      include: {
        alert: {
          include: {
            hospital: true,
          },
        },
        approvedByAdmin: true,
      },
      orderBy: {
        donationDate: "desc",
      },
    });
  } catch (error) {
    throw new AppError(`Failed to fetch user donations: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getUserDonationById(donationId: number, userId: number) {
  try {
    const donation = await prisma.donation.findFirst({
      where: { donationId, userId },
      include: {
        alert: {
          include: {
            hospital: true,
          },
        },
        approvedByAdmin: true,
      },
    });

    if (!donation) {
      throw new AppError("Donation not found", 404);
    }

    return donation;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch user donation: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getDonationById(donationId: number) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { donationId },
      include: {
        user: true,
        alert: true,
        approvedByAdmin: true,
      },
    });

    if (!donation) {
      throw new AppError("Donation not found", 404);
    }

    return donation;
  } catch (error) {
    throw new AppError(`Failed to fetch donation: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function deleteDonation(donationId: number) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { donationId },
    });

    if (!donation) {
      throw new AppError("Donation not found", 404);
    }

    await prisma.donation.delete({
      where: { donationId },
    });

    return donation;
  } catch (error) {
    throw new AppError(`Failed to delete donation: ${error}`, 500);
  }
}
