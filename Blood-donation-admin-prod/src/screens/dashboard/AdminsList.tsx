import { useEffect, useState, useMemo } from "react";
import { FiUser, FiTrash2, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useAdmins from "../../hooks/useAdmins";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import PageShell from "../../components/PageShell";
import { useConfirm } from "../../components/ConfirmDialogProvider";
import { useToast } from "../../components/ToastProvider";
import { sharedMrtProps } from "../../components/mrtTheme";

export default function AdminsList() {
    const { t, i18n } = useTranslation();
    usePageTitle(t("admins.title"));
    const { getAllAdmins, activateAdmin, deactivateAdmin, deleteAdmin } = useAdmins();
    const confirm = useConfirm();
    const toast = useToast();
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await getAllAdmins();
            setAdmins(data.data || data);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleToggleStatus = async (admin: any) => {
        try {
            if (admin.deactivatedAt) {
                await activateAdmin(admin.adminId);
            } else {
                await deactivateAdmin(admin.adminId);
            }
            fetchAdmins();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? t("common.error"));
        }
    };

    const handleDelete = async (adminId: number) => {
        const ok = await confirm({
            title: t("admins.delete"),
            message: t("admins.confirmDelete"),
            confirmLabel: t("common.delete"),
            destructive: true,
        });
        if (!ok) return;
        try {
            await deleteAdmin(adminId);
            toast.success(t("admins.deleteSuccess"));
            fetchAdmins();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? t("common.error"));
        }
    };

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "fullName",
                header: t("admins.fullName"),
                Cell: ({ cell, row }) => (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                            <FiUser size={18} />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{cell.getValue<string>()}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">ID: {row.original.adminId}</div>
                        </div>
                    </div>
                ),
                size: 200,
            },
            {
                accessorKey: "email",
                header: t("admins.email"),
                Cell: ({ cell, row }) => (
                    <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{cell.getValue<string>()}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{row.original.phone}</div>
                    </div>
                ),
                size: 200,
            },
            {
                accessorKey: "role",
                header: t("admins.role"),
                Cell: ({ cell }) => (
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-black rounded-full uppercase tracking-tighter shadow-sm ${cell.getValue() === 'super_admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {cell.getValue() === 'super_admin' ? t("admins.superAdmin") : t("admins.admin")}
                    </span>
                ),
            },
            {
                accessorKey: "deactivatedAt",
                header: t("admins.status"),
                Cell: ({ cell }) => (
                    <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-black rounded-full uppercase tracking-tighter shadow-sm ${cell.getValue() ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {cell.getValue() ? <FiXCircle aria-hidden="true" /> : <FiCheckCircle aria-hidden="true" />}
                        {cell.getValue() ? t("admins.inactive") : t("admins.active")}
                    </span>
                ),
            },
        ],
        [t]
    );

    if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950"><CircularProgress /></div>;

    return (
        <PageShell
            title={t("admins.title")}
            subtitle={t("admins.subtitle")}
            actions={
                <Link to="/new-admin" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 active:scale-95">
                    <FiPlus /> {t("nav.newAdmin")}
                </Link>
            }
        >
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 font-medium flex items-center gap-3">
                    <FiXCircle /> {error}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                <MaterialReactTable
                    {...sharedMrtProps<any>(i18n.language)}
                    columns={columns}
                    data={admins}
                    getRowId={(row) => String(row.adminId)}
                    enableRowActions
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: "flex", gap: "0.5rem" }}>
                            <Tooltip title={row.original.deactivatedAt ? t("admins.activate") : t("admins.deactivate")}>
                                <IconButton
                                    aria-label={row.original.deactivatedAt ? t("admins.activate") : t("admins.deactivate")}
                                    onClick={() => handleToggleStatus(row.original)}
                                    color={row.original.deactivatedAt ? "success" : "warning"}
                                >
                                    {row.original.deactivatedAt ? <FiCheckCircle aria-hidden="true" /> : <FiXCircle aria-hidden="true" />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={t("admins.delete")}>
                                <IconButton
                                    aria-label={`${t("admins.delete")}: ${row.original.fullName ?? row.original.email}`}
                                    onClick={() => handleDelete(row.original.adminId)}
                                    color="error"
                                >
                                    <FiTrash2 aria-hidden="true" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                />
            </div>
        </PageShell>
    );
}
