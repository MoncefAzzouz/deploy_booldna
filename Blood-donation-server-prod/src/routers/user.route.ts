import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  changePasswordController,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = Router();

router.post("/users/register", registerUserController);

router.post("/users/login", loginUserController);

router.patch(
  "/users/:id/change-password",
  authenticateUser,
  changePasswordController,
);

export default router;
