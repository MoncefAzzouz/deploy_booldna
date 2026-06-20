import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { env } from "../config/env.js";
import { log } from "../utils/logger.js";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: "user";
      };
      admin?: {
        adminId: number;
        email: string;
        role: "super_admin" | "admin_cts";
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Authenticating user with token:", token);
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    console.log("Decoded token:", decoded);
    console.log(env.JWT_SECRET);
    // Verify user exist and not delted and email verified
    const user = await prisma.user.findFirst({
      where: {
        userId: decoded.userId,
        deletedAt: null,
      },
    });
    console.log("Authenticated user:", user);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid token or user not found." });
    }

    req.user = {
      userId: user.userId,
      email: user.email,
      role: "user",
    };

    log.info(`User authenticated: ${user.email}`, { userId: user.userId });
    next();
  } catch (error) {
    log.error("User authentication failed", { error });
    res.status(401).json({ error: "Invalid token." });
  }
};

// Admin Authentication Middleware
export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No admin token provided." });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    // Verify admin exists and is active
    const admin = await prisma.admin.findFirst({
      where: {
        adminId: decoded.adminId,
        deletedAt: null,
        activatedAt: { not: null },
        deactivatedAt: null,
      },
    });

    if (!admin) {
      return res
        .status(401)
        .json({ error: "Invalid token or admin not found." });
    }

    req.admin = {
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
    };

    log.info(`Admin authenticated: ${admin.email}`, {
      adminId: admin.adminId,
      role: admin.role,
    });
    next();
  } catch (error) {
    log.error("Admin authentication failed", { error });
    res.status(401).json({ error: "Invalid admin token." });
  }
};

// Admin Authorization Middleware
export const authorizeAdmin = (roles: ("super_admin" | "admin_cts")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: "Admin authentication required." });
    }

    if (!roles.includes(req.admin.role)) {
      log.warn(`Admin authorization failed: ${req.admin.email}`, {
        requiredRoles: roles,
        userRole: req.admin.role,
      });
      return res.status(403).json({
        error: "Insufficient permissions.",
      });
    }

    next();
  };
};

// Super Admin Only
export const requireSuperAdmin = authorizeAdmin(["super_admin"]);

// Any Admin Role
export const requireAnyAdmin = authorizeAdmin(["super_admin", "admin_cts"]);
