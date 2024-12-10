import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Budget } from "../OneBudget/OneBudgetSlice";

// Начальное состояние
interface CompareState {
    selectedBudgets: Budget[]; // Храним массив объектов Budget
}

const initialState: CompareState = {
    selectedBudgets: JSON.parse(localStorage.getItem("selectedBudgets") || "[]") || [],
};

// Создаем слайс
const compareSlice = createSlice({
    name: "compare",
    initialState,
    reducers: {
        toggleCheckbox: (state, action: PayloadAction<Budget>) => {
            const index = state.selectedBudgets.findIndex(budget => budget.id === action.payload.id);
            if (index === -1) {
                state.selectedBudgets.push(action.payload);
            } else {
                state.selectedBudgets.splice(index, 1);
            }
            localStorage.setItem("selectedBudgets", JSON.stringify(state.selectedBudgets));
        },
    },
});

export const { toggleCheckbox } = compareSlice.actions;
export default compareSlice.reducer;
