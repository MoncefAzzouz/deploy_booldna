import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

type ToastFn = (message: string, severity?: AlertColor) => void;

type ToastApi = {
  toast: ToastFn;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

type ToastState = {
  message: string;
  severity: AlertColor;
  key: number;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState | null>(null);

  const toast = useCallback<ToastFn>((message, severity = "info") => {
    setState({ message, severity, key: Date.now() });
  }, []);

  const api: ToastApi = {
    toast,
    success: (m) => toast(m, "success"),
    error: (m) => toast(m, "error"),
    info: (m) => toast(m, "info"),
    warning: (m) => toast(m, "warning"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Snackbar
        key={state?.key}
        open={state !== null}
        autoHideDuration={4000}
        onClose={() => setState(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {state ? (
          <Alert
            onClose={() => setState(null)}
            severity={state.severity}
            variant="filled"
            sx={{ minWidth: 280 }}
          >
            {state.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
