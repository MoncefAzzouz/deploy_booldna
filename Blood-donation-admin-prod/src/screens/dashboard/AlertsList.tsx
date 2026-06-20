import { useEffect, useState } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { MaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom";
import { MdGroups2 } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";

import useAlerts from "../../hooks/useAlerts";
import usePageTitle from "../../hooks/usePageTitle";
import { useAlertColumns } from "../../hooks/useAlertsColumns";
import DetailPanel from "../../components/DetailsPanel";
import PageShell from "../../components/PageShell";
import { useToast } from "../../components/ToastProvider";
import { sharedMrtProps } from "../../components/mrtTheme";

type AlertType = {
  alertId: number;
  hospitalId?: number;
  bloodGroup?: string;
  quantityUnits?: number;
  urgencyLevel?: string;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  hospital?: any;
  createdByAdmin?: any;
};

export default function AlertsList() {
  const { t, i18n } = useTranslation();
  const adminId = useSelector((state: RootState) => state.auth.adminId);
  const toast = useToast();
  const { getAllAlerts, updateAlert } = useAlerts();
  const columns = useAlertColumns();
  usePageTitle(t("alerts.title"));

  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAlerts = async () => {
      try {
        const data = await getAllAlerts();
        if (!mounted) return;
        setAlerts(data || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAlerts();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsResolved = async (alertId: number) => {
    try {
      const alert = alerts.find((a) => a.alertId === alertId);
      if (!alert || alert.status === "recovered") return;
      if (!adminId) {
        toast.error(t("auth.sessionMissing"));
        return;
      }

      const payload = {
        alertId: alert.alertId,
        status: "recovered" as const,
      };

      await updateAlert(adminId, payload);

      setAlerts((prev) =>
        prev.map((a) =>
          a.alertId === alertId ? { ...a, status: "recovered" } : a,
        ),
      );
      toast.success(t("alerts.resolveSuccess"));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("common.error"));
    }
  };

  return (
    <PageShell
      title={t("alerts.title")}
      subtitle={t("nav.alerts")}
      actions={
        <Link
          to="/new-alert"
          className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          + {t("nav.newAlert")}
        </Link>
      }
    >
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <MaterialReactTable
          {...sharedMrtProps<AlertType>(i18n.language)}
          columns={columns}
          data={alerts}
          getRowId={(row) => String(row.alertId)}
          enableRowActions
          enableExpanding
          state={{ isLoading: loading }}
          renderDetailPanel={({ row }) => (
            <DetailPanel alert={row.original as any} />
          )}
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Tooltip title={t("alerts.viewDetails")}>
                <IconButton
                  aria-label={t("alerts.viewDetails")}
                  onClick={() => row.toggleExpanded()}
                  sx={{ color: "text.secondary" }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t("alerts.markAsResolved")}>
                <span>
                  <IconButton
                    aria-label={t("alerts.markAsResolved")}
                    disabled={row.original.status === "recovered"}
                    onClick={() => markAsResolved(row.original.alertId)}
                    color="success"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={t("alerts.viewDonors")}>
                <Link
                  to={`/alerts/${row.original.alertId}/donations`}
                  state={{ alertId: row.original.alertId }}
                  aria-label={t("alerts.viewDonors")}
                >
                  <IconButton color="primary">
                    <MdGroups2 />
                  </IconButton>
                </Link>
              </Tooltip>
            </Box>
          )}
        />
      </div>
    </PageShell>
  );
}
