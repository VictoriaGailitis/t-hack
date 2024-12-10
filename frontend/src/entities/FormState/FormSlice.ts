import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Budget } from "../OneBudget/OneBudgetSlice";

// Начальное состояние
interface FormState {
    selectedBudget: Budget | null;
    activeForm:boolean
}

const initialState: FormState = {
    selectedBudget: null,
    activeForm:true,
};

// Создаем слайс
const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        setSelectedBudget: (state, action: PayloadAction<Budget>) => {
            state.selectedBudget = action.payload;
        },
        setActiveForm: (state, action: PayloadAction<boolean>) => {
            state.activeForm = action.payload;
        },
    },
});

export default formSlice.reducer;
export const { setSelectedBudget, setActiveForm } = formSlice.actions;
