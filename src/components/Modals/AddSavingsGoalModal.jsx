import styles from './AddModal.module.css';
import { Modal, ConfigProvider, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { savingsGoalsActions, addSavingsGoal } from '../../store/savingsGoals-slice';
import { auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Timestamp } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function AddSavingsGoalsModal() {
    const { showModal, modalType } = useSelector((state) => state.modal);
    const { totalBalance } = useSelector((state) => state.transactions);
    const goal = useSelector((state) => state.savingsGoals.goal);
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    const handleCancel = () => {
        dispatch(modalActions.toggle(null));
    };

    // this is to make sure the modal is empty everytime it is opened
    useEffect(() => {
        if (showModal && modalType === 'goal') {
            dispatch(savingsGoalsActions.clearForm());
        }
    }, [showModal, modalType, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newGoal = {
            name: goal.name,
            targetAmount: parseFloat(goal.targetAmount),
            progressAmount: 0,
            date: Timestamp.now(),
            isFinished: false,
        };

        if (newGoal.targetAmount < 0) {
            toast.error("Amount must be a positive number.");
            return;
        }

        if (newGoal.targetAmount > totalBalance) {
            toast.error('Insufficient Balance')
        } else {
            try {
                dispatch(addSavingsGoal({ uid: user.uid, savingsGoal: newGoal }));
                handleCancel();
                toast.success('Goal Added!');
            } catch (error) {
                console.log('Failed to add a savings goal: ', error.message);
                toast.error(error.message);
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
                title="Add a new Savings Goal"
                open={showModal && modalType === 'goal'}
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
                                required
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={goal.name}
                                onChange={(e) => dispatch(savingsGoalsActions.setName(e.target.value))}
                            />
                        </div>

                        <div className={`${styles.input} ${isDarkMode ? styles.darkMode : ''}`}>
                            <input
                                required
                                type="number"
                                name="targetAmount"
                                placeholder="Target Amount"
                                value={goal.targetAmount}
                                onChange={(e) => dispatch(savingsGoalsActions.setTargetAmount(e.target.value))}
                            />
                        </div>

                        <div className={styles.submitContainer}>
                            <button className={`
                                ${styles.button}
                                ${isDarkMode ? styles.darkMode : ''}`}
                                type="submit">
                                Add a new goal</button>
                        </div>
                    </div>
                </form>
            </Modal >
        </ConfigProvider>
    );
}