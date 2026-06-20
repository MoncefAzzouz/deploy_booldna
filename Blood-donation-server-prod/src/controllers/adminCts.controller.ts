import { Request } from "express";
import { AppError } from "../utils/error.js";
import {
  createAdminCts,
  updateAdminCts,
  getAdminCtsList,
  getAdminCtsById,
  deactivateAdminCts,
  activateAdminCts,
  deleteAdminCts,
  adminLogin,
} from "../services/admincts.service.js";
import { asyncHandler } from "../utils/asynchandler.js";

//////////////////////////////////////////////////////////////////////////////////////////

export const createAdminCtsController = asyncHandler(
  async (req: Request) => {
    if (!req.admin) {
      throw new AppError("Admin authentication required", 401);
    }
    return await createAdminCts(req.body, req.admin.adminId);
  },
  {
    createdMessage: "Admin CTS created successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const updateAdminCtsController = asyncHandler(
  async (req: Request) => {
    const adminId = parseInt(req.params.id);
    if (!adminId || isNaN(adminId)) {
      throw new AppError("Invalid admin ID", 400);
    }

    const adminData = { ...req.body, adminId };
    return await updateAdminCts(adminData);
  },
  {
    successMessage: "Admin CTS updated successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const getAdminCtsListController = asyncHandler(
  async (req: Request) => {
    const result = await getAdminCtsList();

    return result;
  },
  {
    successMessage: "Admin CTS list retrieved successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const getAdminCtsController = asyncHandler(
  async (req: Request) => {
    const adminId = parseInt(req.params.id);

    if (!adminId || isNaN(adminId)) {
      throw new AppError("Invalid admin ID", 400);
    }

    const admin = await getAdminCtsById(adminId);
    if (!admin) {
      throw new AppError("Admin CTS not found", 404);
    }

    return admin;
  },
  {
    successMessage: "Admin CTS retrieved successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const deactivateAdminCtsController = asyncHandler(
  async (req: Request) => {
    const adminId = parseInt(req.params.id);
    if (!adminId || isNaN(adminId)) {
      throw new AppError("Invalid admin ID", 400);
    }

    if (!req.admin) {
      throw new AppError("Admin authentication required", 401);
    }

    const deactivated = await deactivateAdminCts(adminId, req.admin.adminId);
    if (!deactivated) {
      throw new AppError("Admin CTS not found", 404);
    }

    return deactivated;
  },
  {
    successMessage: "Admin CTS deactivated successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const activateAdminCtsController = asyncHandler(
  async (req: Request) => {
    const adminId = parseInt(req.params.id);
    if (!adminId || isNaN(adminId)) {
      throw new AppError("Invalid admin ID", 400);
    }

    if (!req.admin) {
      throw new AppError("Admin authentication required", 401);
    }

    const activated = await activateAdminCts(adminId, req.admin.adminId);
    if (!activated) {
      throw new AppError("Admin CTS not found", 404);
    }

    return activated;
  },
  {
    successMessage: "Admin CTS activated successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const deleteAdminCtsController = asyncHandler(
  async (req: Request) => {
    const adminId = parseInt(req.params.id);
    if (!adminId || isNaN(adminId)) {
      throw new AppError("Invalid admin ID", 400);
    }

    const deleted = await deleteAdminCts(adminId);
    if (!deleted) {
      throw new AppError("Admin CTS not found", 404);
    }

    return null;
  },
  {
    noContent: true,
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const loginAdminCtsController = asyncHandler(
  async (req: Request) => {
    if (!req.body.email || !req.body.password) {
      throw new AppError("Email and password are required", 400);
    }
    return await adminLogin(req.body.email, req.body.password);
  },
  {
    successMessage: "Admin CTS logged in successfully",
  }
);
