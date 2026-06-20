/**
 * Dashboard Controller
 *
 * Added to provide a single endpoint that returns all aggregated stats
 * needed by the admin dashboard (KPIs, charts, tables).
 * This avoids the frontend making 10+ separate API calls on page load.
 */

import { getDashboardStats } from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const getDashboardStatsController = asyncHandler(async () => {
  return await getDashboardStats();
});
