import styles from './Spinner.module.css';

export default function Spinner() {
    return (
        <div className={styles.loader}>
            <div className={styles.spinner}></div>
        </div>
    )
}
