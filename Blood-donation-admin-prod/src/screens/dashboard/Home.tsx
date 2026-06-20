/**
 * Dashboard / Home Screen — Full Rewrite
 *
 * Replaced the original dashboard that had 3 basic Recharts (line, pie, bar)
 * fed by raw donations/alerts data with no real analytics value.
 *
 * New dashboard uses a dedicated GET /api/v1/dashboard/stats endpoint that
 * aggregates data server-side. Sections:
 *
 * 1. Critical Alerts Banner — urgent alerts with unmet demand (red warning)
 * 2. KPI Cards (6) — clickable, link to relevant pages
 * 3. Blood Type Distribution (donut) + Demand vs Supply (grouped bar)
 * 4. Alerts Coverage Table — each active alert with progress bars
 * 5. Donation Pipeline — funnel: notified → accepted → planned → completed
 * 6. Donations Over Time — line chart of last 30 days
 *
 * All text uses i18n (t()) — no hardcoded strings.
 * Date is localized to match the selected language (fr-FR, en-US, ar-DZ).
 */

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import CircularProgress from "@mui/material/CircularProgress";
import usePageTitle from "../../hooks/usePageTitle";
import {
  FaUsers,
  FaBell,
  FaHeartbeat,
  FaCheckCircle,
  FaCalendarCheck,
  FaUserCheck,
} from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { api } from "../../api/axios";
import { translateBloodType } from "../../utils/bloodTypeTranslation";

type DashboardStats = {
  kpis: {
    totalDonors: number;
    regularDonors: number;
    eligibleDonors: number;
    verifiedDonors: number;
    activeAlerts: number;
    donationsThisMonth: number;
  };
  bloodTypeDistribution: { bloodGroup: string; count: number }[];
  demandVsSupply: { bloodGroup: string; demand: number; supply: number }[];
  alertsCoverage: {
    alertId: number;
    hospitalName: string | null;
    bloodGroup: string;
    urgencyLevel: string;
    quantityNeeded: number;
    confirmed: number;
    planned: number;
    shortage: number;
  }[];
  pipeline: {
    notified: number;
    confirmed: number;
    planned: number;
    completed: number;
  };
  criticalAlerts: { bloodGroup: string; confirmed: number; needed: number }[];
  donationsOverTime: { date: string; status: string }[];
};

