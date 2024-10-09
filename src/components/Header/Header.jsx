import styles from './Header.module.css';
import { useContext } from 'react';
import UserContext from '../../context/userContext';
import { MdLogout } from "react-icons/md";
import { useSelector } from 'react-redux';

export default function Header() {
    const { userData, logout } = useContext(UserContext);
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    function handleLogout() {
        logout();
    }

    return (
        <header className={`
             ${styles.header}
            ${isDarkMode ? styles.darkMode : ''}
        `}>
            <p className={styles.logo}>Finance Tracker</p>
            {userData ? (
                <p className={styles.logout} onClick={handleLogout}>
                    <span className={styles.iconLogout}><MdLogout /></span>
                    Logout
                </p>
            ) : null}
        </header>
    );
}
