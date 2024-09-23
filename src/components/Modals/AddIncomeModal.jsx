import styles from './AddModal.module.css';
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { incomeActions } from '../../store/income-slice'
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../../firebase';
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import UserContext from '../../context/userContext';
import { useContext } from 'react';


export default function AddIncomeModal() {
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();
    const { showModal, modalType } = useSelector((state) => state.modal);
    const income = useSelector((state) => state.income);
    const [transactions, setTransactions] = useState([]);
    const { setLoading } = useContext(UserContext);

    const handleCancel = () => {
        dispatch(modalActions.toggle(null)); // Close modal
        dispatch(incomeActions.clearIncome()); // Clear form fields
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTransaction = {
            type: 'income',
            name: income.name || "",
            amount: income.amount || 0,
            date: income.date || new Date().toISOString().split("T")[0], // Use current date if not selected
            tag: income.tag === "other" ? income.customTag : income.tag,
        }
        console.log(newTransaction);
        addTransaction(newTransaction);
    };

    //should make a seperate slice for transactions / adding and fetching 
    async function addTransaction(transaction) {
        try {
            const docRef = await addDoc(
                collection(db, `users/${user.uid}/transactions`),
                transaction
            )
            console.log('Document written with ID: ', docRef.id)
            toast.success('Transaction Added.')
        } catch (error) {
            console.log(`Error adding document: `, error)
            toast.error('Could not add transaction...')
        }
    }

    // this is creating an infinite loop ... 

    /*     useEffect(() => {
            fetchTransactions();
        }, []); */

    async function fetchTransactions() {
        setLoading(true);
        if (user) {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                transactionsArray.push(doc.data());
            });
            setTransactions(transactionsArray);
            console.log(transactionsArray);
            toast.success("Transactions Fetched!");
        }
        setLoading(false);
    }

    return (
        <Modal
            title="Add a new Income"
            open={showModal && modalType === 'income'}
            onCancel={handleCancel}
            footer={null}
        >
            <form onSubmit={handleSubmit}>
                <div className={styles.inputs}>
                    {/* Name Input */}
                    <div className={styles.input}>
                        <input
                            type="text"
                            name="name"
                            value={income.name}
                            placeholder="Name"
                            onChange={(e) => dispatch(incomeActions.setName(e.target.value))}
                        />
                    </div>

                    {/* Amount Input */}
                    <div className={styles.input}>
                        <input
                            type="number"
                            name="amount"
                            value={income.amount}
                            placeholder="Amount"
                            onChange={(e) => dispatch(incomeActions.setAmount(e.target.value))}
                        />
                    </div>

                    {/* Date Input */}
                    <div className={styles.input}>
                        <input
                            type="date"
                            name="date"
                            value={income.date}
                            onChange={(e) => dispatch(incomeActions.setDate(e.target.value))}
                        />
                    </div>

                    {/* Select Input */}
                    <div className={styles.input}>
                        <select
                            className={styles.select}
                            name="tag"
                            value={income.tag}
                            onChange={(e) => dispatch(incomeActions.setTag(e.target.value))}
                        >
                            <option value="Job">Job</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investment">Investment</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Custom Text Input for "Other" */}
                    {income.tag === "other" && (
                        <div className={styles.input}>
                            <input
                                type="text"
                                name="customTag"
                                placeholder="Enter custom tag"
                                value={income.customTag || ""}
                                onChange={(e) => dispatch(incomeActions.setCustomTag(e.target.value))}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className={styles.submitContainer}>
                        <button className={styles.button}>
                            Add Income
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
