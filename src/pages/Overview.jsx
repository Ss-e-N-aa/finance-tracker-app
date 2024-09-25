import '../styles/Overview.css';
import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import TransactionsChart from '../components/Transactions/TransactionsChart/TransactionsChart';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/transactions-slice';
import { transactionsActions } from '../store/transactions-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function Overview() {
    const { transactions, totalBalance } = useSelector((state) => state.transactions);
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

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
                    <li><Card title="Current Balance" amount={totalBalance} isFirst={true} /></li>
                    <li><Card title="Latest Income" amount="$500" /></li>
                    <li><Card title="Latest Expense" amount="$200" /></li>
                </ul>
            </section>

            {/* 
            i want both of these items to be next each other , with fixed and cohesive ratios 
            keeping in mind a responsive layout for smaller screens
            */}
            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable title='Recent Transactions' data={transactions} isOverview />
                    </li>
                    <li>
                        <TransactionsChart />
                    </li>
                </ul>
            </section>

        </>
    );
}
