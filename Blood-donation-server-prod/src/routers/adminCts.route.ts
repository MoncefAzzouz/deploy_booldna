import {
  createAdminCtsController,
  deleteAdminCtsController,
  getAdminCtsController,
  updateAdminCtsController,
  getAdminCtsListController,
  deactivateAdminCtsController,
  activateAdminCtsController,
  loginAdminCtsController,
} from "../apis/v1/adminCts.controller.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { requireSuperAdmin } from "../middleware/auth.js";
import { Router } from "express";

const router = Router();

// Get all admin CTS - Super Admin only
router.get(
  "/admins/cts",
  authenticateAdmin,
  requireSuperAdmin,
  getAdminCtsListController,
);

// Create new admin CTS - Super Admin only
router.post(
  "/admins/cts",
  authenticateAdmin,
  requireSuperAdmin,
  createAdminCtsController,
);

// Get admin CTS by ID - Super Admin only
router.get(
  "/admins/cts/:id",
  authenticateAdmin,
  requireSuperAdmin,
  getAdminCtsController,
);

// Update admin CTS - Super Admin only
router.put(
  "/admins/cts/:id",
  authenticateAdmin,
  requireSuperAdmin,
  updateAdminCtsController,
);

// Deactivate admin CTS - Super Admin only
router.patch(
  "/admins/cts/:id/deactivate",
  authenticateAdmin,
  requireSuperAdmin,
  deactivateAdminCtsController,
);

// Activate admin CTS - Super Admin only
router.patch(
  "/admins/cts/:id/activate",
  authenticateAdmin,
  requireSuperAdmin,
  activateAdminCtsController,
);

// Delete admin CTS - Super Admin only
router.delete(
  "/admins/cts/:id",
  authenticateAdmin,
  requireSuperAdmin,
  deleteAdminCtsController,
);

// Admin CTS login
router.post("/admins/cts/login", loginAdminCtsController);

export default router;
