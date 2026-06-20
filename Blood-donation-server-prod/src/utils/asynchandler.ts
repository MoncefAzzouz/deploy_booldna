import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "./error.js";
import {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendValidationError,
  sendNoContent,
} from "./response.js";

type ControllerFunction = (req: Request, res: Response) => Promise<any>;

interface AsyncHandlerOptions {
  successMessage?: string;
  createdMessage?: string;
  noContent?: boolean;
  customErrorHandler?: (error: any, res: Response) => void;
}

export const asyncHandler = (
  controllerFn: ControllerFunction,
  options: AsyncHandlerOptions = {},
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const result = await controllerFn(req, res);

      if (options.noContent) {
        return sendNoContent(res);
      }

      if (options.createdMessage) {
        return sendCreated(res, options.createdMessage, result);
      }

      return sendSuccess(
        res,
        options.successMessage || "Operation completed successfully",
        result,
      );
    } catch (error) {
      // Use custom error handler if provided
      if (options.customErrorHandler) {
        return options.customErrorHandler(error, res);
      }

      // Default error handling
      if (error instanceof ZodError) {
        return sendValidationError(res, error.message, "Validation failed");
      }

      if (error instanceof AppError) {
        if (error.statusCode === 404) {
          return sendNotFound(res, error.message);
        }
        return sendError(res, error.message, error.statusCode, error.details);
      }

      return sendError(res, "Internal server error", 500);
    }
  };
};
