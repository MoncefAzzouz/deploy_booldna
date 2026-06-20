import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";
type Language = "en" | "fr" | "ar";

interface ThemeState {
    mode: ThemeMode;
    language: Language;
}

const initialState: ThemeState = {
    mode: (localStorage.getItem("themeMode") as ThemeMode) || "light",
    language: (localStorage.getItem("language") as Language) || "fr",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem("themeMode", state.mode);
            document.documentElement.classList.toggle("dark", state.mode === "dark");
        },
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
            localStorage.setItem("themeMode", state.mode);
            document.documentElement.classList.toggle("dark", state.mode === "dark");
        },
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
            localStorage.setItem("language", state.language);
            document.documentElement.setAttribute("lang", state.language);
            document.documentElement.setAttribute("dir", state.language === "ar" ? "rtl" : "ltr");
        },
    },
});

export const { toggleTheme, setTheme, setLanguage } = themeSlice.actions;
export default themeSlice.reducer;
