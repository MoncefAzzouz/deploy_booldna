import { Box, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import { translateBloodType } from "../utils/bloodTypeTranslation";
import { useTranslation } from "react-i18next";

export default function DetailPanel({ alert }: { alert: any }) {
  const { mode } = useSelector((state: RootState) => state.theme);
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: mode === "dark" ? "#1e293b" : "white",
        color: mode === "dark" ? "#f1f5f9" : "inherit",
        borderRadius: "1.5rem",
        border: mode === "dark" ? "1px solid #334155" : "1px solid #f1f5f9",
        boxShadow: mode === "dark" ? "0 10px 15px -3px rgba(0, 0, 0, 0.4)" : 1,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {t("alerts.alertDetails")}
      </Typography>

      <Typography>
        <strong>{t("alerts.alertId")} :</strong> {alert.alertId}
      </Typography>
      <Typography>
        <strong>{t("alerts.bloodGroup")} :</strong> {translateBloodType(alert.bloodGroup)}
      </Typography>
      <Typography>
        <strong>{t("alerts.quantityUnits")} :</strong> {alert.quantityUnits}
      </Typography>
      <Typography>
        <strong>{t("alerts.urgencyLevel")} :</strong> {alert.urgencyLevel}
      </Typography>
      <Typography>
        <strong>{t("alerts.status")} :</strong> {alert.status}
      </Typography>
      <Typography>
        <strong>{t("alerts.description")} :</strong> {alert.description || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.createdAt")} :</strong>{" "}
        {new Date(alert.createdAt).toLocaleString()}
      </Typography>
      <Typography>
        <strong>{t("alerts.updatedAt")} :</strong>{" "}
        {new Date(alert.updatedAt).toLocaleString()}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        {t("alerts.hospitalInfo")}
      </Typography>
      <Typography>
        <strong>{t("alerts.hospitalName")} :</strong> {alert.hospital?.name || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.hospitalCity")} :</strong> {alert.hospital?.city || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.hospitalPhone")} :</strong> {alert.hospital?.phone || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.hospitalEmail")} :</strong> {alert.hospital?.email || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.hospitalActive")} :</strong>{" "}
        {alert.hospital?.isActive ? t("common.yes") : t("common.no")}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        {t("alerts.createdByAdmin")}
      </Typography>
      <Typography>
        <strong>{t("alerts.adminName")} :</strong> {alert.createdByAdmin?.fullName || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.adminEmail")} :</strong> {alert.createdByAdmin?.email || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.adminRole")} :</strong> {alert.createdByAdmin?.role || "-"}
      </Typography>
      <Typography>
        <strong>{t("alerts.adminVerified")} :</strong>{" "}
        {alert.createdByAdmin?.isVerified ? t("common.yes") : t("common.no")}
      </Typography>
      <Typography>
        <strong>{t("alerts.adminLastLogin")} :</strong>{" "}
        {alert.createdByAdmin?.lastLoginAt
          ? new Date(alert.createdByAdmin.lastLoginAt).toLocaleString()
          : "-"}
      </Typography>
    </Box>
  );
}
