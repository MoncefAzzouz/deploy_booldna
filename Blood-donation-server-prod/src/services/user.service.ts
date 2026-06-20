import { generateUserToken } from "../utils/jwt.js";
import {
  userLoginSchema,
  userRegisterSchema,
  userPasswordChangeSchema,
} from "../validations/user.validation.js";
import { AppError } from "../utils/error.js";
import prisma from "../config/db.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { BloodGroup } from "../../generated/prisma/index.js";

/////////////////////////////////////////////////////////////////////////////////////////////

export const registerUser = async (data: unknown) => {
  try {
    const validatedData = userRegisterSchema.parse(data);
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    const hashPassord = await bcrypt.hash(validatedData.password, 10);
    const { password, ...userData } = validatedData;

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashPassord,
        bloodGroup: validatedData.bloodGroup as BloodGroup,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error);
    }
    throw new AppError(`Failed to register user: ${error}`, 500);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////

export const loginUser = async (data: unknown) => {
  try {
    const validatedData = userLoginSchema.parse(data);
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }
    const token = generateUserToken(user.userId, user.email);
    const { password, ...userWithoutPassword } = user;
    return { userWithoutPassword, token };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error);
    }
    throw new AppError(`Failed to login user: ${error}`, 500);
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////

export const changeUserPassword = async (userId: number, data: unknown) => {
  try {
    const validatedData = userPasswordChangeSchema.parse(data);
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const isOldPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new AppError("Old password is incorrect", 401);
    }
    const newHashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
    await prisma.user.update({
      where: { userId },
      data: { password: newHashedPassword },
    });
    return true;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Validation failed", 400, true, error);
    }
    throw new AppError(`Failed to change password: ${error}`, 500);
  }
};
