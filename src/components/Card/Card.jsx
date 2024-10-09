import { useDispatch, useSelector } from 'react-redux';
import { modalActions } from '../../store/modal-slice';
import styles from './Card.module.css';
import AddExpenseModal from '../Modals/AddExpenseModal';
import AddIncomeModal from '../Modals/AddIncomeModal';
import { NumericFormat } from 'react-number-format';

export default function Card({ title, amount, isFirst, addBtn, modalType }) {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    const showModal = () => {
        dispatch(modalActions.toggle(modalType));
    };

    return (
        <>
            <AddExpenseModal />
            <AddIncomeModal />
            <div className={`
                ${styles.card} ${isFirst ? styles.firstCard : ''}
                 ${isDarkMode ? styles.darkMode : ''}
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
                </div>
                <p><NumericFormat
                    value={amount}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={false}
                /></p>
            </div>
        </>
    );
}
