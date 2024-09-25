import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import '../styles/Overview.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchTransactions } from '../store/transactions-slice';
import { transactionsActions } from '../store/transactions-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function Incomes() {
    const { transactions, incomeTotal } = useSelector((state) => state.transactions);
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

    // Filter transactions with type 'income'
    const incomeTransactions = transactions.filter(transaction => transaction.type === 'income');

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
                    <li><Card title="Total Incomes" amount={incomeTotal} isFirst={true} addBtn modalType="income" /></li>
                    <li><Card title="Latest Income" amount="$3,250.00" /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable title='Recent Incomes' data={incomeTransactions} />
                    </li>
                </ul>
            </section>
        </>
    )
}
