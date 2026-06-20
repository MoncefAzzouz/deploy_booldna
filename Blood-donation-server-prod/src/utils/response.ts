import { Response } from "express";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Success Response Helper
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

// Error Response Helper
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

// Validation Error Response Helper
export const sendValidationError = (
  res: Response,
  errors: any,
  message: string = "Validation failed"
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: errors,
    timestamp: new Date().toISOString(),
  };

  return res.status(400).json(response);
};

// Not Found Response Helper
export const sendNotFound = (
  res: Response,
  message: string = "Resource not found"
): Response => {
  return sendError(res, message, 404);
};

// Created Response Helper
export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T
): Response => {
  return sendSuccess(res, message, data, 201);
};

// No Content Response Helper
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};
