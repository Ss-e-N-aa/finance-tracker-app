import '../styles/Overview.css';
import Card from '../components/Card/Card';
import TransactionsTable from '../components/Transactions/TransactionsTable/TransactionsTable';
import TransactionsChart from '../components/Transactions/TransactionsChart/TransactionsChart';

// placeholder
const transactions = [
    { description: 'newest transaction', type: 'Expense', date: '2024-09-01', amount: '$100' },
    { description: 'Transaction 2', type: 'Income', date: '2024-09-02', amount: '$50' },
    { description: 'oldest transaction', type: 'Expense', date: '2024-09-03', amount: '$200' },
];

export default function Overview() {
    return (
        <>
            <section className="overview-section">
                <ul className="card-list">
                    <li><Card title="Current Balance" amount="$20,500.25" isFirst={true} /></li>
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
                        <TransactionsTable title='Recent Transactions' data={transactions} />
                    </li>
                    <li>
                        <TransactionsChart />
                    </li>
                </ul>
            </section>

        </>
    );
}
