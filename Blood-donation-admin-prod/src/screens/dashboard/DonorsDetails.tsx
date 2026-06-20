import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Chip,
  CircularProgress,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { api } from "../../api/axios";
import PageShell from "../../components/PageShell";
import { useConfirm } from "../../components/ConfirmDialogProvider";
import { useToast } from "../../components/ToastProvider";
import { sharedMrtProps } from "../../components/mrtTheme";

type Donation = {
  id?: number | string;
  date?: string;
  location?: string;
  done?: boolean;
};

type Donor = {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  bloodType?: string;
  donations: Donation[];
};

export default function DonorsDetails() {
  const { t, i18n } = useTranslation();
  const adminId = useSelector((state: RootState) => state.auth.adminId);
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
  const { id: alertId } = useParams<{ id: string }>();
  const confirm = useConfirm();
  const toast = useToast();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Array<number | string>>([]);

  const getLastDonation = (donations: Donation[]) => {
    if (!donations || donations.length === 0) return t("donors.noDonation");
    const last = donations[donations.length - 1];
    try {
      return last?.date
        ? new Date(last.date).toLocaleDateString()
        : (last?.location ?? "");
    } catch {
      return last?.date ?? last?.location ?? "";
    }
  };

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!alertId) {
          setError("Missing alert id in route params.");
          setLoading(false);
          return;
        }

        const res = await api.get(`/alert/${alertId}/donations`);

        const payload = res.data?.data ?? res.data;

        if (!Array.isArray(payload)) {
          const possibleArray = payload?.donors ?? payload?.donations ?? null;
          if (Array.isArray(possibleArray)) {
            setDonors(possibleArray);
          } else {
            setDonors([]);
            setError("Unexpected server response shape.");
          }
        } else {
          setDonors(payload);
        }
      } catch (err: any) {
        console.error("Failed to fetch alert donations:", err);
        setError(err?.response?.data?.message ?? err.message ?? "Fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertId, isSignedIn]);

  const updateDonationState = async (
    donationId: number | string,
    makeDone = true,
  ) => {
    if (!adminId) {
      toast.error(t("auth.sessionMissing"));
      return;
    }

    const confirmed = await confirm({
      title: makeDone ? t("donors.markDone") : t("donors.markUndone"),
      message: makeDone
        ? t("donors.confirmMarkDone")
        : t("donors.confirmMarkUndone"),
    });
    if (!confirmed) return;

    try {
      setUpdatingIds((prev) => [...prev, donationId]);

      const body = { donationId, done: makeDone };

      const res = await api.post(`/donations/admin/${adminId}`, body);

      const updatedDonationFromServer =
        res.data?.data ?? res.data?.donation ?? null;

      setDonors((prevDonors) =>
        prevDonors.map((donor) => {
          // update donation if it exists inside this donor
          const foundIdx = donor.donations?.findIndex(
            (d) => d.id === donationId,
          );
          if (typeof foundIdx === "number" && foundIdx >= 0) {
            const newDonations = [...donor.donations];
            if (updatedDonationFromServer) {
              // merge server response
              newDonations[foundIdx] = {
                ...newDonations[foundIdx],
                ...(updatedDonationFromServer as Partial<Donation>),
              };
            } else {
              // fallback: set done flag locally
              newDonations[foundIdx] = {
                ...newDonations[foundIdx],
                done: makeDone,
              };
            }
            return { ...donor, donations: newDonations };
          }
          return donor;
        }),
      );

      toast.success(t("donors.updateSuccess"));
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          err?.message ??
          t("donors.updateError"),
      );
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== donationId));
    }
  };

  const columns = useMemo<MRT_ColumnDef<Donor>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("donors.fullName") ?? "Name",
      },
      {
        accessorKey: "phone",
        header: t("donors.phone") ?? "Phone",
      },
      {
        accessorKey: "email",
        header: t("donors.email") ?? "Email",
      },
      {
        accessorKey: "city",
        header: t("donors.city") ?? "City",
      },
      {
        accessorKey: "bloodType",
        header: t("donors.bloodType") ?? "Blood type",
        Cell: ({ cell }) => (
          <Chip
            label={String(cell.getValue() ?? "")}
            color="error"
            size="small"
            sx={{ fontWeight: "700" }}
          />
        ),
      },
      {
        accessorKey: "donations",
        header: t("donors.lastDonation") ?? "Last donation",
        Cell: ({ cell }) => getLastDonation(cell.getValue() as Donation[]),
      },
    ],
    [t],
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300 flex items-center justify-center">
        <Box textAlign="center">
          <CircularProgress />
          <Typography mt={2}>{t("common.loading") ?? "Loading..."}</Typography>
        </Box>
      </div>
    );
  }

  return (
    <PageShell
      title={t("donors.title") ?? "Donors"}
      subtitle={t("nav.donors") ?? "Donors list"}
    >
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        {error ? (
          <Paper sx={{ p: 4 }}>
            <Typography color="error" variant="h6">
              {t("common.error") ?? "Error"}
            </Typography>
            <Typography sx={{ mt: 1 }}>{error}</Typography>
          </Paper>
        ) : (
          <MaterialReactTable
            {...sharedMrtProps<Donor>(i18n.language)}
            columns={columns}
            data={donors}
            enableExpanding
            enableRowActions
            renderRowActions={({ row }) => {
              // Row action acts on last donation of the donor row
              const donor = row.original as Donor;
              const donations = donor.donations ?? [];
              if (!donations || donations.length === 0) {
                return (
                  <Tooltip title={t("donors.noDonation")}>
                    <span>
                      <IconButton disabled size="small" aria-label={t("donors.noDonation")}>
                        <UndoIcon aria-hidden="true" />
                      </IconButton>
                    </span>
                  </Tooltip>
                );
              }

              const last = donations[donations.length - 1];
              const donationId = last.id ?? `${donor.id}-last`;

              const isUpdating = updatingIds.includes(donationId);
              const isDone = Boolean(last.done);

              return (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Tooltip
                    title={isDone ? t("donors.markUndone") : t("donors.markDone")}
                  >
                    <span>
                      <IconButton
                        size="small"
                        aria-label={isDone ? t("donors.markUndone") : t("donors.markDone")}
                        onClick={() => updateDonationState(donationId, !isDone)}
                        disabled={isUpdating}
                      >
                        {isDone ? <UndoIcon aria-hidden="true" /> : <CheckIcon aria-hidden="true" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              );
            }}
            renderDetailPanel={({ row }) => {
              const donor = row.original as Donor;
              const donations = donor.donations ?? [];

              if (donations.length === 0) {
                return (
                  <Box p={3}>
                    <Typography variant="body2">
                      {t("donors.noDonation") ?? "No donations yet."}
                    </Typography>
                  </Box>
                );
              }

              return (
                <Box p={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t("donors.donationsList") ?? "Donations"}
                  </Typography>
                  <List>
                    {donations.map((d, idx) => {
                      const donationId = d.id ?? `${donor.id}-${idx}`;
                      const isUpdating = updatingIds.includes(donationId);
                      const isDone = Boolean(d.done);
                      return (
                        <ListItem
                          key={donationId}
                          secondaryAction={
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={
                                  isDone ? <UndoIcon /> : <CheckIcon />
                                }
                                onClick={() =>
                                  updateDonationState(donationId, !isDone)
                                }
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? (t("common.processing") ?? "Processing...")
                                  : isDone
                                    ? (t("donors.markUndoneBtn") ??
                                      "Mark undone")
                                    : (t("donors.markDoneBtn") ?? "Mark done")}
                              </Button>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={d.location ?? d.date ?? `#${donationId}`}
                            secondary={
                              <>
                                {d.date
                                  ? new Date(d.date).toLocaleString()
                                  : null}
                                {typeof d.done !== "undefined" ? (
                                  <span
                                    style={{ marginLeft: 8, fontWeight: 700 }}
                                  >
                                    {d.done
                                      ? (t("donors.done") ?? "Done")
                                      : (t("donors.undone") ?? "Undone")}
                                  </span>
                                ) : null}
                              </>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              );
            }}
          />
        )}
      </div>
    </PageShell>
  );
}
