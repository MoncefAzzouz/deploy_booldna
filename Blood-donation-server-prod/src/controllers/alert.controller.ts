import {
  createBloodAlert,
  updateBloodAlert,
  getBloodAlertById,
  getBloodAlerts,
  deleteBloodAlert,
  getBloodAlertDonations,
} from "../services/alert.service.js";
import { Request } from "express";
import { AppError } from "../utils/error.js";
import { asyncHandler } from "../utils/asynchandler.js";

////////////////////////////////////////////////////////////////////////////////////////////

export const createBloodAlertController = asyncHandler(
  async (req: Request) => {
    const adminId = req.params.adminId ? parseInt(req.params.adminId) : null;

    if (!adminId) {
      throw new AppError("Unauthorized: Admin ID missing", 401);
    }

    return await createBloodAlert(req.body, adminId);
  },
  {
    createdMessage: "Blood alert created successfully",
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const getBloodAlertsController = asyncHandler(async (req: Request) => {
  return await getBloodAlerts();
});

////////////////////////////////////////////////////////////////////////////////////////////

export const getBloodAlertByIdController = asyncHandler(
  async (req: Request) => {
    const alertId = parseInt(req.params.id);
    if (!alertId || isNaN(alertId)) {
      throw new AppError("Invalid blood alert ID", 400);
    }
    return await getBloodAlertById(alertId);
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const deleteBloodAlertController = asyncHandler(
  async (req: Request) => {
    const alertId = parseInt(req.params.id);
    if (!alertId || isNaN(alertId)) {
      throw new AppError("Invalid blood alert ID", 400);
    }
    return await deleteBloodAlert(alertId);
  },
  {
    successMessage: "Blood alert deleted successfully",
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const updateBloodAlertController = asyncHandler(
  async (req: Request) => {
    const adminId = req.params.adminId ? parseInt(req.params.adminId) : null;

    if (!adminId) {
      throw new AppError("Unauthorized: Admin ID missing", 401);
    }

    return await updateBloodAlert(req.body, adminId);
  },
  {
    createdMessage: "Blood alert updated successfully",
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const getBloodAlertDonationsController = asyncHandler(
  async (req: Request) => {
    const alertId = parseInt(req.params.alertId);
    if (!alertId || isNaN(alertId)) {
      throw new AppError("Invalid blood alert ID", 400);
    }
    return await getBloodAlertDonations(alertId);
  },
  {
    successMessage: "Blood alert donations fetched successfully",
  },
);
