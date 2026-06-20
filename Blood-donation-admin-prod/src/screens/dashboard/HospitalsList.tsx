import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiMapPin, FiPhone, FiMail, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import useHospitals from "../../hooks/useHospitals";
import CircularProgress from "@mui/material/CircularProgress";
import usePageTitle from "../../hooks/usePageTitle";
import PageShell from "../../components/PageShell";
import { useConfirm } from "../../components/ConfirmDialogProvider";
import { useToast } from "../../components/ToastProvider";

export default function HospitalsList() {
    const { t } = useTranslation();
    usePageTitle(t("hospitals.title"));
    const { getHospitals, deleteHospital } = useHospitals();
    const confirm = useConfirm();
    const toast = useToast();
    const { role } = useSelector((s: RootState) => s.auth);
    const canManage = role === "super_admin";
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHospitals = async () => {
        try {
            setLoading(true);
            const data = await getHospitals();
            setHospitals(data.data || data);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch hospitals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleDelete = async (hospitalId: number) => {
        const ok = await confirm({
            title: t("hospitals.delete"),
            message: t("hospitals.confirmDelete"),
            confirmLabel: t("common.delete"),
            destructive: true,
        });
        if (!ok) return;
        try {
            await deleteHospital(hospitalId);
            toast.success(t("hospitals.deleteSuccess"));
            fetchHospitals();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? t("common.error"));
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300"><CircularProgress /></div>;

    return (
        <PageShell
            title={t("hospitals.title")}
            subtitle={t("hospitals.subtitle")}
            actions={
                canManage ? (
                    <Link
                        to="/new-hospital"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-600/20 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <FiPlus size={20} /> {t("nav.newHospital")}
                    </Link>
                ) : null
            }
        >
            {error && (
                <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 font-medium flex items-center gap-3">
                    <FiTrash2 /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hospitals.map((hospital) => (
                    <div key={hospital.hospitalId} className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 dark:bg-red-600/10 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-red-600/10 dark:group-hover:bg-red-600/20 transition-colors duration-300" />

                        <div className="relative mb-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-red-600 transition-colors duration-300">{hospital.name}</h2>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hospital.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {hospital.isActive ? <FiCheckCircle size={10} aria-hidden="true" /> : <FiXCircle size={10} aria-hidden="true" />}
                                    {hospital.isActive ? t("hospitals.active") : t("hospitals.inactive")}
                                </div>
                            </div>
                        </div>

                        <div className="relative space-y-4 text-sm mb-8">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500">
                                    <FiMapPin size={16} />
                                </div>
                                <span className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{hospital.address}<br />{hospital.city} {hospital.postalCode}</span>
                            </div>

                            {hospital.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500">
                                        <FiPhone size={16} />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400 font-bold">{hospital.phone}</span>
                                </div>
                            )}

                            {hospital.email && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500">
                                        <FiMail size={16} />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{hospital.email}</span>
                                </div>
                            )}
                        </div>

                        {canManage && (
                            <div className="relative pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-end gap-3">
                                <Link
                                    to={`/hospitals/${hospital.hospitalId}/edit`}
                                    className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                                    title={t("hospitals.edit")}
                                    aria-label={`${t("hospitals.edit")}: ${hospital.name}`}
                                >
                                    <FiEdit2 size={20} aria-hidden="true" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(hospital.hospitalId)}
                                    className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                                    title={t("hospitals.delete")}
                                    aria-label={`${t("hospitals.delete")}: ${hospital.name}`}
                                >
                                    <FiTrash2 size={20} aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
