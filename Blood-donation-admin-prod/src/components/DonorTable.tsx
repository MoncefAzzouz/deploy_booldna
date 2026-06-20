import { useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { MaterialReactTable } from "material-react-table";
import { useTranslation } from "react-i18next";
import type { Donor } from "../types/donors";
import DonorAvatar from "./DonorAvatar";
import { translateBloodType } from "../utils/bloodTypeTranslation";
import { sharedMrtProps } from "./mrtTheme";

function getLastDonation(donations: any[], t: any) {
  if (!donations || donations.length === 0) return t("donors.noDonation");
  return new Date(donations[0].date).toLocaleDateString();
}

export default function DonorTable({
  donors,
  isLoading,
  renderDetail,
}: {
  donors: Donor[];
  isLoading?: boolean;
  renderDetail: (donor: Donor) => React.ReactNode;
}) {
  const { t, i18n } = useTranslation();

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      {
        accessorKey: "name",
        header: t("donors.fullName"),
        Cell: ({ cell }: any) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <DonorAvatar name={cell.getValue() as string} />
            <Box>
              <div className="font-bold text-slate-900 dark:text-white">
                {cell.getValue()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t("donors.role")}
              </div>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "bloodType",
        header: t("donors.bloodType"),
        Cell: ({ cell }: any) => (
          <Chip
            label={translateBloodType(cell.getValue() ?? "—")}
            color="error"
            size="small"
            sx={{ fontWeight: "black", textTransform: "uppercase" }}
          />
        ),
        size: 100,
      },
      { accessorKey: "phone", header: t("donors.phone") },
      { accessorKey: "email", header: t("donors.email") },
      { accessorKey: "city", header: t("donors.city") },
      {
        accessorFn: (row: any) => getLastDonation(row.donations, t),
        header: t("donors.lastDonation"),
        id: "lastDonation",
      },
    ],
    [t],
  );

  return (
    <MaterialReactTable
      {...sharedMrtProps<Donor>(i18n.language)}
      columns={columns}
      data={donors}
      enableExpanding
      state={{ isLoading }}
      renderDetailPanel={({ row }) => renderDetail(row.original as Donor)}
    />
  );
}
