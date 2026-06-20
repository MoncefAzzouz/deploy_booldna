import {
  createDonationController,
  deleteDonationController,
  getDonationsController,
  getDonationsByAlertIdController,
  getDoncationByIdController,
  getMyDonationByIdController,
  getMyDonationsController,
  updateDonationByAdminController,
  validateDonationByAdminController,
} from "../controllers/donation.controller.js";
import { Router } from "express";
import { authenticateUser, authenticateAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/donations", authenticateUser, createDonationController);
router.get("/users/me/donations", authenticateUser, getMyDonationsController);
router.get("/users/me/donations/:id", authenticateUser, getMyDonationByIdController);

// Changed from authenticateUser to authenticateAdmin — the admin dashboard
// needs to list all donations, but these routes originally required a user token.
// The admin panel sends admin tokens, so authenticateUser would reject with 401.
router.get("/donations", authenticateAdmin, getDonationsController);

// Added: route for fetching donations by alert ID
// The frontend calls GET /alert/:alertId/donations from the DonorsDetails page
router.get("/alert/:alertId/donations", authenticateAdmin, getDonationsByAlertIdController);

// Changed from authenticateUser to authenticateAdmin (same reason as above)
router.get("/donations/:id", authenticateAdmin, getDoncationByIdController);

router.put(
  "/donations/admin/:adminId",
  authenticateAdmin,
  updateDonationByAdminController,
);

router.post(
  "/donations/validate/:adminId",
  authenticateAdmin,
  validateDonationByAdminController,
);

router.delete("/donations/:id", authenticateUser, deleteDonationController);

export default router;
