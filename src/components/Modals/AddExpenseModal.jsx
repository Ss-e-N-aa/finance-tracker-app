import styles from './AddModal.module.css';
import { Modal, ConfigProvider, theme } from "antd";
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
    const { totalBalance } = useSelector((state) => state.transactions);
    const expense = useSelector((state) => state.expense);
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    const handleCancel = () => {
        dispatch(modalActions.toggle(null)); // Close modal
        dispatch(expenseActions.clearExpense()); // Clear form fields
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newExpense = {
            type: 'expense',
            name: expense.name || "",
            amount: expense.amount || 0,
            date: Timestamp.now(),
            tag: expense.tag === "other" ? expense.customTag : expense.tag,
        }

        if (newExpense.amount < 0) {
            toast.error("Amount must be a positive number.");
            return;
        }

        if (newExpense.amount > totalBalance) {
            toast.error('Insufficient Balance')
        } else {
            try {
                dispatch(addTransaction({ uid: user.uid, transaction: newExpense }));
                handleCancel();
                toast.success('Transaction Added !');
                console.log(newExpense);
            } catch (error) {
                console.log('Failed to add a transaction: ', error.message)
                toast.error(error.message)
            }
        }
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <Modal
                title="Add a new Expense"
                open={showModal && modalType === 'expense'}
                onCancel={handleCancel}
                footer={null}
            >
                <form className={`${isDarkMode ? styles.darkMode : ''}`} onSubmit={handleSubmit}>
                    <div className={styles.inputs}>
                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                required
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={expense.name}
                                onChange={(e) => dispatch(expenseActions.setName(e.target.value))}
                            />
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                required
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={expense.amount}
                                onChange={(e) => dispatch(expenseActions.setAmount(e.target.value))}
                            />
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                required
                                type="date"
                                name="date"
                                value={expense.date}
                                onChange={(e) => dispatch(expenseActions.setDate(e.target.value))}
                            />
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
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
                            <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
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
                            <button className={`
                            ${styles.button}
                            ${isDarkMode ? styles.darkMode : ''}`}>
                                Add Expense
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </ConfigProvider>
    );
}