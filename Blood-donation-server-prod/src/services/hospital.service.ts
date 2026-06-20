import prisma from "../config/db.js";
import {
  createHospitalSchema,
  updateHospitalSchema,
} from "../validations/hospital.validation.js";
import { AppError } from "../utils/error.js";
import { ZodError } from "zod";

//////////////////////////////////////////////////////////////////////////////////////////

export async function createHospital(data: unknown) {
  try {
    const validatedData = createHospitalSchema.parse(data);

    const hospital = await prisma.hospital.create({
      data: {
        name: validatedData.name,
        address: validatedData.address,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        phone: validatedData.phone,
        email: validatedData.email,
        isActive: validatedData.isActive,
      },
    });

    return hospital;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    throw new AppError(`Failed to create hospital: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function updateHospital(data: unknown) {
  try {
    const validatedData = updateHospitalSchema.parse(data);
    const { hospitalId, ...updateFields } = validatedData;

    const hospital = await prisma.hospital.update({
      where: { hospitalId },
      data: updateFields,
    });

    return hospital;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error);
    }
    throw new AppError(`Failed to update hospital: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getHospitals() {
  try {
    const hospitals = await prisma.hospital.findMany();

    return hospitals;
  } catch (error) {
    throw new AppError(`Failed to fetch hospitals: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getHospitalById(hospitalId: number) {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { hospitalId },
    });

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    return hospital;
  } catch (error) {
    throw new AppError(`Failed to fetch hospital: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function deleteHospital(hospitalId: number) {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { hospitalId },
    });

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    await prisma.hospital.delete({
      where: { hospitalId },
    });

    return hospital;
  } catch (error) {
    throw new AppError(`Failed to delete hospital: ${error}`, 500);
  }
}
