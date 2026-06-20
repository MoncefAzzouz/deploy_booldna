import {
  createDonation,
  updateDonationByAdmin,
  validateDonationByAdmin,
  getDonationById,
  getDonations,
  getDonationsByAlertId,
  getUserDonationById,
  getUserDonations,
  deleteDonation,
} from "../services/donation.service.js";
import { Request } from "express";
import { AppError } from "../utils/error.js";
import { asyncHandler } from "../utils/asynchandler.js";

////////////////////////////////////////////////////////////////////////////////////////////

export const createDonationController = asyncHandler(
  async (req: Request) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized: User ID missing", 401);
    }

    return await createDonation({ ...req.body, userId });
  },
  {
    createdMessage: "Donation created successfully",
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const getDonationsController = asyncHandler(async () => {
  return await getDonations();
});

////////////////////////////////////////////////////////////////////////////////////////////

// Added: controller for GET /alert/:alertId/donations
// The frontend DonorsDetails page calls this to list donors for a specific alert
export const getDonationsByAlertIdController = asyncHandler(
  async (req: Request) => {
    const alertId = parseInt(req.params.alertId);
    if (!alertId || isNaN(alertId)) {
      throw new AppError("Invalid alert ID", 400);
    }
    return await getDonationsByAlertId(alertId);
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const getDoncationByIdController = asyncHandler(async (req: Request) => {
  const donationId = parseInt(req.params.id);
  if (!donationId || isNaN(donationId)) {
    throw new AppError("Invalid donation ID", 400);
  }
  return await getDonationById(donationId);
});

////////////////////////////////////////////////////////////////////////////////////////////

export const getMyDonationsController = asyncHandler(async (req: Request) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Unauthorized: User ID missing", 401);
  }

  return await getUserDonations(userId);
});

////////////////////////////////////////////////////////////////////////////////////////////

export const getMyDonationByIdController = asyncHandler(async (req: Request) => {
  const userId = req.user?.userId;
  const donationId = parseInt(req.params.id);

  if (!userId) {
    throw new AppError("Unauthorized: User ID missing", 401);
  }

  if (!donationId || isNaN(donationId)) {
    throw new AppError("Invalid donation ID", 400);
  }

  return await getUserDonationById(donationId, userId);
});

////////////////////////////////////////////////////////////////////////////////////////////

export const deleteDonationController = asyncHandler(
  async (req: Request) => {
    const donationId = parseInt(req.params.id);
    if (!donationId || isNaN(donationId)) {
      throw new AppError("Invalid donation ID", 400);
    }
    return await deleteDonation(donationId);
  },
  {
    successMessage: "Donation deleted successfully",
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const updateDonationByAdminController = asyncHandler(
  async (req: Request) => {
    const adminId = req.params.adminId ? parseInt(req.params.adminId) : null;

    if (!adminId) {
      throw new AppError("Unauthorized: Admin ID missing", 401);
    }
    return await updateDonationByAdmin(req.body, adminId);
  },
  {
    createdMessage: "Donation updated successfully",
  },
);

////////////////////////////////////////////////////////////////////////////////////////////

export const validateDonationByAdminController = asyncHandler(
  async (req: Request) => {
    const adminId = req.params.adminId ? parseInt(req.params.adminId) : null;

    if (!adminId) {
      throw new AppError("Unauthorized: Admin ID missing", 401);
    }
    return await validateDonationByAdmin(req.body, adminId);
  },
  {
    successMessage: "Donation validated successfully",
  },
);
