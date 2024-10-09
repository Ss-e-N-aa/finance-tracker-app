import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, getDocs, getDoc, updateDoc, addDoc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// fetch all goals
export const fetchAllSavingsGoals = createAsyncThunk(
    'savingsGoals/fetchAllSavingsGoals',
    async (uid, { rejectWithValue }) => {
        try {
            const docsQueries = query(
                collection(db, `users/${uid}/savingsGoals`),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(docsQueries);

            let savingsGoalsArray = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                savingsGoalsArray.push({
                    ...data,
                    date: data.date.toDate(), // convert Timestamp to JS Date
                    id: doc.id,
                });
            });
            console.log(savingsGoalsArray)
            return savingsGoalsArray;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// add a goal
export const addSavingsGoal = createAsyncThunk(
    'savingsGoals/addSavingsGoal',
    async ({ uid, savingsGoal }, { rejectWithValue }) => {
        try {
            const docRef = await addDoc(collection(db, `users/${uid}/savingsGoals`), savingsGoal);
            return { ...savingsGoal, id: docRef.id }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// update the progress amount for a goal 
export const updateSavingsGoalAmount = createAsyncThunk(
    'savingsGoals/updateSavingsGoalAmount',
    async ({ uid, id, newAmount }, { getState, rejectWithValue }) => {
        try {
            const totalBalance = getState().transactions.totalBalance;  // Fetch totalBalance from transactions state
            /* const updatedTotalBalance = totalBalance - newAmount; */ // this is for deducing from totalBalance ..not working atm

            const docRef = doc(db, `users/${uid}/savingsGoals`, id);

            // fetch the current goal's existing progressAmount
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const currentProgress = docSnapshot.data().progressAmount;
                const updatedAmount = currentProgress + newAmount;

                // Check if updatedAmount exceeds the total balance
                if (updatedAmount > totalBalance) {
                    console.log('Insufficient balance. Progress amount exceeds total balance.');
                    return rejectWithValue('Insufficient balance');
                }

                await updateDoc(docRef, { progressAmount: updatedAmount });

                return { id, newAmount: updatedAmount, };
            } else {
                throw new Error('Goal not found.');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// remove a goal
export const removeSavingsGoal = createAsyncThunk(
    'savingsGoals/removeSavingsGoal',
    async ({ id, uid }, { rejectWithValue }) => {
        try {
            const goalDoc = doc(db, `users/${uid}/savingsGoals`, id);
            await deleteDoc(goalDoc);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const savingsGoalsSlice = createSlice({
    name: 'savingsGoals',
    initialState: {
        savingsGoals: [],
        goalsTotal: 0,  // total goals amount
        progressTotal: 0, // total saved progress amount
        goal: {
            id: '',
            name: '',
            amount: '',  // amount to add
            targetAmount: '',
            progressAmount: '', // current saved amount
            date: '',
            isFinished: false,
        }
    },
    reducers: {
        // calculate the total of all goals from each doc added into the collection...
        calculateTotalGoals: (state) => {
            let goalsTotal = 0;

            state.savingsGoals.forEach((goal) => {
                const targetAmount = parseFloat(goal.targetAmount);
                goalsTotal += targetAmount;
            });

            state.goalsTotal = goalsTotal;
        },
        calculateTotalProgress: (state) => {
            let progressTotal = 0;

            state.savingsGoals.forEach((goal) => {
                const progressAmount = parseFloat(goal.progressAmount);
                progressTotal += progressAmount;
            });

            state.progressTotal = progressTotal;
        },
        setGoal(state, action) {
            state.goal = action.payload;
        },
        setName(state, action) {
            state.goal.name = action.payload;
        },
        setAmount(state, action) {
            state.goal.amount = action.payload;
        },
        setTargetAmount(state, action) {
            state.goal.targetAmount = action.payload;
        },
        setProgressAmount(state, action) {
            state.goal.progressAmount = action.payload;
        },
        setDate(state, action) {
            state.goal.date = action.payload;
        },
        setStatus(state, action) {
            state.goal.status = action.payload;
        },
        clearForm(state) {
            state.goal = {
                name: '',
                amount: '',
                targetAmount: '',
                progressAmount: '',
                date: '',
                isFinished: false,
            };
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSavingsGoals.fulfilled, (state, action) => {
                state.savingsGoals = action.payload;

                savingsGoalsSlice.caseReducers.calculateTotalGoals(state);     // calculate the total of goals
                savingsGoalsSlice.caseReducers.calculateTotalProgress(state);  // calculate the total of progress of all goals
            })
            .addCase(addSavingsGoal.fulfilled, (state, action) => {
                state.savingsGoals.unshift(action.payload);  // unshift so its first of the list . 

                savingsGoalsSlice.caseReducers.calculateTotalGoals(state);
                savingsGoalsSlice.caseReducers.calculateTotalProgress(state);
            })
            .addCase(updateSavingsGoalAmount.fulfilled, (state, action) => {
                const { id, newAmount } = action.payload;
                const goal = state.savingsGoals.find(goal => goal.id === id);

                if (goal) {
                    goal.progressAmount = newAmount;
                }

                savingsGoalsSlice.caseReducers.clearForm(state);
                savingsGoalsSlice.caseReducers.calculateTotalProgress(state);
            })
            .addCase(removeSavingsGoal.fulfilled, (state, action) => {
                state.savingsGoals = state.savingsGoals.filter(goal => goal.id !== action.payload);

                savingsGoalsSlice.caseReducers.calculateTotalGoals(state);
                savingsGoalsSlice.caseReducers.calculateTotalProgress(state);
                savingsGoalsSlice.caseReducers.clearForm(state);
            });

    }
})

export const savingsGoalsActions = savingsGoalsSlice.actions;
export default savingsGoalsSlice;
