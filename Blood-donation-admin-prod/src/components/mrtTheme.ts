import type {
  MRT_TableOptions,
  MRT_RowData,
  MRT_Localization,
} from "material-react-table";
import type { Theme } from "@mui/material/styles";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_AR } from "material-react-table/locales/ar";

const LOCALES: Record<string, MRT_Localization> = {
  en: MRT_Localization_EN,
  fr: MRT_Localization_FR,
  ar: MRT_Localization_AR,
};

export function getMrtLocalization(language: string): MRT_Localization {
  return LOCALES[language] ?? MRT_Localization_EN;
}

/**
 * Shared styling for MaterialReactTable used across the admin lists.
 * Reads colors from the active MUI theme so light/dark switching is
 * automatic — no `mode === 'dark' ? … : …` branching at call sites.
 *
 * Pass the active i18n language so table chrome ("Rows per page",
 * "No records", "Search") follows the same locale as the rest of the app.
 */
export function sharedMrtProps<T extends MRT_RowData>(
  language: string,
): Partial<MRT_TableOptions<T>> {
  return {
    enableStickyHeader: true,
    initialState: { density: "comfortable" },
    localization: getMrtLocalization(language),
    muiTablePaperProps: {
      elevation: 0,
      sx: { backgroundColor: "transparent" },
    },
    muiTableBodyRowProps: {
      sx: (theme: Theme) => ({
        backgroundColor: "transparent",
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(220, 38, 38, 0.03)",
        },
      }),
    },
    muiTopToolbarProps: {
      sx: (theme: Theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
    muiBottomToolbarProps: {
      sx: (theme: Theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`,
      }),
    },
    muiTableHeadCellProps: {
      sx: (theme: Theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        fontWeight: 800,
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        paddingY: "1.25rem",
        borderBottom: `2px solid ${theme.palette.divider}`,
      }),
    },
    muiTableBodyCellProps: {
      sx: (theme: Theme) => ({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        paddingY: "1rem",
        fontSize: "0.875rem",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  };
}
