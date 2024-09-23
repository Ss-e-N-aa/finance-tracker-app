import { useDispatch } from 'react-redux';
import { modalActions } from '../../store/modal-slice';
import styles from './Card.module.css';

import AddExpenseModal from '../Modals/addExpenseModal';
import AddIncomeModal from '../Modals/AddIncomeModal';

export default function Card({ title, amount, isFirst, addBtn, modalType }) {
    const dispatch = useDispatch();

    const showModal = () => {
        dispatch(modalActions.toggle(modalType));
    };


    return (
        <>
            <AddExpenseModal />
            <AddIncomeModal />
            <div className={`${styles.card} ${isFirst ? styles.firstCard : ''}`}>
                <h4>{title}</h4>
                <p>{amount}</p>
                {addBtn && (
                    <button onClick={showModal}>
                        +
                    </button>
                )}
            </div>
        </>
    );
}
