import prisma from "../config/db.js";
import {
  createAdminCtsSchema,
  updateAdminCtsSchema,
} from "../validations/donation.validation.js";
import { AppError } from "../utils/error.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { generateAdminToken, createEmailVerifyToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

//////////////////////////////////////////////////////////////////////////////////////////

export async function createAdminCts(data: unknown, superAdminId: number) {
  try {
    const validatedData = createAdminCtsSchema.parse(data);

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });
    console.log("total admn");
    console.log(await prisma.admin.count());
    if (existingAdmin) {
      throw new AppError("Email already exists", 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.passwordHash, 10);

    const admin = await prisma.admin.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        passwordHash: hashedPassword,
        phone: validatedData.phone,
        employeeId: validatedData.employeeId,
        role: "admin_cts",
        activatedAt: new Date(),
        activatedBy: superAdminId,
      },
    });

    // Email is fire-and-forget: a delivery failure must NOT roll back the admin
    // creation or surface as a 5xx — the row is already committed.
    try {
      const token = createEmailVerifyToken(admin.adminId);
      const verificationLink = `${env.CLIENT_URL}/verify-email?token=${token}`;
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const templatePath = path.join(__dirname, "../templates/index.html");
      const emailTemplate = await readFile(templatePath, "utf8");

      const html = emailTemplate
        .replace("{{VERIFY_URL}}", verificationLink)
        .replace("{{TEMP_PASSWORD}}", validatedData.passwordHash);

      await sendEmail(admin.email, html);
    } catch (emailError) {
      console.error(
        `Admin ${admin.adminId} created but verification email failed:`,
        emailError,
      );
    }

    const { passwordHash, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to create admin CTS: ${error}`, 500);
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////

export const verifyAdmin = async (token: string) => {
  const payload = jwt.verify(token, env.JWT_SECRET) as {
    userId: string;
    type: string;
  };
  if (payload.type !== "email-verify") {
    throw new AppError("The token is invalid", 401);
  }
  await prisma.admin.update({
    where: { adminId: Number(payload.userId) },
    data: { isVerified: true, emailVerifiedAt: new Date() },
  });
};

//////////////////////////////////////////////////////////////////////////////////////////

export async function updateAdminCts(data: unknown) {
  try {
    const validatedData = updateAdminCtsSchema.parse(data);
    const { adminId, ...updateFields } = validatedData;

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { adminId },
    });

    if (!admin) {
      throw new AppError("Admin CTS not found", 404);
    }

    // If updating email, check for duplicates
    if (updateFields.email && updateFields.email !== admin.email) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: updateFields.email },
      });
      if (existingAdmin) {
        throw new AppError("Email already exists", 400);
      }
    }

    const updatedAdmin = await prisma.admin.update({
      where: { adminId },
      data: updateFields,
    });

    // Don't return password hash
    const { passwordHash, ...adminWithoutPassword } = updatedAdmin;
    return adminWithoutPassword;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to update admin CTS: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getAdminCtsList() {
  try {
    const admins = await prisma.admin.findMany({
      where: {
        role: "admin_cts",
        deletedAt: null,
      },
      select: {
        adminId: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        lastLoginAt: true,
        activatedAt: true,
        deactivatedAt: true,
        createdAt: true,
        updatedAt: true,
        isVerified: true,
        emailVerifiedAt: true,
      },
    });

    return admins;
  } catch (error) {
    throw new AppError(`Failed to fetch admin CTS list: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getAdminCtsById(adminId: number) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId },
      select: {
        adminId: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        lastLoginAt: true,
        activatedAt: true,
        activatedBy: true,
        deactivatedAt: true,
        deactivatedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new AppError("Admin CTS not found", 404);
    }

    return admin;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch admin CTS: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function deactivateAdminCts(
  adminId: number,
  deactivatedBy: number,
) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId },
    });

    if (!admin) {
      throw new AppError("Admin CTS not found", 404);
    }

    if (admin.deactivatedAt) {
      throw new AppError("Admin CTS is already deactivated", 400);
    }

    const deactivatedAdmin = await prisma.admin.update({
      where: { adminId },
      data: {
        deactivatedAt: new Date(),
        deactivatedBy,
      },
      select: {
        adminId: true,
        fullName: true,
        email: true,
        deactivatedAt: true,
        deactivatedBy: true,
      },
    });

    return deactivatedAdmin;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to deactivate admin CTS: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function activateAdminCts(adminId: number, activatedBy: number) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId },
    });

    if (!admin) {
      throw new AppError("Admin CTS not found", 404);
    }

    const activatedAdmin = await prisma.admin.update({
      where: { adminId },
      data: {
        activatedAt: new Date(),
        activatedBy,
        deactivatedAt: null,
        deactivatedBy: null,
      },
      select: {
        adminId: true,
        fullName: true,
        email: true,
        activatedAt: true,
        activatedBy: true,
      },
    });

    return activatedAdmin;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to activate admin CTS: ${error}`, 500);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function deleteAdminCts(adminId: number) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId },
    });

    if (!admin) {
      throw new AppError("Admin CTS not found", 404);
    }

    await prisma.admin.update({
      where: { adminId },
      data: {
        deletedAt: new Date(),
      },
    });

    return admin;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to delete admin CTS: ${error}`, 500);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////

export const adminLogin = async (email: string, password: string) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateAdminToken(admin.adminId, admin.email, admin.role);

    // Update last login timestamp
    await prisma.admin.update({
      where: { adminId: admin.adminId },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash, ...resAdmin } = admin;
    return { resAdmin, token };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new AppError(`Failed to login admin: ${errorMessage}`, 500);
  }
};
