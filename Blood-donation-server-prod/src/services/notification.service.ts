import prisma from "../config/db.js";
import {
  createNotificationSchema,
  updateNotificationSchema,
  markAsReadSchema,
  bulkMarkAsReadSchema,
  notificationFiltersSchema,
  bulkCreateNotificationsSchema,
} from "../validations/notification.validation.js";
import { AppError } from "../utils/error.js";
import { ZodError } from "zod";
import { longPollingManager } from "../utils/longPolling.js";

//////////////////////////////////////////////////////////////////////////////////////////

export async function createNotification(data: unknown) {
  try {
    const validatedData = createNotificationSchema.parse(data);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { userId: validatedData.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const notification = await prisma.notification.create({
      data: {
        userId: validatedData.userId,
        notificationType: validatedData.notificationType,
        title: validatedData.title,
        message: validatedData.message,
      },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    longPollingManager.notifyUser(notification.userId, [notification]);

    return notification;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to create notification: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function bulkCreateNotifications(data: unknown) {
  try {
    const validatedData = bulkCreateNotificationsSchema.parse(data);

    // Check if all users exist
    const users = await prisma.user.findMany({
      where: {
        userId: { in: validatedData.userIds },
        deletedAt: null,
      },
    });

    if (users.length !== validatedData.userIds.length) {
      throw new AppError("Some users not found", 404);
    }

    const notifications = await prisma.$transaction(
      validatedData.userIds.map((userId) =>
        prisma.notification.create({
          data: {
            userId,
            notificationType: validatedData.notificationType,
            title: validatedData.title,
            message: validatedData.message,
          },
        }),
      ),
    );

    for (const notification of notifications) {
      longPollingManager.notifyUser(notification.userId, [notification]);
    }

    return {
      count: notifications.length,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to create notifications: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function updateNotification(data: unknown) {
  try {
    const validatedData = updateNotificationSchema.parse(data);
    const { notificationId, ...updateData } = validatedData;

    // Check if notification exists
    const existingNotification = await prisma.notification.findUnique({
      where: { notificationId },
    });

    if (!existingNotification) {
      throw new AppError("Notification not found", 404);
    }

    const notification = await prisma.notification.update({
      where: { notificationId },
      data: updateData,
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return notification;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to update notification: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function markNotificationAsRead(data: unknown) {
  try {
    const validatedData = markAsReadSchema.parse(data);

    const notification = await prisma.notification.findUnique({
      where: { notificationId: validatedData.notificationId },
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    const updatedNotification = await prisma.notification.update({
      where: { notificationId: validatedData.notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return updatedNotification;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to mark notification as read: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function bulkMarkAsRead(data: unknown) {
  try {
    const validatedData = bulkMarkAsReadSchema.parse(data);

    const result = await prisma.notification.updateMany({
      where: {
        notificationId: { in: validatedData.notificationIds },
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    throw new AppError(
      `Failed to bulk mark notifications as read: ${error}`,
      500,
    );
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getNotifications() {
  try {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        include: {
          user: {
            select: {
              userId: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          sentAt: "desc",
        },
      }),
      prisma.notification.count(),
    ]);

    return {
      notifications,
      total,
    };
  } catch (error) {
    throw new AppError(`Failed to fetch notifications: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getNotificationById(notificationId: number) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { notificationId },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch notification: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getUserNotifications(userId: number, query: unknown) {
  try {
    const validatedQuery = notificationFiltersSchema.parse(query || {});
    const { page, limit, ...filters } = validatedQuery;

    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (filters.notificationType)
      where.notificationType = filters.notificationType;
    if (filters.read !== undefined) where.read = filters.read;
    if (filters.dateFrom || filters.dateTo) {
      where.sentAt = {};
      if (filters.dateFrom) where.sentAt.gte = filters.dateFrom;
      if (filters.dateTo) where.sentAt.lte = filters.dateTo;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          sentAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    throw new AppError(`Failed to fetch user notifications: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getPendingNotificationsForLongPoll(
  userId: number,
  lastNotificationId?: number,
) {
  try {
    const where: any = {
      userId,
    };

    if (lastNotificationId && lastNotificationId > 0) {
      where.notificationId = {
        gt: lastNotificationId,
      };
    } else {
      where.read = false;
    }

    return await prisma.notification.findMany({
      where,
      orderBy: {
        sentAt: "asc",
      },
      take: 20,
    });
  } catch (error) {
    throw new AppError(
      `Failed to fetch long-poll notifications: ${error}`,
      500,
    );
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function deleteNotification(notificationId: number) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { notificationId },
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    const deletedNotification = await prisma.notification.delete({
      where: { notificationId },
    });

    return deletedNotification;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to delete notification: ${error}`, 500);
  }
}
