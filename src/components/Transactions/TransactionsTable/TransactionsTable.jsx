import styles from './TransactionsTable.module.css';
import { Pagination } from 'antd';
import { useState } from 'react';
import { formatFirestoreDate } from '../../../utils/util';
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteTransaction } from '../../../store/transactions-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebase';

export default function TransactionsTable({ data, title, isOverview, searchTerm, setSearchTerm }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const isDarkMode = useSelector((state) => state.theme.darkMode);
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

    // Paginate the filtered data
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    function handleDelete(transactionId) {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                dispatch(deleteTransaction({ id: transactionId, uid: user.uid }))
                toast.success('Transaction deleted.');
            } catch (error) {
                toast.error('Failed to delete the transaction.')
                console.log(error.message);
            }
        }
    }

    return (
        <>
            <div className={`
                ${styles.transactionsContainer} 
                ${isDarkMode ? styles.darkMode : ''}
                `}>
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

                <table className={`
                    ${styles.transactionsTable}
                    ${isDarkMode ? styles.darkMode : ''}
                    `}>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((i) => (
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                {isOverview ?
                                    <td>{i.type}</td>
                                    :
                                    <td>{i.tag}</td>
                                }
                                <td>{formatFirestoreDate(i.date)}</td>
                                <td><NumericFormat
                                    value={i.amount}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                /></td>
                                <td>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(i.id)}>
                                        Delete
                                    </button>
                                </td>
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
