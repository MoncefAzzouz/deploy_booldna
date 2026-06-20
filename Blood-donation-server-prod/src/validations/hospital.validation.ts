import { z } from "zod";

// -------------------------------
// Reusable Schemas
// -------------------------------
const IdSchema = z.number().int().positive();
const NameSchema = z.string().min(1).max(255);
const AddressSchema = z.string().max(500).optional();
const CitySchema = z.string().max(100).optional();
const PostalCodeSchema = z.string().max(20).optional();
const PhoneSchema = z
  .string()
  .regex(
    /^0\d{9}$/,
    "Phone number must be 10 digits starting with 0 (e.g., 0756123456)"
  )
  .optional();
const EmailSchema = z.string().email("Invalid email format").optional();
const PaginationSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .refine((v) => v >= 1, "Must be at least 1");

// -------------------------------
// Create Hospital
// -------------------------------
export const createHospitalSchema = z.object({
  name: NameSchema,
  address: AddressSchema,
  city: CitySchema,
  postalCode: PostalCodeSchema,
  phone: PhoneSchema,
  email: EmailSchema,
  isActive: z.boolean().default(true),
});

// -------------------------------
// Update Hospital
// -------------------------------
export const updateHospitalSchema = z.object({
  hospitalId: IdSchema,
  name: NameSchema.optional(),
  address: AddressSchema,
  city: CitySchema,
  postalCode: PostalCodeSchema,
  phone: PhoneSchema,
  email: EmailSchema,
  isActive: z.boolean().optional(),
});

// -------------------------------
// Hospital Filters & Queries
// -------------------------------
export const hospitalFiltersSchema = z.object({
  page: PaginationSchema.default(1),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((v) => v >= 1 && v <= 100, "Limit must be between 1-100")
    .default(10),
  name: z.string().optional(),
  city: z.string().optional(),
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  search: z.string().min(1).optional(),
});

// -------------------------------
// Get, Delete Hospital by ID
// -------------------------------
export const getHospitalByIdSchema = z.object({
  hospitalId: IdSchema,
});

export const deleteHospitalSchema = z.object({
  hospitalId: IdSchema,
});

// -------------------------------
// Bulk Operations
// -------------------------------
export const bulkUpdateHospitalsSchema = z.object({
  hospitalIds: z.array(IdSchema).min(1).max(50),
  updates: z
    .object({
      isActive: z.boolean().optional(),
      city: CitySchema,
    })
    .refine(
      (u) => Object.keys(u).length > 0,
      "At least one field to update is required"
    ),
});

// -------------------------------
// TypeScript Types
// -------------------------------
export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof updateHospitalSchema>;
export type HospitalFilters = z.infer<typeof hospitalFiltersSchema>;
export type GetHospitalByIdInput = z.infer<typeof getHospitalByIdSchema>;
export type DeleteHospitalInput = z.infer<typeof deleteHospitalSchema>;
export type BulkUpdateHospitalsInput = z.infer<
  typeof bulkUpdateHospitalsSchema
>;
