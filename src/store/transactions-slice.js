import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, query, orderBy, limit, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
/* import { updateSavingsGoalAmount } from './savingsGoals-slice'; */

// fetching all transactions
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (uid, { rejectWithValue }) => {
        try {
            // querying all the transactions to display them from newest to last
            const docsQueries = query(
                collection(db, `users/${uid}/transactions`),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(docsQueries);

            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                transactionsArray.push({
                    ...data,
                    date: data.date.toDate(), // Convert Firebase Timestamp to JS Date
                    id: doc.id
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
            console.log("Last Income Item:", lastIncomeItem);
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
            return { ...transaction, id: docRef.id };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// delete a transaction
export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async ({ id, uid }, { rejectWithValue }) => {
        try {
            const transactionDoc = doc(db, `users/${uid}/transactions`, id);
            await deleteDoc(transactionDoc);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

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
            .addCase(fetchLastIncome.fulfilled, (state, action) => {
                state.lastIncome = action.payload;
            })

            .addCase(fetchLastExpense.fulfilled, (state, action) => {
                state.lastExpense = action.payload;
            })

            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.transactions = action.payload;
                transactionsSlice.caseReducers.calculateBalance(state);
            })

            .addCase(addTransaction.fulfilled, (state, action) => {
                state.transactions.push(action.payload);
                transactionsSlice.caseReducers.calculateBalance(state);

                if (action.payload.type === 'income') {
                    state.lastIncome = action.payload;  // update last income
                } else if (action.payload.type === 'expense') {
                    state.lastExpense = action.payload; // update last expense 
                }
            })

            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter(i => i.id !== action.payload)
                transactionsSlice.caseReducers.calculateBalance(state);
            })
        // for setting the new balance .. but its not working atm 
        /*  .addCase(updateSavingsGoalAmount.fulfilled, (state, action) => {
            const { updatedTotalBalance } = action.payload;
            state.totalBalance = updatedTotalBalance;
        }) */
    },
});

export const transactionsActions = transactionsSlice.actions;
export default transactionsSlice;
