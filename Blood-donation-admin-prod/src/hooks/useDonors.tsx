import { useCallback, useEffect, useState } from "react";
import { getAllDonationsRaw } from "../services/donationsService";
import type { ApiDonation, Donor } from "../types/donors";
import { formatDateIsoToYmd } from "../utils/formatData";

/**
 * Maps raw API donation objects to a deduplicated Donor[] array.
 *
 * Fixed field mapping to match actual API response:
 * - user.phone → user.phoneNumber (API returns phoneNumber, not phone)
 * - user.city → user.address (API returns address, not city)
 * - alert.hospitalName → alert.hospital.name (API nests hospital as object)
 */
function mapDonationsToDonors(apiDonations: ApiDonation[]): Donor[] {
  const donorsMap = new Map<number, Donor>();

  apiDonations.forEach((d) => {
    const user = d.user;
    if (!user) return;

    if (!donorsMap.has(user.userId)) {
      donorsMap.set(user.userId, {
        id: user.userId,
        name: user.fullName,
        bloodType: user.bloodGroup ?? "—",
        phone: user.phoneNumber ?? "—",
        email: user.email ?? "—",
        city: user.address ?? "—",
        donations: [],
      });
    }

    const donor = donorsMap.get(user.userId)!;
    donor.donations.push({
      date: formatDateIsoToYmd(d.donationDate),
      location: d.alert?.hospital?.name ?? d.alert?.hospitalName ?? "Centre hospitalier",
    });
  });

  const donors = Array.from(donorsMap.values()).map((donor) => {
    donor.donations.sort((a, b) => (a.date < b.date ? 1 : -1));
    return donor;
  });

  donors.sort((a, b) => {
    const ad = a.donations[0]?.date ?? "";
    const bd = b.donations[0]?.date ?? "";
    return ad < bd ? 1 : -1;
  });

  return donors;
}

export default function useDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setError(null);
    try {
      setRefreshing(true);
      const apiDonations = await getAllDonationsRaw();
      const mapped = mapDonationsToDonors(apiDonations);
      setDonors(mapped);
    } catch (err: any) {
      console.error("Failed to fetch donations", err);
      setError(err?.message ?? "Erreur lors du chargement");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    donors,
    loading,
    refreshing,
    error,
    refresh: fetch,
    setDonors,
  };
}
