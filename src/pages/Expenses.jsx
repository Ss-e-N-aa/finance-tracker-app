import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import '../styles/Overview.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchTransactions } from '../store/transactions-slice';
import { transactionsActions } from '../store/transactions-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function Expenses() {
    const { transactions, expensesTotal } = useSelector((state) => state.transactions);
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

    // Filter transactions with type 'expense'
    const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');

    useEffect(() => {
        if (user) {
            dispatch(fetchTransactions(user.uid));
            dispatch(transactionsActions.calculateBalance());
        }
    }, [user, dispatch]);

    return (
        <>
            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Total Expenses" amount={expensesTotal} isFirst={true} addBtn modalType="expense" /></li>
                    <li><Card title="Latest Expense" amount="$1,250.00" /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable title='Recent Expenses' data={expenseTransactions} />
                    </li>
                </ul>
            </section>
        </>
    )
}
