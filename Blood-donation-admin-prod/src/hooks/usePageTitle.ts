// Updates the browser tab title per page, e.g. "Vue d'ensemble — Blood CTS".
// Usage: usePageTitle(t("dashboard.title")) at the top of each screen.

import { useEffect } from "react";

const APP_NAME = "Blood CTS";

export default function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${APP_NAME}` : APP_NAME;
  }, [title]);
}
