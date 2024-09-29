import styles from './TransactionsChart.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fetchTransactions } from '../../../store/transactions-slice';
import { transactionsActions } from '../../../store/transactions-slice';
import { auth } from '../../../../firebase';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components used in Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function TransactionsChart() {
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);
    const { transactions } = useSelector((state) => state.transactions);

    useEffect(() => {
        if (user) {
            dispatch(fetchTransactions(user.uid));
            dispatch(transactionsActions.calculateBalance());
        }
    }, [user, dispatch]);

    const expenseItems = transactions.filter(i => i.type === 'expense');
    const incomeItems = transactions.filter(i => i.type === 'income');

    const data = {
        labels: ['Expense', 'Income'],
        datasets: [
            {
                label: 'Transactions',
                data: [expenseItems.length, incomeItems.length],
                backgroundColor: ['#666eff', '#66ffc4'],
                borderColor: ['#666eff', '#66ffc4'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset;
                        const total = dataset.data.reduce((sum, value) => sum + value, 0);
                        const percentage = ((dataset.data[tooltipItem.dataIndex] / total) * 100).toFixed(2);
                        return `${tooltipItem.label}: ${percentage}% (${tooltipItem.raw})`;
                    },
                },
            },
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    boxWidth: 12,
                    boxHeight: 12,
                    color: '#555',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
                align: 'center',
            },
        },
        responsive: true,
        layout: {
            padding: {
                right: 30,
            },
        },
    }


    return (
        <>
            <div className={styles.chartContainer}>
                <div className={styles.chartPlaceholder}>
                    <Pie data={data} options={options} />
                </div>
            </div>
        </>
    );
}
