import { useTranslation } from "react-i18next";
import { FiUser, FiShoppingBag, FiCalendar, FiMapPin, FiMail, FiPhone, FiDroplet } from "react-icons/fi";
import type { Donor } from "../types/donors";

export default function DonorDetailPanel({ donor }: { donor: Donor }) {
  const { t } = useTranslation();

  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-950/50 flex flex-col gap-8 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
            <FiUser className="text-red-600" />
            {t("donors.personalInfo")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">{t("donors.fullName")}</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">{donor.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">{t("donors.bloodType")}</p>
              <div className="flex items-center gap-2">
                <FiDroplet className="text-red-500" />
                <p className="font-black text-red-600 dark:text-red-400">{donor.bloodType}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">{t("donors.phone")}</p>
              <div className="flex items-center gap-2">
                <FiPhone className="text-slate-400" />
                <p className="font-bold text-slate-700 dark:text-slate-300">{donor.phone}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">{t("donors.email")}</p>
              <div className="flex items-center gap-2">
                <FiMail className="text-slate-400" />
                <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{donor.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
            <FiShoppingBag className="text-red-600" />
            {t("donors.donationHistory")}
          </h3>

          {donor.donations.length > 0 ? (
            <div className="space-y-4">
              {donor.donations.map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-red-500 shadow-sm">
                      <FiCalendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-700 dark:text-slate-200">{new Date(d.date).toLocaleDateString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t("donors.success")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <FiMapPin size={14} />
                    <span className="text-xs font-medium">{d.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
              <FiCalendar size={32} className="mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-500">{t("donors.noDonation")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
