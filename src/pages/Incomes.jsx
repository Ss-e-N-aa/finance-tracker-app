import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import '../styles/Overview.css';

// placeholder
const transactions = [
    { description: 'newest transaction', type: 'Freelance', date: '2024-09-01', amount: '$2500' },
    { description: 'Transaction 2', type: 'Job', date: '2024-09-02', amount: '$3000' },
    { description: 'oldest transaction', type: 'Other', date: '2024-09-03', amount: '$500' },
];

export default function Incomes() {
    return (
        <>
            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Total Incomes" amount="$20,500.25" isFirst={true} addBtn modalType="income" /></li>
                    <li><Card title="Latest Income" amount="$3,250.00" /></li>
                </ul>
            </section>

            <section className="overview-section">
                <ul className="card-list">
                    <li>
                        <TransactionsTable title='Recent Incomes' data={transactions} />
                    </li>
                </ul>
            </section>
        </>
    )
}
