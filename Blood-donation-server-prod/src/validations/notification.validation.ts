import { z } from "zod";
import { NotificationType } from "../../generated/prisma/index.js";

// -------------------------------
// Reusable Schemas
// -------------------------------
const IdSchema = z.number().int().positive();
const PaginationSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .refine((v) => v >= 1, "Must be at least 1");

const NotificationTypeSchema = z.nativeEnum(NotificationType);

// -------------------------------
// Create Notification
// -------------------------------

export const createNotificationSchema = z.object({
  userId: IdSchema,
  notificationType: NotificationTypeSchema,
  title: z.string().min(1).max(255).optional(),
  message: z.string().min(1).max(1000).optional(),
});

// -------------------------------
// Update Notification
// -------------------------------

export const updateNotificationSchema = z.object({
  notificationId: IdSchema,
  title: z.string().min(1).max(255).optional(),
  message: z.string().min(1).max(1000).optional(),
  read: z.boolean().optional(),
});

// -------------------------------
// Mark as Read
// -------------------------------

export const markAsReadSchema = z.object({
  notificationId: IdSchema,
});

// -------------------------------
// Bulk Mark as Read
// -------------------------------

export const bulkMarkAsReadSchema = z.object({
  notificationIds: z.array(IdSchema).min(1).max(50),
});

// -------------------------------
// Filters & Queries
// -------------------------------

export const notificationFiltersSchema = z
  .object({
    page: PaginationSchema.default(1),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((v) => v >= 1 && v <= 100, "Limit 1-100")
      .default(10),
    userId: IdSchema.optional(),
    notificationType: NotificationTypeSchema.optional(),
    read: z
      .string()
      .transform((s) => s === "true")
      .optional(),
    dateFrom: z
      .string()
      .datetime()
      .transform((s) => new Date(s))
      .optional(),
    dateTo: z
      .string()
      .datetime()
      .transform((s) => new Date(s))
      .optional(),
  })
  .refine((q) => !q.dateFrom || !q.dateTo || q.dateFrom <= q.dateTo, {
    message: "dateFrom must be before or equal to dateTo",
    path: ["dateFrom"],
  });

// -------------------------------
// Bulk Create Notifications
// -------------------------------

export const bulkCreateNotificationsSchema = z.object({
  userIds: z.array(IdSchema).min(1).max(100),
  notificationType: NotificationTypeSchema,
  title: z.string().min(1).max(255).optional(),
  message: z.string().min(1).max(1000).optional(),
});

// -------------------------------
// TypeScript Types
// -------------------------------

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
export type BulkMarkAsReadInput = z.infer<typeof bulkMarkAsReadSchema>;
export type NotificationFilters = z.infer<typeof notificationFiltersSchema>;
export type BulkCreateNotificationsInput = z.infer<
  typeof bulkCreateNotificationsSchema
>;
