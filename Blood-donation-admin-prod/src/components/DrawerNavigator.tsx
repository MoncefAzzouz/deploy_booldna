import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaUsers,
  FaHome,
  FaHospital,
  FaUserShield,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useCloseModal from "../hooks/useCloseModal";
import { useDispatch, useSelector } from "react-redux";
import { removeSession } from "../state/auth/authSlice";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import type { RootState } from "../state/store";

export default function DrawerNavigator() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { mode } = useSelector((state: RootState) => state.theme);
  const { role } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    dispatch(removeSession());
    navigate("/signin", { replace: true });
  };

  const menu = [
    { title: t("nav.home"), to: "/", icon: <FaHome /> },
    { title: t("nav.alerts"), to: "/alerts-list", icon: <FaBell /> },
    { title: t("nav.donors"), to: "/dons", icon: <FaUsers /> },
    ...(role === "super_admin"
      ? [{ title: t("nav.admins"), to: "/admins", icon: <FaUserShield /> }]
      : []),
    { title: t("nav.hospitals"), to: "/hospitals", icon: <FaHospital /> },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useCloseModal(setOpen);

  const drawerWidthClass = open ? "w-64" : "w-16";

  return (
    <aside
      className={`
          fixed left-0 top-0 h-full z-50 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden
          ${drawerWidthClass}
          ${mode === 'dark'
          ? 'bg-slate-900/90 backdrop-blur-md border-ie border-slate-700/50'
          : 'bg-white border-ie border-gray-200'}
        `}
    >
      <div
        className={`flex items-center ${open ? "justify-between px-6 py-5" : "justify-center py-4"
          } border-b ${mode === 'dark' ? 'border-slate-700/50' : 'border-gray-100'}`}
      >
        <div
          className={`flex items-center gap-3 ${open ? "" : "justify-center w-full"}`}
          title="CTS Admin"
        >
          <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-600/20">
            <FaHospital className="text-white text-xl" />
          </div>
          <h1
            className={`font-extrabold text-red-600 text-xl tracking-tight truncate ${open ? "" : "sr-only"}`}
          >
            CTS<span className="text-slate-800 dark:text-slate-200">Admin</span>
          </h1>
        </div>
      </div>

      <nav
        aria-label={t("nav.primary")}
        className="flex flex-col p-3 gap-1 overflow-y-auto h-[calc(100%-80px)] no-scrollbar"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`
            ${open ? "px-4 py-3 gap-3 justify-start" : "p-3 justify-center"}
            flex items-center rounded-xl font-semibold transition-all duration-200 mb-2
            group ${mode === 'dark'
              ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400'
              : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}
          `}
          aria-label={open ? t("nav.close") : t("nav.menu")}
          title={open ? t("nav.close") : t("nav.menu")}
        >
          <span className="text-xl flex-shrink-0 transition-transform group-hover:scale-110">
            {open ? <FaTimes /> : <FaBars />}
          </span>
          <span className={`truncate ${open ? "inline" : "hidden"} select-none`}>
            {open ? t("nav.close") : t("nav.menu")}
          </span>
        </button>

        <div className="space-y-1">
          {menu.map((item) => {
            const active =
              location.pathname === item.to ||
              (item.to !== "/" && location.pathname.startsWith(item.to));

            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.title}
                aria-label={item.title}
                aria-current={active ? "page" : undefined}
                className={`
                  ${open ? "px-4 py-3 gap-3 justify-start" : "p-3 justify-center"}
                  flex items-center rounded-xl font-medium transition-all duration-200 group
                  ${active
                    ? mode === 'dark'
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/30"
                      : "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : mode === 'dark'
                      ? "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-red-600"}
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) setOpen(false);
                }}
              >
                <span
                  className={`text-xl shrink-0 transition-transform duration-200 ${!active && "group-hover:scale-110"}`}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span className={`truncate ${open ? "inline" : "hidden"} select-none`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto py-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {open && (
            <div className="flex flex-col gap-3 px-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">{t("common.mode") || "Theme"}</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">{t("common.lang") || "Language"}</span>
                <LanguageSwitcher />
              </div>
            </div>
          )}

          <button
            className={`
              ${open ? "px-4 py-3 gap-3 justify-start" : "p-3 justify-center"}
              flex items-center w-full rounded-xl font-medium transition-all duration-200
              text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 group
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
            `}
            onClick={handleLogout}
            title={t("nav.logout")}
            aria-label={t("nav.logout")}
            type="button"
          >
            <span className="text-xl shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <FaSignOutAlt />
            </span>
            <span className={`${open ? "inline" : "hidden"}`}>{t("nav.logout")}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
