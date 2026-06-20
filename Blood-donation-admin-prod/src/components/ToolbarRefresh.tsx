import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "./ui/Button";
import { useTranslation } from "react-i18next";

export default function ToolbarRefresh({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void;
  refreshing?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Button
      onClick={onRefresh}
      title={refreshing ? t("common.refreshing") : t("common.refresh")}
      className="px-3"
    >
      <RefreshIcon />
    </Button>
  );
}

