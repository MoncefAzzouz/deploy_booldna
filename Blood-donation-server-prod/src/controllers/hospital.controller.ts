import { Request } from "express";
import { AppError } from "../utils/error.js";
import {
  createHospital,
  updateHospital,
  getHospitals,
  getHospitalById,
  deleteHospital,
} from "../services/hospital.service.js";
import { asyncHandler } from "../utils/asynchandler.js";

//////////////////////////////////////////////////////////////////////////////////////////

export const createHospitalController = asyncHandler(
  async (req: Request) => {
    return await createHospital(req.body);
  },
  {
    createdMessage: "Hospital created successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const updateHospitalController = asyncHandler(
  async (req: Request) => {
    const hospitalId = parseInt(req.params.id);
    if (!hospitalId || isNaN(hospitalId)) {
      throw new AppError("Invalid hospital ID", 400);
    }

    const hospitalData = { ...req.body, hospitalId };
    return await updateHospital(hospitalData);
  },
  {
    successMessage: "Hospital updated successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const getHospitalByIdController = asyncHandler(
  async (req: Request) => {
    const hospitalId = parseInt(req.params.id);

    if (!hospitalId || isNaN(hospitalId)) {
      throw new AppError("Invalid hospital ID", 400);
    }

    const hospital = await getHospitalById(hospitalId);
    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    return hospital;
  },
  {
    successMessage: "Hospital retrieved successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const getHospitalsController = asyncHandler(
  async () => {
    const hospitals = await getHospitals();
    return hospitals;
  },
  {
    successMessage: "Hospitals retrieved successfully",
  }
);

//////////////////////////////////////////////////////////////////////////////////////////

export const deleteHospitalController = asyncHandler(
  async (req: Request) => {
    const hospitalId = parseInt(req.params.id);
    if (!hospitalId || isNaN(hospitalId)) {
      throw new AppError("Invalid hospital ID", 400);
    }

    const deleted = await deleteHospital(hospitalId);
    if (!deleted) {
      throw new AppError("Hospital not found", 404);
    }

    return null;
  },
  {
    noContent: true,
  }
);
