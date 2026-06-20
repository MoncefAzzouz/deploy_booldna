import { Request } from "express";
import { AppError } from "../utils/error.js";
import {
  registerUser,
  loginUser,
  changeUserPassword,
} from "../services/user.service.js";
import { asyncHandler } from "../utils/asynchandler.js";

//////////////////////////////////////////////////////////////////////////////////////////

export const registerUserController = asyncHandler(
  async (req: Request) => {
    return await registerUser(req.body);
  },
  {
    createdMessage: "User registered successfully",
  },
);

//////////////////////////////////////////////////////////////////////////////////////////

export const loginUserController = asyncHandler(
  async (req: Request) => {
    return await loginUser(req.body);
  },
  {
    successMessage: "User logged in successfully",
  },
);

//////////////////////////////////////////////////////////////////////////////////////////

export const changePasswordController = asyncHandler(
  async (req: Request) => {
    const userId = parseInt(req.params.id);
    if (!userId || isNaN(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    return await changeUserPassword(userId, req.body);
  },
  {
    successMessage: "Password changed successfully",
  },
);

//////////////////////////////////////////////////////////////////////////////////////////
