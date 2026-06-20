import { Router } from "express";
import {
  authenticateUser,
  authenticateAdmin,
  requireAnyAdmin,
} from "../middleware/auth.js";

import {
  createBloodAlertController,
  getBloodAlertsController,
  getBloodAlertByIdController,
  deleteBloodAlertController,
  updateBloodAlertController,
  getBloodAlertDonationsController,
} from "../apis/v1/alert.controller.js";

const router = Router();

router.post(
  "/alerts/admin/:adminId",
  authenticateAdmin,
  createBloodAlertController,
);

// Changed from authenticateUser to authenticateAdmin — the admin dashboard
// fetches alerts with an admin token, but these routes originally used authenticateUser
// which would reject the admin token with 401 (it looks for userId, not adminId)
router.get("/alerts", authenticateAdmin, getBloodAlertsController);

// Same auth change as above
router.get("/alerts/:id", authenticateAdmin, getBloodAlertByIdController);

router.put(
  "/alerts/admin/:adminId",
  authenticateAdmin,
  updateBloodAlertController,
);

router.delete("/alerts/:id", authenticateAdmin, deleteBloodAlertController);

router.get(
  "/alerts/:alertId/donations",
  authenticateAdmin,
  requireAnyAdmin,
  getBloodAlertDonationsController,
);

export default router;