const BLOOD_COLORS: Record<string, string> = {
  A_POS: "#ef4444",
  A_NEG: "#f97316",
  B_POS: "#eab308",
  B_NEG: "#84cc16",
  AB_POS: "#06b6d4",
  AB_NEG: "#8b5cf6",
  O_POS: "#ec4899",
  O_NEG: "#64748b",
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const { mode } = useSelector((state: RootState) => state.theme);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  usePageTitle(t("dashboard.title"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress color="primary" />
      </div>
    );
  }

  const localeMap: Record<string, string> = { fr: "fr-FR", en: "en-US", ar: "ar-DZ" };
  const dateLocale = localeMap[i18n.language] || "fr-FR";
  const isDark = mode === "dark";
  const cardBg = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const gridStroke = isDark ? "#334155" : "#e2e8f0";
  const tooltipBg = isDark ? "#0f172a" : "#fff";

  // Process donations over time for line chart
  const donationsByDate: Record<string, number> = {};
  stats.donationsOverTime.forEach((d) => {
    donationsByDate[d.date] = (donationsByDate[d.date] || 0) + 1;
  });
  const donationLineData = Object.entries(donationsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  // Pie chart data
  const pieData = stats.bloodTypeDistribution.map((b) => ({
    name: translateBloodType(b.bloodGroup),
    value: b.count,
    color: BLOOD_COLORS[b.bloodGroup] || "#94a3b8",
  }));
  const totalDonorsForPie = pieData.reduce((s, p) => s + p.value, 0);

  // Demand vs supply chart data
  const dvs = stats.demandVsSupply.map((d) => ({
    group: translateBloodType(d.bloodGroup),
    [t("dashboard.demand")]: d.demand,
    [t("dashboard.supply")]: d.supply,
  }));

  const kpis = [
    { label: t("dashboard.totalDonors"), value: stats.kpis.totalDonors, icon: <FaUsers />, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20", link: "/dons" },
    { label: t("dashboard.regularDonors"), value: stats.kpis.regularDonors, icon: <FaHeartbeat />, color: "text-pink-500 bg-pink-50 dark:bg-pink-900/20", link: "/dons" },
    { label: t("dashboard.eligibleDonors"), value: stats.kpis.eligibleDonors, icon: <FaUserCheck />, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20", link: "/dons" },
    { label: t("dashboard.verifiedDonors"), value: stats.kpis.verifiedDonors, icon: <FaCheckCircle />, color: "text-green-500 bg-green-50 dark:bg-green-900/20", link: "/dons" },
    { label: t("dashboard.activeAlerts"), value: stats.kpis.activeAlerts, icon: <FaBell />, color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20", link: "/alerts-list" },
    { label: t("dashboard.donationsThisMonth"), value: stats.kpis.donationsThisMonth, icon: <FaCalendarCheck />, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20", link: "/dons" },
  ];

  const pipeline = stats.pipeline;
  const pipelineSteps = [
    { label: t("dashboard.notified"), value: pipeline.notified, pct: 100 },
    { label: t("dashboard.pipelineConfirmed"), value: pipeline.confirmed, pct: pipeline.notified > 0 ? Math.round((pipeline.confirmed / pipeline.notified) * 100) : 0 },
    { label: t("dashboard.pipelinePlanned"), value: pipeline.planned, pct: pipeline.notified > 0 ? Math.round((pipeline.planned / pipeline.notified) * 100) : 0 },
    { label: t("dashboard.completed"), value: pipeline.completed, pct: pipeline.notified > 0 ? Math.round((pipeline.completed / pipeline.notified) * 100) : 0 },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-4xl font-extrabold ${textPrimary} tracking-tight`}>
            {t("dashboard.title")}
          </h1>
          <p className={`${textSecondary} font-medium mt-1`}>
            {new Date().toLocaleDateString(dateLocale, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* Critical Alerts Banner */}
      {stats.criticalAlerts.length > 0 && (
        <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <FiAlertTriangle className="text-red-600 text-2xl" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-700 dark:text-red-400 text-lg">
              {t("dashboard.criticalAlerts")}
            </p>
            <p className="text-red-600/80 dark:text-red-400/70 text-sm mt-0.5">
              {stats.criticalAlerts
                .map(
                  (a) =>
                    `${translateBloodType(a.bloodGroup)}: ${a.confirmed}/${a.needed} ${t("dashboard.units")}`,
                )
                .join(" • ")}
            </p>
          </div>
          <Link
            to="/new-alert"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all"
          >
            + {t("nav.newAlert")}
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            to={kpi.link}
            className={`${cardBg} border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer block`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                {kpi.label}
              </span>
              <span className={`p-2 rounded-xl text-lg ${kpi.color}`}>{kpi.icon}</span>
            </div>
            <p className={`text-3xl font-black ${textPrimary}`}>{kpi.value.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      {/* Blood Type Distribution + Demand vs Supply */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Donut */}
        <div className={`${cardBg} border rounded-[2rem] p-8 shadow-sm`}>
          <h2 className={`text-xl font-black ${textPrimary} mb-1`}>
            {t("dashboard.bloodTypeDistribution")}
          </h2>
          <p className={`${textSecondary} text-sm mb-6`}>{t("dashboard.distributionSubtitle")}</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                />
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-3xl font-black ${textPrimary}`}
                  fill={isDark ? "#f1f5f9" : "#0f172a"}
                >
                  {totalDonorsForPie}
                </text>
                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm"
                  fill={isDark ? "#94a3b8" : "#64748b"}
                >
                  {t("dashboard.total")}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand vs Supply */}
        <div className={`${cardBg} border rounded-[2rem] p-8 shadow-sm`}>
          <h2 className={`text-xl font-black ${textPrimary} mb-1`}>
            {t("dashboard.demandVsSupply")}
          </h2>
          <p className={`${textSecondary} text-sm mb-6`}>{t("dashboard.demandVsSupplySubtitle")}</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dvs} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="group"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey={t("dashboard.demand")} fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey={t("dashboard.supply")} fill="#22c55e" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Coverage Table */}
      <div className={`${cardBg} border rounded-[2rem] p-8 shadow-sm mb-8`}>
        <h2 className={`text-xl font-black ${textPrimary} mb-1`}>
          {t("dashboard.alertsCoverage")}
        </h2>
        <p className={`${textSecondary} text-sm mb-6`}>{t("dashboard.alertsCoverageSubtitle")}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <th className={`text-left py-3 px-4 font-bold uppercase text-xs tracking-wider ${textSecondary}`}>
                  #
                </th>
                <th className={`text-left py-3 px-4 font-bold uppercase text-xs tracking-wider ${textSecondary}`}>
                  {t("dashboard.hospital")}
                </th>
                <th className={`text-left py-3 px-4 font-bold uppercase text-xs tracking-wider ${textSecondary}`}>
                  {t("dashboard.group")}
                </th>
                <th className={`text-center py-3 px-4 font-bold uppercase text-xs tracking-wider ${textSecondary}`}>
                  {t("dashboard.needed")}
                </th>
                <th className={`text-center py-3 px-4 font-bold uppercase text-xs tracking-wider ${textSecondary}`}>
                  {t("dashboard.confirmed")}
                </th>
                <th className={`text-center py-3 px-4 font-bold uppercase text-xs tracking-wider ${textSecondary}`}>
                  {t("dashboard.planned")}
                </th>
                <th className={`text-left py-3 px-4 font-bold uppercase text-xs tracking-wider ${textSecondary}`}>
                  {t("dashboard.shortage")}
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.alertsCoverage.map((a) => {
                const progress = Math.min(
                  100,
                  ((a.confirmed + a.planned) / Math.max(a.quantityNeeded, 1)) * 100,
                );
                const urgencyColor =
                  a.urgencyLevel === "urgent"
                    ? "text-red-600 bg-red-50 dark:bg-red-900/20"
                    : a.urgencyLevel === "medium"
                      ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
                      : "text-green-600 bg-green-50 dark:bg-green-900/20";

                return (
                  <tr
                    key={a.alertId}
                    className={`border-b ${isDark ? "border-slate-800" : "border-slate-100"} hover:${isDark ? "bg-slate-800/50" : "bg-slate-50"} transition-colors`}
                  >
                    <td className="py-3 px-4 font-mono text-xs">
                      <Link to={`/alerts/${a.alertId}/donations`} className="text-slate-600 dark:text-slate-300 hover:text-red-600 font-bold hover:underline">
                        #{a.alertId}
                      </Link>
                    </td>
                    <td className={`py-3 px-4 font-medium ${textPrimary}`}>
                      {a.hospitalName || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 font-bold text-xs">
                        {translateBloodType(a.bloodGroup)}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-center font-bold ${textPrimary}`}>
                      {a.quantityNeeded}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-green-600">{a.confirmed}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-500">{a.planned}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex-1 h-2 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                          <div
                            className={`h-full rounded-full transition-all ${progress >= 100 ? "bg-green-500" : progress >= 50 ? "bg-orange-500" : "bg-red-500"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {a.shortage > 0 ? (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${urgencyColor}`}>
                            -{a.shortage}
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-lg text-green-600 bg-green-50 dark:bg-green-900/20">
                            {t("dashboard.coverageFull")}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pipeline + Donations Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <div className={`${cardBg} border rounded-[2rem] p-8 shadow-sm`}>
          <h2 className={`text-xl font-black ${textPrimary} mb-1`}>
            {t("dashboard.pipeline")}
          </h2>
          <p className={`${textSecondary} text-sm mb-6`}>{t("dashboard.pipelineSubtitle")}</p>
          <div className="space-y-5">
            {pipelineSteps.map((step, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${textPrimary}`}>{step.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black ${textPrimary}`}>{step.value}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      step.pct >= 80
                        ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                        : step.pct >= 50
                          ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
                          : "text-red-600 bg-red-50 dark:bg-red-900/20"
                    }`}>
                      {step.pct}%
                    </span>
                  </div>
                </div>
                <div className={`h-3 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                  <div
                    className={`h-full rounded-full transition-all ${
                      step.pct >= 80
                        ? "bg-green-500"
                        : step.pct >= 50
                          ? "bg-orange-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donations Over Time */}
        <div className={`${cardBg} border rounded-[2rem] p-8 shadow-sm`}>
          <h2 className={`text-xl font-black ${textPrimary} mb-1`}>
            {t("dashboard.donationsOverTime")}
          </h2>
          <p className={`${textSecondary} text-sm mb-6`}>
            {donationLineData.length} {t("dashboard.donationsThisMonth").toLowerCase()}
          </p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donationLineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: isDark ? "#0f172a" : "#fff" }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
