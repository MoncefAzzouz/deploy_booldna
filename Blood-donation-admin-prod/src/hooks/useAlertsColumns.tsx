import { useMemo } from "react";
import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translateBloodType } from "../utils/bloodTypeTranslation";

export function useAlertColumns() {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        accessorKey: "alertId",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "hospital.name",
        header: t("alerts.hospital"),
        Cell: ({ cell }: { cell: any }) => cell.getValue() || "-",
      },
      {
        accessorKey: "bloodGroup",
        header: t("alerts.bloodGroup"),
        size: 100,
        Cell: ({ cell }: { cell: any }) => (
          <Chip
            label={translateBloodType(cell.getValue() as string)}
            color="error"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        ),
      },
      {
        accessorKey: "status",
        header: t("alerts.status"),
        size: 120,
        Cell: ({ cell }: { cell: any }) =>
          cell.getValue() === "active" ? (
            <Chip
              label={t("alerts.active")}
              color="warning"
              size="small"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          ) : (
            <Chip
              label={t("alerts.recovered")}
              color="success"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          ),
      },
      {
        accessorKey: "createdAt",
        header: t("alerts.date"),
        Cell: ({ cell }: { cell: any }) =>
          new Date(cell.getValue() as string).toLocaleString(),
      },
      {
        accessorKey: "donorsCount",
        header: t("alerts.donors"),
        size: 150,
        Cell: ({ cell }: { cell: any }) => cell.getValue() || 0,
      },
    ],
    [t],
  );
}
