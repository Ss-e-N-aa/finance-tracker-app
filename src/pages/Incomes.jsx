import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import '../styles/Overview.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchTransactions, fetchLastIncome } from '../store/transactions-slice';
import { transactionsActions } from '../store/transactions-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function Incomes() {
    const { transactions, incomeTotal, lastIncome, searchTerm } = useSelector((state) => state.transactions);
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchTransactions(user.uid));
            dispatch(fetchLastIncome(user.uid));
        }
    }, [user, dispatch]);

    // Filter transactions with type 'income'
    const incomeTransactions = transactions.filter(transaction => transaction.type === 'income');

    // filter for the search term based on tag
    let filteredTransactions = incomeTransactions.filter((i) => {
        return i.tag.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Total Incomes" amount={incomeTotal} isFirst={true} addBtn modalType="income" /></li>
                    <li><Card title="Last Income" amount={lastIncome ? `${lastIncome.amount}` : ''} /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable
                            title='Recent Incomes'
                            data={filteredTransactions}
                            searchTerm={searchTerm}
                            setSearchTerm={(term) => dispatch(transactionsActions.setSearchTerm(term))}
                        />
                    </li>
                </ul>
            </section>
        </>
    )
}
