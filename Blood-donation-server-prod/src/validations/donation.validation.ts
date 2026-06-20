import { z } from "zod";
import {
  DonationStatus,
  BloodGroup,
  UrgencyLevel,
} from "../../generated/prisma/index.js";

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
const DonationStatusSchema = z.nativeEnum(DonationStatus);
const UrgencyLevelSchema = z.nativeEnum(UrgencyLevel);

// -------------------------------
// Create Donation
// -------------------------------
export const createDonationSchema = z.object({
  userId: IdSchema,
  alertId: IdSchema,
  donationDate: z
    .string()
    .datetime()
    .transform((s) => new Date(s))
    .refine((d) => d > new Date(), "Donation date must be in the future"),
  quantityUnits: z.number().int().min(1).max(10).default(1),
  createdBy: IdSchema.optional(),
  notes: z.string().max(1000).optional(),
  questionnaireCompleted: z.boolean(),
  questionnaireId: IdSchema.optional(),
  questionResponses: z
    .array(
      z.object({
        questionId: IdSchema,
        answer: z.string().min(1).max(5000),
      }),
    )
    .optional(),
});

// -------------------------------
// Update Donation
// -------------------------------

export const updateDonationSchema = z
  .object({
    donationId: IdSchema,
    donationDate: z
      .string()
      .datetime()
      .transform((s) => new Date(s))
      .optional(),
    quantityUnits: z.number().int().min(1).max(10).optional(),
    status: DonationStatusSchema.optional(),
    approvedBy: IdSchema,
    updatedBy: IdSchema,
    notes: z.string().max(1000).optional(),
  })
  .refine(
    (data) => !(data.status === DonationStatus.confirmed && !data.approvedBy),
    {
      message: "approvedBy is required when confirming donation",
      path: ["approvedBy"],
    },
  );

// -------------------------------
// Filters & Queries
// -------------------------------
export const donationFiltersSchema = z
  .object({
    page: PaginationSchema.default(1),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((v) => v >= 1 && v <= 100, "Limit 1-100")
      .default(10),
    userId: IdSchema.optional(),
    alertId: IdSchema.optional(),
    status: DonationStatusSchema.optional(),
    bloodGroup: BloodGroupSchema.optional(),
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
    approvedBy: IdSchema.optional(),
    quantityUnits: z.number().int().min(1).max(10).optional(),
  })
  .refine((q) => !q.dateFrom || !q.dateTo || q.dateFrom <= q.dateTo, {
    message: "dateFrom must be before or equal to dateTo",
    path: ["dateFrom"],
  });

// -------------------------------
// Approve & Cancel Donation
// -------------------------------
export const approveDonationSchema = z.object({
  donationId: IdSchema,
  adminId: IdSchema,
});

export const validateDonationSchema = z.object({
  donationId: IdSchema,
  status: DonationStatusSchema,
  notes: z.string().max(1000).optional(),
});

export const cancelDonationSchema = z.object({
  donationId: IdSchema,
  cancelledBy: IdSchema.optional(),
  reason: z.string().min(1).max(500).optional(),
});

// -------------------------------
// Bulk Update Donations
// -------------------------------
export const bulkUpdateDonationsSchema = z.object({
  donationIds: z.array(IdSchema).min(1).max(50),
  updates: z
    .object({
      status: DonationStatusSchema.optional(),
      approvedBy: IdSchema.optional(),
      updatedBy: IdSchema.optional(),
      notes: z.string().max(1000).optional(),
    })
    .refine(
      (u) => Object.keys(u).length > 0,
      "At least one field to update is required",
    ),
});

// -------------------------------
// TypeScript Types
// -------------------------------
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type UpdateDonationInput = z.infer<typeof updateDonationSchema>;
export type DonationFilters = z.infer<typeof donationFiltersSchema>;

// ==========================================
// ADMIN CTS (Crisis Team Specialist) Validation
// ==========================================

export const createAdminCtsSchema = z.object({
  fullName: z.string().min(1).max(255),
  email: z.string().email("Invalid email format"),
  passwordHash: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone must be 10 digits starting with 0")
    .optional(),
  employeeId: z.string().max(50).optional(),
});

export const updateAdminCtsSchema = z.object({
  adminId: IdSchema,
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone must be 10 digits starting with 0")
    .optional(),
  employeeId: z.string().max(50).optional(),
});

export const adminCtsFiltersSchema = z.object({
  page: PaginationSchema.default(1),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((v) => v >= 1 && v <= 100, "Limit must be between 1-100")
    .default(10),
  email: z.string().email().optional(),
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  search: z.string().min(1).optional(),
});

export const getAdminCtsSchema = z.object({
  adminId: IdSchema,
});

export const deleteAdminCtsSchema = z.object({
  adminId: IdSchema,
});

// ==========================================
// TypeScript Types
// ==========================================
export type CreateAdminCtsInput = z.infer<typeof createAdminCtsSchema>;
export type UpdateAdminCtsInput = z.infer<typeof updateAdminCtsSchema>;
export type AdminCtsFilters = z.infer<typeof adminCtsFiltersSchema>;
export type GetAdminCtsInput = z.infer<typeof getAdminCtsSchema>;
export type DeleteAdminCtsInput = z.infer<typeof deleteAdminCtsSchema>;
