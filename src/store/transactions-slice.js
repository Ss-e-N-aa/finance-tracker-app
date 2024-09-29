import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase';

// fetching all transactions
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (uid, { rejectWithValue }) => {
        try {
            // querying all the transactions to display them from last to first 
            const q = query(
                collection(db, `users/${uid}/transactions`),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(q);

            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                transactionsArray.push({
                    ...data,
                    date: data.date.toDate(), // Convert Firebase Timestamp to JS Date
                });
            });
            return transactionsArray;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// fetching last expense transaction
export const fetchLastExpense = createAsyncThunk(
    'transactions/fetchLastExpense',
    async (uid, { rejectWithValue }) => {
        try {
            const q = query(
                collection(db, `users/${uid}/transactions`),
                where('type', '==', 'expense'),
                orderBy('date', 'desc'),
                limit(1)
            );

            const querySnapshot = await getDocs(q);

            // Map the data and convert the `date` field
            const lastExpenseItem = querySnapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        date: data.date.toDate(), // Convert Firebase Timestamp to JS Date
                    };
                })
            console.log("Last Expense Item:", lastExpenseItem);
            return lastExpenseItem.length > 0 ? lastExpenseItem[0] : null;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch the last expense');
        }
    }
);

// fetching last income transaction
export const fetchLastIncome = createAsyncThunk(
    'transactions/fetchLastIncome',
    async (uid, { rejectWithValue }) => {
        try {
            const q = query(
                collection(db, `users/${uid}/transactions`),
                where('type', '==', 'income'),
                orderBy('date', 'desc'),
                limit(1)
            );

            const querySnapshot = await getDocs(q);

            // Map the data and convert the `date` field
            const lastIncomeItem = querySnapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        date: data.date.toDate(), // Convert Firebase Timestamp to JS Date
                    };
                })
            console.log("Last Expense Item:", lastIncomeItem);
            return lastIncomeItem.length > 0 ? lastIncomeItem[0] : null;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch the last income');
        }
    }
);


// adding transactions
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
        lastExpense: null,
        lastIncome: null,
        totalBalance: 0,
        expensesTotal: 0,
        incomeTotal: 0,
        searchTerm: '',
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
        },

        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        }
    },
    // extra reducers are needed bcus im using async thunks 
    extraReducers: (builder) => {
        builder
            // Handle fetch transactions 
            .addCase(fetchLastIncome.fulfilled, (state, action) => {
                if (action.payload) {
                    state.lastIncome = action.payload;  // This will update only the income, preserving other state
                }
            })

            .addCase(fetchLastExpense.fulfilled, (state, action) => {
                if (action.payload) {
                    state.lastExpense = action.payload;  // This will update only the expense, preserving other state
                }
            })

            .addCase(fetchTransactions.fulfilled, (state, action) => {
                if (action.payload) {
                    state.transactions = action.payload;  // Preserve both incomes and expenses
                }
            })

            // Handle add transaction
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.transactions.push(action.payload);
                transactionsSlice.caseReducers.calculateBalance(state); // re-calculate balance

                if (action.payload.type === 'income') {
                    state.lastIncome = action.payload; // update last income
                } else if (action.payload.type === 'expense') {
                    state.lastExpense = action.payload; // update last expense 
                }
            })
    },
});

export const transactionsActions = transactionsSlice.actions;
export default transactionsSlice;
