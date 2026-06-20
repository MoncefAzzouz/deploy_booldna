import { createTheme, type Theme } from "@mui/material/styles";

export function buildMuiTheme(mode: "light" | "dark"): Theme {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#dc2626",
        light: "#ef4444",
        dark: "#b91c1c",
        contrastText: "#ffffff",
      },
      error: {
        main: "#dc2626",
      },
      success: {
        main: "#10b981",
      },
      warning: {
        main: "#f97316",
      },
      info: {
        main: "#3b82f6",
      },
      background: {
        default: isDark ? "#020617" : "#f8fafc",
        paper: isDark ? "#0f172a" : "#ffffff",
      },
      text: {
        primary: isDark ? "#f1f5f9" : "#0f172a",
        secondary: isDark ? "#94a3b8" : "#475569",
      },
      divider: isDark ? "#1e293b" : "#f1f5f9",
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
    },
  });
}
