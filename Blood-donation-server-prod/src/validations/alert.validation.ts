import { z } from "zod";
import { BloodGroup, UrgencyLevel, AlertStatus } from "../../generated/prisma/index.js";

// -------------------------------
// Reusable Schemas
// -------------------------------
const IdSchema = z.number().int().positive();
const PaginationSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .refine((v) => v >= 1, "Must be at least 1");

const BloodGroupSchema = z.nativeEnum(BloodGroup);
const UrgencyLevelSchema = z.nativeEnum(UrgencyLevel);
const AlertStatusSchema = z.nativeEnum(AlertStatus);

// -------------------------------
// Create Blood Alert
// -------------------------------

export const createBloodAlertSchema = z.object({
  hospitalId: IdSchema.optional(),
  bloodGroup: BloodGroupSchema,
  quantityUnits: z.number().int().min(1).max(50).default(1),
  urgencyLevel: UrgencyLevelSchema.default("medium"),
  description: z.string().max(1000).optional(),
});

// -------------------------------
// Update Blood Alert
// -------------------------------

export const updateBloodAlertSchema = z.object({
  alertId: IdSchema,
  hospitalId: IdSchema.optional(),
  bloodGroup: BloodGroupSchema.optional(),
  quantityUnits: z.number().int().min(1).max(50).optional(),
  urgencyLevel: UrgencyLevelSchema.optional(),
  status: AlertStatusSchema.optional(),
  description: z.string().max(1000).optional(),
});

// -------------------------------
// Filters & Queries
// -------------------------------

export const bloodAlertFiltersSchema = z
  .object({
    page: PaginationSchema.default(1),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((v) => v >= 1 && v <= 100, "Limit 1-100")
      .default(10),
    hospitalId: IdSchema.optional(),
    bloodGroup: BloodGroupSchema.optional(),
    urgencyLevel: UrgencyLevelSchema.optional(),
    status: AlertStatusSchema.optional(),
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
    createdBy: IdSchema.optional(),
    quantityUnits: z.number().int().min(1).max(50).optional(),
  })
  .refine((q) => !q.dateFrom || !q.dateTo || q.dateFrom <= q.dateTo, {
    message: "dateFrom must be before or equal to dateTo",
    path: ["dateFrom"],
  });

// -------------------------------
// Bulk Update Blood Alerts
// -------------------------------

export const bulkUpdateBloodAlertsSchema = z.object({
  alertIds: z.array(IdSchema).min(1).max(50),
  updates: z
    .object({
      status: AlertStatusSchema.optional(),
      urgencyLevel: UrgencyLevelSchema.optional(),
      description: z.string().max(1000).optional(),
      quantityUnits: z.number().int().min(1).max(50).optional(),
    })
    .refine(
      (u) => Object.keys(u).length > 0,
      "At least one field to update is required"
    ),
});

// -------------------------------
// TypeScript Types
// -------------------------------

export type CreateBloodAlertInput = z.infer<typeof createBloodAlertSchema>;
export type UpdateBloodAlertInput = z.infer<typeof updateBloodAlertSchema>;
export type BloodAlertFilters = z.infer<typeof bloodAlertFiltersSchema>;
export type BulkUpdateBloodAlertsInput = z.infer<
  typeof bulkUpdateBloodAlertsSchema
>;
