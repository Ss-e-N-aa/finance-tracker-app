import styles from './AddModal.module.css';
import { Modal, ConfigProvider, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { savingsGoalsActions, updateSavingsGoalAmount } from '../../store/savingsGoals-slice';
import { auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { NumericFormat } from 'react-number-format';

export default function AddFundsModal() {
    const { showModal, modalType } = useSelector((state) => state.modal);
    const goal = useSelector((state) => state.savingsGoals.goal);
    const { totalBalance } = useSelector((state) => state.transactions);
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newAmount = parseFloat(goal.amount);

        if (!goal.id) {
            toast.error('Goal data is not available.');
            return;
        }

        if (newAmount < 0) {
            toast.error("Amount must be a positive number.");
            return;
        }

        if (newAmount > totalBalance) {
            toast.error('Insufficient Balance')
        } else {
            try {
                dispatch(updateSavingsGoalAmount({ uid: user.uid, id: goal.id, newAmount }));
                handleCancel();
                toast.success('Progress updated');
            } catch (error) {
                console.log('Failed to update progress: ', error.message);
                toast.error(error.message);
            }
        }
    };

    const handleCancel = () => {
        dispatch(modalActions.toggle(null));
        dispatch(savingsGoalsActions.clearForm());
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <Modal
                title={`${goal.name} goal`}
                open={showModal && modalType === 'updateGoal'}
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
                            <label>
                                Add funds to:<span>{`${goal.name}`}</span>
                            </label>
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <label>
                                Target Amount:
                                <NumericFormat
                                    value={goal.targetAmount}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                />
                            </label>
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <label className={`${styles.currProgressAmount} ${isDarkMode ? styles.darkMode : ''}`}>
                                Current Progress:
                                <NumericFormat
                                    value={goal.progressAmount}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                />
                            </label>
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                required
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={goal.amount || ""} // "" prevents displaying latest amount added
                                onChange={(e) => dispatch(savingsGoalsActions.setAmount(e.target.value))}
                            />
                        </div>

                        <div className={styles.submitContainer}>
                            <button
                                className={`
                                    ${styles.button}
                                    ${isDarkMode ? styles.darkMode : ''}`}
                                type="submit">
                                Update progress</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </ConfigProvider>
    );
}
