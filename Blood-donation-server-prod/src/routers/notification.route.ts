import { Router } from "express";
import {
  pollNotificationsController,
  getNotificationsController,
  markNotificationAsReadController,
  deleteNotificationController,
} from "../controllers/notification.controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = Router();

// Long polling endpoint for real-time notifications
router.get(
  "/notifications/poll",
  authenticateUser,
  pollNotificationsController,
);

router.get("/notifications", authenticateUser, getNotificationsController);

router.patch(
  "/notifications/:id/read",
  authenticateUser,
  markNotificationAsReadController,
);

router.delete(
  "/notifications/:id",
  authenticateUser,
  deleteNotificationController,
);

export default router;
