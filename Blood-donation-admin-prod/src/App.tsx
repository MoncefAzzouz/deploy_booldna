import { useEffect, useMemo, useState } from "react";
import DrawerNavigator from "./components/DrawerNavigator";
import MainRouter from "./router/MainRouter";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from "./state/auth/authSlice";
import "./i18n/config";
import { useTranslation } from "react-i18next";
import type { RootState } from "./state/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { buildMuiTheme } from "./theme/muiTheme";
import { ConfirmDialogProvider } from "./components/ConfirmDialogProvider";
import { ToastProvider } from "./components/ToastProvider";

function App() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { mode, language } = useSelector((state: RootState) => state.theme);
  const { isSignedIn } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const muiTheme = useMemo(() => buildMuiTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr",
    );
    i18n.changeLanguage(language);
  }, [mode, language, i18n]);

  useEffect(() => {
    const storedSession = localStorage.getItem("adminSession");

    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        if (parsed?.isSignedIn && parsed?.token && parsed?.adminId) {
          dispatch(
            setSession({
              adminId: parsed.adminId,
              username: parsed.username,
              email: parsed.email,
              role: parsed.role,
              token: parsed.token,
            }),
          );
        } else {
          localStorage.removeItem("adminSession");
        }
      } catch {
        localStorage.removeItem("adminSession");
      }
    }

    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-500 text-lg animate-pulse">
          {t("common.loadingSession")}
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme={false} />
      <ToastProvider>
        <ConfirmDialogProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg"
          >
            {t("nav.skipToContent")}
          </a>
          <div className={`${isSignedIn ? "ms-16" : ""} min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
            {isSignedIn && <DrawerNavigator />}
            <main id="main-content">
              <MainRouter />
            </main>
          </div>
        </ConfirmDialogProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
