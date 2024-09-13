import styles from './Header.module.css';
import { useContext } from 'react';
import UserContext from '../../context/userContext';

export default function Header() {
    const { userData, logout } = useContext(UserContext);

    return (
        <header className={styles.header}>
            <p className={styles.logo}>Expense Tracker</p>
            {userData ? (
                <p className={styles.logout} onClick={logout}>
                    Logout
                </p>
            ) : null}
        </header>
    );
}
