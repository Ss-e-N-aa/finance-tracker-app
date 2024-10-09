import { useDispatch, useSelector } from 'react-redux';
import { themeActions } from '../../store/theme-slice';
import styles from './DarkModeButton.module.css'
import { useEffect } from 'react';

const DarkModeButton = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.darkMode); // default value is false

    const handleToggle = () => {
        dispatch(themeActions.setDarkMode(!isDarkMode));
    };

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    return (
        <>
            <div className={styles.buttonContainer} >
                <p id={`${isDarkMode ? styles.darkMode : ''}`}>
                    Theme toggle:
                </p>
                <button className={styles.themeBtn} onClick={handleToggle}>
                    {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                </button>
            </div>
        </>
    );
};

export default DarkModeButton;
