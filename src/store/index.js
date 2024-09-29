import { configureStore } from '@reduxjs/toolkit';
import modalSlice from './modal-slice';
import expenseSlice from './expense-slice';
import incomeSlice from './income-slice';
import transactionsSlice from './transactions-slice';

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        expense: expenseSlice.reducer,
        income: incomeSlice.reducer,
        transactions: transactionsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

export default store;
