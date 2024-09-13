import styles from './Spinner.module.css';

export default function Spinner() {
    return (
        <div className={styles.loader}>
            {/* Simple CSS spinner */}
            <div className={styles.spinner}></div>
        </div>
    )
}
