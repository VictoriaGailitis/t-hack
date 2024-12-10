import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Тип данных для бюджета
export interface Budget  {
    id: number;
    brand_id: number;
    cb_percent: number;
    status: string;
    clientsFileKey?: string;
    open_date?: string;
    gmv?: number;
    purchaseCount?: number;
    totalCashback?: number;
}

// Начальное состояние
interface BudgetState {
    budget: Budget | null
    loaded: boolean;
}

const initialState: BudgetState = {
    budget: null,
    loaded: false,
};

// Thunk для получения бюджета по ID
export const getBudgetById = createAsyncThunk(
    'budget/getBudgetById',
    async (id: number) => {
        const response = await axios.get(`https://timkoff.itatmisis.ru/api/${id}`);
        return response.data; // Возвращаем данные бюджета
    }
);

// Создаем слайс
const budgetSlice = createSlice({
    name: "budget",
    initialState,
    reducers: {
        setBudget: (state, action: PayloadAction<Budget>) => {
            state.budget = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBudgetById.pending, (state) => {
                state.loaded = false; // Начало загрузки
            })
            .addCase(getBudgetById.fulfilled, (state, action: PayloadAction<Budget>) => {
                state.budget = action.payload; // Обновляем состояние с полученным бюджетом
                state.loaded = true; // Загрузка завершена
            })
            .addCase(getBudgetById.rejected, (state) => {
                state.loaded = false; // Ошибка при загрузке
            });
    },
});

export default budgetSlice.reducer;
export const { setBudget } = budgetSlice.actions;
