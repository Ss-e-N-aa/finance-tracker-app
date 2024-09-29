import styles from './Navbar.module.css'
import UserContext from '../../context/userContext';
import { useContext } from 'react';


export default function Navbar() {
    const { userData } = useContext(UserContext);

    // Capitalize the first letter of the user's name
    const capitalizedUserName = userData.name.charAt(0).toUpperCase() + userData.name.slice(1);
    return (
        <header className={styles.navbar}>
            <h3>Welcome , {capitalizedUserName}</h3>
        </header>
    )
}
