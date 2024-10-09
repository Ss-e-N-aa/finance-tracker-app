import { useDispatch, useSelector } from 'react-redux';
import { modalActions } from '../../store/modal-slice';
import styles from './GoalsCard.module.css';
import { NumericFormat } from 'react-number-format';
import ProgressBar from '../ProgressBar/ProgressBar';
import AddSavingsGoalsModal from '../Modals/AddSavingsGoalModal';
import AddFundsModal from '../Modals/AddFundsModal';
import { removeSavingsGoal } from '../../store/savingsGoals-slice';
import { savingsGoalsActions } from '../../store/savingsGoals-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';

export default function GoalsCard({ id, title, targetAmount, progressAmount, addBtn, AddUpdateBtn, modalType, isFirst }) {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.darkMode);
    const [user] = useAuthState(auth);

    const showModal = () => {
        const goal = { id, name: title, targetAmount, progressAmount };
        dispatch(modalActions.toggle(modalType));
        dispatch(savingsGoalsActions.setGoal(goal));
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                dispatch(removeSavingsGoal({ id, uid: user.uid }));
                toast.success('Goal deleted.');
            } catch (error) {
                toast.error('Failed to delete the goal');
                console.log(error.message);
            }
        }
    };

    // Calculate the progress percentage
    const progressPercentage = (progressAmount / targetAmount) * 100;
    const formattedPercentage = progressPercentage.toFixed(0);

    const isGoalCompleted = progressAmount >= targetAmount; // this is for css styling , turn borders green

    return (
        <>
            <AddFundsModal />
            <AddSavingsGoalsModal />
            <div className={`
                ${styles.card} 
                ${isFirst ? styles.firstCard : ''} 
                ${isFirst ? styles.noHeight : ''} 
                ${isDarkMode ? styles.darkMode : ''}
                ${!isFirst && isGoalCompleted ? styles.completedGoal : ''}
            `}>
                <div className={`
                    ${styles.headerContainer}
                    ${isDarkMode ? styles.darkMode : ''}
                    `}>
                    <h4>{title}</h4>
                    {addBtn && (
                        <button onClick={showModal}>
                            +
                        </button>
                    )}

                    {AddUpdateBtn && (
                        <div className={styles.actionsContainer}>
                            <span onClick={handleDelete} className={styles.deleteBtn}>Delete</span>

                            {!isGoalCompleted && <button className={`
                            ${styles.updateBtn}
                            ${isDarkMode ? styles.darkMode : ''}
                            `}
                                onClick={showModal}>
                                Update
                            </button>
                            }
                        </div>
                    )}
                </div>

                <div className={styles.targetContainer} >
                    <p>
                        <NumericFormat
                            value={progressAmount}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                            decimalScale={2}
                            fixedDecimalScale={false}
                        />
                    </p>
                    <div className={styles.ofTargetContainer}>
                        <p id={styles.targetText}>of</p>
                        <p id={styles.numStyle}>
                            <NumericFormat
                                value={targetAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                                decimalScale={2}
                                fixedDecimalScale={false}
                            />
                        </p>
                    </div>
                </div>

                {!isFirst &&
                    <ProgressBar progressAmount={formattedPercentage} />
                }

            </div>
        </>
    );
}
