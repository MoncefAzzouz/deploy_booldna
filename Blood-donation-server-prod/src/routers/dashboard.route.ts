/**
 * Dashboard Route
 *
 * GET /api/v1/dashboard/stats — returns all dashboard data in one call.
 * Requires admin authentication (any admin role can view the dashboard).
 */

import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.js";
import { getDashboardStatsController } from "../apis/v1/dashboard.controller.js";

const router = Router();

router.get("/dashboard/stats", authenticateAdmin, getDashboardStatsController);

export default router;
