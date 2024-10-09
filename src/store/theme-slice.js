import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkMode: JSON.parse(localStorage.getItem("darkMode")) || false
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setDarkMode(state, action) {
            state.darkMode = action.payload;
            localStorage.setItem("darkMode", action.payload);
        },
        resetTheme(state) {
            state.darkMode = false;
            localStorage.setItem("darkMode", false);
        }
    },
});

export const themeActions = themeSlice.actions;
export default themeSlice;
