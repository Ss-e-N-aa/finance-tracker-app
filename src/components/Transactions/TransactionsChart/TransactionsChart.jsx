import styles from './TransactionsChart.module.css'

export default function TransactionsChart() {
    return (
        <div className={styles.expenseChart}>
            <h2>Total Expenses</h2>
            {/* Placeholder for the chart, there should be a chart component */}
            <div className={styles.chartPlaceholder}>
                Chart showing percentages (e.g., 60% spent on X)
            </div>
        </div>
    )
}
