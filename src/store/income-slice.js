import { createSlice } from "@reduxjs/toolkit";

const incomeSlice = createSlice({
    name: 'income',
    initialState: {
        name: '',
        amount: '',
        date: '',
        tag: 'Job',
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
        clearIncome(state) {
            state.name = '';
            state.amount = '';
            state.date = '';
            state.tag = 'Job';
            state.customTag = '';
        }
    }
})

export const incomeActions = incomeSlice.actions;
export default incomeSlice;
