import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

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

// Определяем начальное состояние
interface BudgetsState {
    budgets: Budget[] | null; // Массив объектов бюджета
    loaded:boolean;
}

export const getAllBudgets = createAsyncThunk(
    'budgets/getAllBudgets',
    async () => {
        const response = await axios.get('https://timkoff.itatmisis.ru/api/');
        return response.data; // Убедитесь, что структура данных соответствует вашему состоянию
    }
);

export const deleteBudget = createAsyncThunk(
    'budgets/deleteBudget',
    async (id: number) => {
        await axios.delete(`https://timkoff.itatmisis.ru/api/${id}`); // Удаление по I
        return id; // Возвращаем ID для обновления состояния
    }
)

export const cancelBudget = createAsyncThunk(
    'budgets/cancelBudget',
    async (id: number) => {
        await axios.post(`https://timkoff.itatmisis.ru/api/cancel_calculation/${id}`); // Удаление по I
        return id; // Возвращаем ID для обновления состояния
    }
)

export const createBudget = createAsyncThunk(
    'budgets/createBudget',
    async ({ brand_id, clientsFileKey, open_date, cb_percent }: { brand_id: number; clientsFileKey: string; open_date: string; cb_percent: number }, { dispatch }) => {
        // Отправка POST-запроса с данными бюджета
        const response = await axios.post('https://timkoff.itatmisis.ru/api/budget-calculation', {
            brand_id,
            clientsFileKey,
            open_date,
            cb_percent
        });

        const data = { brand_id, clientsFileKey, open_date, cb_percent, id: response.data.id, status: 'В процессе' };

        // Начинаем периодический опрос
        const intervalId = setInterval(async () => {
            const result = await axios.get(`https://timkoff.itatmisis.ru/api/budget-calculation/${data.id}`);
            if (result.data) {
                // Если ответ с телом получен, прекращаем опрос
                clearInterval(intervalId);
                // Здесь можно вызвать дополнительный action для обновления состояния
                dispatch(updateBudget({...data,...result.data,status:"Завершен"})); // Предположим, у вас есть action для обновления бюджета
            }
        }, 5000); // 5 секунд

        return data; // Вернуть id бюджета из ответа
    }
);


// Начальное состояние
const initialState: BudgetsState = {
    budgets: null,
    loaded: false,
};

// Создаем слайс
const budgetsSlice = createSlice({
    name: "budgets",
    initialState,
    reducers: {
        updateBudget: (state, action: PayloadAction<Budget>) => {
            if (state.budgets) {
                // Обновляем массив, используя map
                state.budgets = state.budgets.map(budget =>
                    budget.id === action.payload.id ? { ...budget, ...action.payload} : budget
                );
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBudgets.pending, (state) => {
                state.loaded = false; // Загрузка данных началась
            })
            .addCase(getAllBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
                state.budgets = action.payload; // Успешная загрузка данных
                state.loaded = true; // Данные загружены
            })
            .addCase(getAllBudgets.rejected, (state) => {
                state.loaded = false; // Ошибка загрузки данных
            })
            .addCase(deleteBudget.pending, (state) => {
                state.loaded = false; // Загрузка данных началась
            })
            .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<number>) => {
                // Фильтруем массив, чтобы исключить удаленный бюджет
                if (state.budgets) {
                    state.budgets = state.budgets.filter(budget => budget.id !== action.payload);
                }
                state.loaded = true; // Данные загружены
            })
            .addCase(deleteBudget.rejected, (state) => {
                state.loaded = false; // Ошибка загрузки данных
            })
            .addCase(createBudget.pending, (state) => {
                state.loaded = false; // Загрузка данных началась
            })
            .addCase(createBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
                // Добавляем новый бюджет в массив
                if (state.budgets) {
                    state.budgets.push(action.payload); // Добавляем созданный бюджет в массив
                } else {
                    state.budgets = [action.payload]; // Инициализируем массив, если он пуст
                }
                state.loaded = true; // Данные загружены
            })
            .addCase(createBudget.rejected, (state) => {
                state.loaded = false; // Ошибка загрузки данных
            })
            .addCase(cancelBudget.pending, (state) => {
                state.loaded = false; // Загрузка данных началась
            })
            .addCase(cancelBudget.fulfilled, (state, action: PayloadAction<number>) => {
                // Фильтруем массив, чтобы исключить удаленный бюджет
                if (state.budgets) {
                    state.budgets = state.budgets.filter(budget => budget.id !== action.payload);
                }
                state.loaded = true; // Данные загружены
            })
            .addCase(cancelBudget.rejected, (state) => {
                state.loaded = false; // Ошибка загрузки данных
            })

    },
});

export const { updateBudget } = budgetsSlice.actions;

export default budgetsSlice.reducer;
