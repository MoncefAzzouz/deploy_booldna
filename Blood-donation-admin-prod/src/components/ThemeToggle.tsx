import { useDispatch, useSelector } from "react-redux";
import { FaSun, FaMoon } from "react-icons/fa";
import { toggleTheme } from "../state/theme/themeSlice";
import type { RootState } from "../state/store";

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.theme.mode);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
            title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            {mode === "light" ? (
                <FaMoon className="text-gray-700 text-xl" />
            ) : (
                <FaSun className="text-yellow-400 text-xl" />
            )}
        </button>
    );
}
