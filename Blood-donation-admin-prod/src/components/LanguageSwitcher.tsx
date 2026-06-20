import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import { setLanguage } from "../state/theme/themeSlice";
import type { RootState } from "../state/store";

export default function LanguageSwitcher() {
    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    const language = useSelector((state: RootState) => state.theme.language);

    const handleLanguageChange = (lang: "en" | "fr" | "ar") => {
        dispatch(setLanguage(lang));
        i18n.changeLanguage(lang);
    };

    return (
        <div className="flex items-center gap-2">
            <FaGlobe className="text-gray-600 dark:text-gray-300" />
            <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as "en" | "fr" | "ar")}
                className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
            </select>
        </div>
    );
}
