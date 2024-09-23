import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import '../styles/Overview.css';

// placeholder
const transactions = [
    { description: 'newest transaction', type: 'Entertainment', date: '2024-09-01', amount: '$100' },
    { description: 'Transaction 2', type: 'Bills', date: '2024-09-02', amount: '$50' },
    { description: 'oldest transaction', type: 'Subscriptions', date: '2024-09-03', amount: '$200' },
];

export default function Expenses() {
    return (
        <>
            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Total Expenses" amount="$10,500.25" isFirst={true} addBtn modalType="expense" /></li>
                    <li><Card title="Latest Expense" amount="$1,250.00" /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable title='Recent Expenses' data={transactions} />
                    </li>
                </ul>
            </section>
        </>
    )
}
