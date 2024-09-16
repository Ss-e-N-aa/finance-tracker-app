import styles from './Header.module.css';
import { useContext } from 'react';
import UserContext from '../../context/userContext';
import { MdLogout } from "react-icons/md";

export default function Header() {
    const { userData, logout } = useContext(UserContext);

    return (
        <header className={styles.header}>
            <p className={styles.logo}>Finance Tracker</p>
            {userData ? (
                <p className={styles.logout} onClick={logout}>
                    <span className={styles.iconLogout}><MdLogout /></span>
                    Logout
                </p>
            ) : null}
        </header>
    );
}
