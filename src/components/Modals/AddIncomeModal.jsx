import styles from './AddModal.module.css';
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { incomeActions } from '../../store/income-slice'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import { addTransaction } from '../../store/transactions-slice';

export default function AddIncomeModal() {
    const { showModal, modalType } = useSelector((state) => state.modal);
    const income = useSelector((state) => state.income);
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();

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
            date: income.date || new Date().toISOString().split("T")[0],
            tag: income.tag === "other" ? income.customTag : income.tag,
        }
        console.log(newTransaction);
        dispatch(addTransaction({ uid: user.uid, transaction: newTransaction }));
        handleCancel();
    };


    return (
        <Modal
            title="Add a new Income"
            open={showModal && modalType === 'income'}
            onCancel={handleCancel}
            footer={null}
        >
            <form onSubmit={handleSubmit}>
                <div className={styles.inputs}>

                    <div className={styles.input}>
                        <input
                            type="text"
                            name="name"
                            value={income.name}
                            placeholder="Name"
                            onChange={(e) => dispatch(incomeActions.setName(e.target.value))}
                        />
                    </div>


                    <div className={styles.input}>
                        <input
                            type="number"
                            name="amount"
                            value={income.amount}
                            placeholder="Amount"
                            onChange={(e) => dispatch(incomeActions.setAmount(e.target.value))}
                        />
                    </div>


                    <div className={styles.input}>
                        <input
                            type="date"
                            name="date"
                            value={income.date}
                            onChange={(e) => dispatch(incomeActions.setDate(e.target.value))}
                        />
                    </div>

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
