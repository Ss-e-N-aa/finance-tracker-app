import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import '../styles/Overview.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchTransactions } from '../store/transactions-slice';
import { transactionsActions, fetchLastExpense } from '../store/transactions-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function Expenses() {
    const { transactions, expensesTotal, lastExpense, searchTerm } = useSelector((state) => state.transactions);
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchTransactions(user.uid));
            dispatch(fetchLastExpense(user.uid));
        }
    }, [user, dispatch]);

    // Filter transactions with type 'expense'
    const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');

    // filter for the search term based on tag
    let filteredTransactions = expenseTransactions.filter((i) => {
        return i.tag.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Total Expenses" amount={expensesTotal} isFirst={true} addBtn modalType="expense" /></li>
                    <li><Card title="Last Expense" amount={lastExpense ? `${lastExpense.amount}` : ''} /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable
                            title='Recent Expenses'
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
