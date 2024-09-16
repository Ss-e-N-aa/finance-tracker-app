import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom';
import { HiHome } from "react-icons/hi2";
import { HiCog6Tooth } from "react-icons/hi2";
import { GrMoney } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import { HiOutlineCash } from "react-icons/hi";

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <nav>
                <ul className={styles.ul}>
                    <li>
                        <NavLink className={styles.link} to='overview'>
                            <span className={styles.iconHome}><HiHome /></span>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={styles.link} to='incomes'>
                            <span className={styles.iconMoney}><GrMoney /></span>
                            Incomes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={styles.link} to='expenses'>
                            <span className={styles.iconExpense}><CgNotes /></span>
                            Expenses
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={styles.link} to='budgets'>
                            <span className={styles.iconBudget}><HiOutlineCash /></span>
                            Goals
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={styles.link} to='settings'>
                            <span className={styles.iconGear}><HiCog6Tooth /></span>
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside >
    )
}
