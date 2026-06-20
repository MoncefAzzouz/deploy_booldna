import prisma from "../config/db.js";
import {
  createBloodAlertSchema,
  updateBloodAlertSchema,
} from "../validations/alert.validation.js";
import { AppError } from "../utils/error.js";
import { ZodError } from "zod";
import { longPollingManager } from "../utils/longPolling.js";

//////////////////////////////////////////////////////////////////////////////////////////

export async function createBloodAlert(data: unknown, adminId: number) {
  try {
    const validatedData = createBloodAlertSchema.parse(data);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const bloodAlert = await prisma.bloodAlert.create({
      data: {
        hospitalId: validatedData.hospitalId,
        bloodGroup: validatedData.bloodGroup,
        quantityUnits: validatedData.quantityUnits,
        urgencyLevel: validatedData.urgencyLevel,
        description: validatedData.description,
        createdBy: adminId,
        status: "active",
      },
      include: {
        hospital: true,
        createdByAdmin: true,
      },
    });

    const eligibleUsers = await prisma.user.findMany({
      where: {
        bloodGroup: validatedData.bloodGroup,
        deletedAt: null,
        emailVerifiedAt: { not: null },
        donations: {
          none: {
            status: "confirmed",
            donationDate: {
              gte: threeMonthsAgo,
            },
          },
        },
      },
      select: {
        userId: true,
      },
    });

    if (eligibleUsers.length > 0) {
      const title = `Urgent blood need: ${validatedData.bloodGroup}`;
      const message = `${validatedData.quantityUnits} unit(s) requested with ${validatedData.urgencyLevel} urgency.`;

      const createdNotifications = await prisma.$transaction(async (tx) => {
        await tx.userBloodAlert.createMany({
          data: eligibleUsers.map((user) => ({
            userId: user.userId,
            alertId: bloodAlert.alertId,
          })),
          skipDuplicates: true,
        });

        return Promise.all(
          eligibleUsers.map((user) =>
            tx.notification.create({
              data: {
                userId: user.userId,
                notificationType: "alert",
                title,
                message,
              },
            }),
          ),
        );
      });

      for (const notification of createdNotifications) {
        longPollingManager.notifyUser(notification.userId, [notification]);
      }
    }

    return bloodAlert;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    throw new AppError(`Failed to create blood alert: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function updateBloodAlert(data: unknown, adminId: number) {
  try {
    const validatedData = updateBloodAlertSchema.parse(data);
    const { alertId, ...updateData } = validatedData;

    // Check if blood alert exists
    const existingAlert = await prisma.bloodAlert.findUnique({
      where: { alertId },
    });

    if (!existingAlert) {
      throw new AppError("Blood alert not found", 404);
    }

    const bloodAlert = await prisma.bloodAlert.update({
      where: { alertId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        hospital: true,
        createdByAdmin: true,
      },
    });

    return bloodAlert;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to update blood alert: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getBloodAlerts() {
  try {
    // Added _count.donations to include the number of donors per alert.
    // The frontend AlertsList table has a "Donors" column (accessorKey: "donorsCount")
    // that was always showing 0 because this field wasn't being returned.
    const bloodAlerts = await prisma.bloodAlert.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        hospital: true,
        createdByAdmin: true,
        _count: {
          select: { donations: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map _count.donations to donorsCount so the frontend can use it directly
    return bloodAlerts.map((alert) => ({
      ...alert,
      donorsCount: alert._count.donations,
    }));
  } catch (error) {
    throw new AppError(`Failed to fetch blood alerts: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getBloodAlertById(alertId: number) {
  try {
    const bloodAlert = await prisma.bloodAlert.findUnique({
      where: {
        alertId,
        deletedAt: null,
      },
      include: {
        hospital: true,
        createdByAdmin: true,
        donations: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!bloodAlert) {
      throw new AppError("Blood alert not found", 404);
    }

    return bloodAlert;
  } catch (error) {
    throw new AppError(`Failed to fetch blood alert: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function deleteBloodAlert(alertId: number) {
  try {
    const bloodAlert = await prisma.bloodAlert.findUnique({
      where: { alertId },
    });

    if (!bloodAlert) {
      throw new AppError("Blood alert not found", 404);
    }

    // Soft delete
    const deletedAlert = await prisma.bloodAlert.update({
      where: { alertId },
      data: {
        deletedAt: new Date(),
      },
    });

    return deletedAlert;
  } catch (error) {
    throw new AppError(`Failed to delete blood alert: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getBloodAlertDonations(alertId: number) {
  try {
    // Check if blood alert exists
    const existingAlert = await prisma.bloodAlert.findUnique({
      where: { alertId },
    });

    if (!existingAlert) {
      throw new AppError("Blood alert not found", 404);
    }

    const donations = await prisma.donation.findMany({
      where: {
        alertId,
      },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            bloodGroup: true,
          },
        },
        approvedByAdmin: {
          select: {
            adminId: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return donations;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch blood alert donations: ${error}`, 500);
  }
}
