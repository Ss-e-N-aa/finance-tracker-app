import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// thunk for fetching transactions
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (uid, { rejectWithValue }) => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${uid}/transactions`));
            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                transactionsArray.push(doc.data());
            });
            return transactionsArray;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// thunk for adding transactions
export const addTransaction = createAsyncThunk(
    'transactions/addTransaction',
    async ({ uid, transaction }, { rejectWithValue }) => {
        try {
            const docRef = await addDoc(collection(db, `users/${uid}/transactions`), transaction);
            fetchTransactions(uid);
            return { ...transaction, id: docRef.id }; // Returning the new transaction with ID
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
        totalBalance: 0,
        expensesTotal: 0,
        incomeTotal: 0,
    },
    reducers: {
        calculateBalance: (state) => {
            let incomeTotal = 0;
            let expensesTotal = 0;

            state.transactions.forEach((transaction) => {
                const amount = parseFloat(transaction.amount);
                if (transaction.type === 'income') {
                    incomeTotal += amount;
                } else if (transaction.type === 'expense') {
                    expensesTotal += amount;
                }
            });

            state.incomeTotal = incomeTotal;
            state.expensesTotal = expensesTotal;
            state.totalBalance = incomeTotal - expensesTotal;
        }
    },
    // extra reducers are needed bcus im using async thunks 
    extraReducers: (builder) => {
        builder
            // Handle fetch transaction 
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.transactions = action.payload;

                // Recalculate balance after adding a new transaction
                transactionsSlice.caseReducers.calculateBalance(state);
            })

            // Handle add transaction
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.transactions.push(action.payload);
            })
    },
});

export const transactionsActions = transactionsSlice.actions;
export default transactionsSlice;
