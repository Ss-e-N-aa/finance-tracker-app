import '../styles/Overview.css';
import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import TransactionsChart from '../components/Transactions/TransactionsChart/TransactionsChart';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchLastExpense, fetchLastIncome } from '../store/transactions-slice';
import { transactionsActions } from '../store/transactions-slice';
import { fetchAllSavingsGoals } from '../store/savingsGoals-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import GoalsCard from '../components/GoalsCard/GoalsCard';

export default function Overview() {
    const { transactions, totalBalance, lastExpense, lastIncome, searchTerm } = useSelector((state) => state.transactions);
    const { goalsTotal, progressTotal } = useSelector((state) => state.savingsGoals);
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchAllSavingsGoals(user.uid));
            dispatch(fetchTransactions(user.uid));
            dispatch(fetchLastExpense(user.uid));
            dispatch(fetchLastIncome(user.uid));
        }
    }, [user, dispatch]);

    let filteredTransactions = transactions.filter((i) => {
        return i.type.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Current Balance" amount={totalBalance} isFirst={true} /></li>
                    <li><GoalsCard title="Total Goals" progressAmount={progressTotal} targetAmount={goalsTotal} isFirst={true} /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Last Income" amount={lastIncome ? `${lastIncome.amount}` : ''} /></li>
                    <li><Card title="Last Expense" amount={lastExpense ? `${lastExpense.amount}` : ''} /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable
                            title='Recent Transactions'
                            data={filteredTransactions}
                            isOverview
                            searchTerm={searchTerm}
                            setSearchTerm={(term) => dispatch(transactionsActions.setSearchTerm(term))}
                        />
                    </li>
                    <li>
                        <TransactionsChart />
                    </li>
                </ul>
            </section>

        </>
    );
}
