import styles from './Navbar.module.css'
import UserContext from '../../context/userContext';
import { useContext } from 'react';
import { useSelector } from 'react-redux';

export default function Navbar() {
    const { userData } = useContext(UserContext);
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    // Capitalize the first letter of the user's name
    const capitalizedUserName = userData.name.charAt(0).toUpperCase() + userData.name.slice(1);
    return (
        <header className={`
           ${styles.navbar}
            ${isDarkMode ? styles.darkMode : ''}
           `}>
            <h3>Welcome , {capitalizedUserName}</h3>
        </header>
    )
}
