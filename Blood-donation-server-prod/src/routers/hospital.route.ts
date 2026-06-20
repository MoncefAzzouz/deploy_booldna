import {
  createHospitalController,
  deleteHospitalController,
  getHospitalByIdController,
  updateHospitalController,
  getHospitalsController,
} from "../apis/v1/hospital.controller.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { requireSuperAdmin } from "../middleware/auth.js";
import { Router } from "express";

const router = Router();

router.get("/hospitals", authenticateAdmin, getHospitalsController);

router.post(
  "/hospitals",
  authenticateAdmin,
  requireSuperAdmin,
  createHospitalController
);

router.get("/hospitals/:id", authenticateAdmin, getHospitalByIdController);

router.put(
  "/hospitals/:id",
  authenticateAdmin,
  requireSuperAdmin,
  updateHospitalController
);

router.delete(
  "/hospitals/:id",
  authenticateAdmin,
  requireSuperAdmin,
  deleteHospitalController
);

export default router;
