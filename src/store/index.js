import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './modal-slice';
import expenseSlice from './expense-slice';
import incomeSlice from './income-slice';

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        expense: expenseSlice.reducer,
        income: incomeSlice.reducer,
    }
});

export default store;