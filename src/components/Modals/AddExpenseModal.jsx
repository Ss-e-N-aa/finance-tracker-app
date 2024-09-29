import styles from './AddModal.module.css';
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { expenseActions } from '../../store/expense-slice';
import { auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addTransaction } from '../../store/transactions-slice';
import { Timestamp } from "firebase/firestore";
import { toast } from 'react-toastify';

export default function AddExpenseModal() {
    const { showModal, modalType } = useSelector((state) => state.modal);
    const expense = useSelector((state) => state.expense);
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();

    const handleCancel = () => {
        dispatch(modalActions.toggle(null)); // Close modal
        dispatch(expenseActions.clearExpense()); // Clear form fields
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTransaction = {
            type: 'expense',
            name: expense.name || "",
            amount: expense.amount || 0,
            date: Timestamp.now(),
            tag: expense.tag === "other" ? expense.customTag : expense.tag,
        }
        console.log(newTransaction);
        dispatch(addTransaction({ uid: user.uid, transaction: newTransaction }));
        handleCancel();
        toast.success('Transaction Added !');
    };


    return (
        <Modal
            title="Add a new Expense"
            open={showModal && modalType === 'expense'}
            onCancel={handleCancel}
            footer={null}
        >
            <form onSubmit={handleSubmit}>
                <div className={styles.inputs}>
                    <div className={styles.input}>
                        <input
                            required
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={expense.name}
                            onChange={(e) => dispatch(expenseActions.setName(e.target.value))}
                        />
                    </div>

                    <div className={styles.input}>
                        <input
                            required
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={expense.amount}
                            onChange={(e) => dispatch(expenseActions.setAmount(e.target.value))}
                        />
                    </div>

                    <div className={styles.input}>
                        <input
                            required
                            type="date"
                            name="date"
                            value={expense.date}
                            onChange={(e) => dispatch(expenseActions.setDate(e.target.value))}
                        />
                    </div>

                    <div className={styles.input}>
                        <select
                            required
                            className={styles.select}
                            name="tag"
                            value={expense.tag}
                            onChange={(e) => dispatch(expenseActions.setTag(e.target.value))}
                        >
                            <option value="Food">Food</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Bills">Bills</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {expense.tag === "other" && (
                        <div className={styles.input}>
                            <input
                                required
                                type="text"
                                name="customTag"
                                placeholder="Enter custom tag"
                                value={expense.customTag}
                                onChange={(e) => dispatch(expenseActions.setCustomTag(e.target.value))}
                            />
                        </div>
                    )}

                    <div className={styles.submitContainer}>
                        <button className={styles.button}>Add Expense</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}