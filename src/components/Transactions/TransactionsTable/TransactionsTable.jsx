import styles from './TransactionsTable.module.css';
import { Pagination } from 'antd';
import { useState } from 'react';
import { formatFirestoreDate } from '../../../utils/util';

export default function TransactionsTable({ data, title, isOverview, searchTerm, setSearchTerm }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);

    // Paginate the filtered data
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <>
            <div className={styles.transactionsContainer}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder='Search by type...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

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
                        {paginatedData.map((i, index) => (
                            <tr key={index}>
                                <td>{i.name}</td>
                                {isOverview ?
                                    <td>{i.type}</td>
                                    :
                                    <td>{i.tag}</td>
                                }
                                <td>{formatFirestoreDate(i.date)}</td>
                                <td>{i.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.paginationContainer}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data.length}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
}
