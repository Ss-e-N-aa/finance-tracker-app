import styles from './AddModal.module.css';
import { Modal, ConfigProvider, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { incomeActions } from '../../store/income-slice'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import { addTransaction } from '../../store/transactions-slice';
import { Timestamp } from "firebase/firestore";
import { toast } from 'react-toastify';

export default function AddIncomeModal() {
    const { showModal, modalType } = useSelector((state) => state.modal);
    const income = useSelector((state) => state.income);
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.darkMode);

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
            date: Timestamp.now(),
            tag: income.tag === "other" ? income.customTag : income.tag,
        };

        if (newTransaction.amount < 0) {
            toast.error("Amount must be a positive number.");
            return;
        }

        try {
            dispatch(addTransaction({ uid: user.uid, transaction: newTransaction }));
            handleCancel();
            toast.success('Transaction Added !');
            console.log(newTransaction);
        } catch (error) {
            console.log('Failed to add a transaction: ', error.message)
            toast.error(error.message)
        }
    };


    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <Modal
                title="Add a new Income"
                open={showModal && modalType === 'income'}
                onCancel={handleCancel}
                footer={null}
            >
                <form
                    className={`
                    ${isDarkMode ? styles.darkMode : ''}
                `}
                    onSubmit={handleSubmit}>
                    <div className={styles.inputs}>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                type="text"
                                name="name"
                                value={income.name}
                                placeholder="Name"
                                onChange={(e) => dispatch(incomeActions.setName(e.target.value))}
                            />
                        </div>


                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                type="number"
                                name="amount"
                                value={income.amount}
                                placeholder="Amount"
                                onChange={(e) => dispatch(incomeActions.setAmount(e.target.value))}
                            />
                        </div>


                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                type="date"
                                name="date"
                                value={income.date}
                                onChange={(e) => dispatch(incomeActions.setDate(e.target.value))}
                            />
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <select
                                className={`${styles.select} ${isDarkMode ? styles.darkMode : ''}`}
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


                        {income.tag === "other" && (
                            <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                                <input
                                    type="text"
                                    name="customTag"
                                    placeholder="Enter custom tag"
                                    value={income.customTag || ""}
                                    onChange={(e) => dispatch(incomeActions.setCustomTag(e.target.value))}
                                />
                            </div>
                        )}

                        <div className={styles.submitContainer}>
                            <button className={`
                                ${styles.button}
                                ${isDarkMode ? styles.darkMode : ''}`}>
                                Add Income
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </ConfigProvider>
    );
}
