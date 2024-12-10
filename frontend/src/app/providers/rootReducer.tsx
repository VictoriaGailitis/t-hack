import { combineReducers } from '@reduxjs/toolkit';

import themeSlice from "../../features/theme/themeSlice";
import budgetsSlice from "../../entities/budgets/budgetsSlice";
import oneBudgetSlice from "../../entities/OneBudget/OneBudgetSlice";
import compareSlice from "../../entities/Compare/CompareSlice";
import formSlice from "../../entities/FormState/FormSlice"

export const rootReducer = combineReducers({
    themeSlice,
    budgetsSlice,
    oneBudgetSlice,
    compareSlice,
    formSlice
});
