import { Request, Response } from "express";
import { AppError } from "../utils/error.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { longPollingManager } from "../utils/longPolling.js";
import {
  getUserNotifications,
  getPendingNotificationsForLongPoll,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notification.service.js";

////////////////////////////////////////////////////////////////////////////////////////////

export const pollNotificationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    const timeout = parseInt(req.query.timeout as string) || 30000; // 30 seconds default
    const lastNotificationId = req.query.lastNotificationId
      ? parseInt(req.query.lastNotificationId as string)
      : undefined;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing",
      });
    }

    // Validate timeout
    if (timeout < 1000 || timeout > 60000) {
      return res.status(400).json({
        success: false,
        error: "Timeout must be between 1000ms and 60000ms",
      });
    }

    if (
      req.query.lastNotificationId !== undefined &&
      (lastNotificationId === undefined || Number.isNaN(lastNotificationId))
    ) {
      return res.status(400).json({
        success: false,
        error: "lastNotificationId must be a valid number",
      });
    }

    const pendingNotifications = await getPendingNotificationsForLongPoll(
      userId,
      lastNotificationId,
    );

    if (pendingNotifications.length > 0) {
      return res.status(200).json({
        success: true,
        data: {
          hasUpdates: true,
          notifications: pendingNotifications,
          pollTimeout: false,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Set headers for long polling
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Register connection with long polling manager
    const connectionId = longPollingManager.registerConnection(
      userId,
      res,
      timeout,
    );

    // Clean up on client disconnect
    req.on("close", () => {
      longPollingManager.removeConnection(connectionId);
    });

    req.on("error", () => {
      longPollingManager.removeConnection(connectionId);
    });
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to establish long polling connection",
      });
    }
  }
};

////////////////////////////////////////////////////////////////////////////////////////////

export const getNotificationsController = asyncHandler(async (req: Request) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError("Unauthorized: User ID missing", 401);
  }

  const result = await getUserNotifications(userId, req.query);
  return result;
});

////////////////////////////////////////////////////////////////////////////////////////////

export const markNotificationAsReadController = asyncHandler(
  async (req: Request) => {
    const notificationId = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!notificationId || isNaN(notificationId)) {
      throw new AppError("Invalid notification ID", 400);
    }

    if (!userId) {
      throw new AppError("Unauthorized: User ID missing", 401);
    }

    const notification = await markNotificationAsRead({
      notificationId,
    });

    // Verify the notification belongs to the user
    if (notification.userId !== userId) {
      throw new AppError("Unauthorized access to notification", 403);
    }

    return notification;
  },
  {
    successMessage: "Notification marked as read successfully",
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const deleteNotificationController = asyncHandler(
  async (req: Request) => {
    const notificationId = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!notificationId || isNaN(notificationId)) {
      throw new AppError("Invalid notification ID", 400);
    }

    if (!userId) {
      throw new AppError("Unauthorized: User ID missing", 401);
    }

    // First verify the notification belongs to the user
    const notification = await deleteNotification(notificationId);

    if (notification.userId !== userId) {
      throw new AppError("Unauthorized access to notification", 403);
    }

    return notification;
  },
  {
    successMessage: "Notification deleted successfully",
  },
);
