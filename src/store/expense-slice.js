import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
    name: 'expense',
    initialState: {
        name: '',
        amount: '',
        date: '',
        tag: 'Food',
        customTag: ''
    },
    reducers: {
        setName(state, action) {
            state.name = action.payload;
        },
        setAmount(state, action) {
            state.amount = action.payload;
        },
        setDate(state, action) {
            state.date = action.payload;
        },
        setTag(state, action) {
            state.tag = action.payload;
        },
        setCustomTag(state, action) {
            state.customTag = action.payload;
        },
        clearExpense(state) {
            state.name = '';
            state.amount = '';
            state.date = '';
            state.tag = 'Food';
            state.customTag = '';
        }
    }
})

export const expenseActions = expenseSlice.actions;
export default expenseSlice;
