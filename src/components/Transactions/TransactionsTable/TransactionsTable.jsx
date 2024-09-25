import styles from './TransactionsTable.module.css';


export default function TransactionsTable({ data, title, isOverview }) {
    return (
        <>
            <div className={styles.transactionsSection}>
                <h2>{title}</h2>
                <table className={styles.transactionsTable}>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((i, index) => (
                            <tr key={index}>
                                <td>{i.name}</td>
                                {isOverview ?
                                    <td>{i.type}</td>
                                    :
                                    <td>{i.tag}</td>
                                }
                                <td>{i.date}</td>
                                <td>{i.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
