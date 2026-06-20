/**
 * Fixed: user fields renamed to match actual API response
 * - phone → phoneNumber (matches Prisma schema: phone_number)
 * - city → address (matches Prisma schema: address)
 * - alert.hospital added as nested object (API includes hospital via Prisma include)
 */
export type ApiDonation = {
  donationId: number;
  donationDate: string;
  user?: {
    userId: number;
    fullName: string;
    bloodGroup?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  } | null;
  alert?: {
    alertId?: number;
    hospital?: { name?: string } | null;
    hospitalName?: string;
  } | null;
  status?: string;
  notes?: string | null;
};

export type Donation = {
  date: string; // YYYY-MM-DD or "—"
  location: string;
};

export type Donor = {
  id: number;
  name: string;
  bloodType?: string;
  phone?: string;
  email?: string;
  city?: string;
  donations: Donation[];
};
