import styles from './ProgressBar.module.css';
import { useSelector } from 'react-redux';

export default function ProgressBar({ progressAmount }) {
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    return (
        <div className={styles.progressBarContainer}>
            <div
                className={`${styles.progressBar} ${isDarkMode ? styles.darkMode : ''}`}
                style={{ width: progressAmount > 0 ? `${progressAmount}%` : '0%' }}
            >
                {progressAmount > 0 ? `${progressAmount}%` : null}
            </div>
        </div>
    );
}
