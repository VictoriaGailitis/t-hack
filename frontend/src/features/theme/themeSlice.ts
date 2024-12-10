// src/features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: 'light', // начальная тема
    },
    reducers: {
        toggleTheme(state) {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

// Экспортируем экшены и редьюсер
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
