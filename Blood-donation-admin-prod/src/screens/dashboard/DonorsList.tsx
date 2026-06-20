import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import useDonors from "../../hooks/useDonors";
import ToolbarRefresh from "../../components/ToolbarRefresh";
import DonorTable from "../../components/DonorTable";
import DonorDetailPanel from "../../components/DonorDetailPanel";
import { FiUsers, FiAlertCircle } from "react-icons/fi";
import usePageTitle from "../../hooks/usePageTitle";
import PageShell from "../../components/PageShell";

export default function DonorsList() {
  const { t } = useTranslation();
  const { donors, loading, refreshing, error, refresh } = useDonors();
  usePageTitle(t("donors.title"));

  return (
    <PageShell
      title={t("donors.title")}
      subtitle={t("donors.subtitle")}
      actions={<ToolbarRefresh onRefresh={refresh} refreshing={refreshing} />}
    >
      {loading ? (
        <div className="flex items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <CircularProgress color="primary" />
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-[2rem] text-red-600 font-medium flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
            <FiAlertCircle size={24} />
          </div>
          <div>
            <p className="text-lg font-black">{t("common.error")}</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      ) : donors.length === 0 ? (
        <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <FiUsers size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">{t("donors.noDonors")}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          <Box>
            <DonorTable
              donors={donors}
              isLoading={refreshing}
              renderDetail={(donor) => <DonorDetailPanel donor={donor} />}
            />
          </Box>
        </div>
      )}
    </PageShell>
  );
}
