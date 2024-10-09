import DarkModeButton from '../components/DarkModeButton/DarkModeButton';
import { useSelector } from 'react-redux';

export default function Settings() {
    const isDarkMode = useSelector((state) => state.theme.darkMode);

    return (
        <>
            <div className={`${isDarkMode ? 'DarkSettings-header' : ''}`}>
                <h2>Settings</h2>
                <div className={`${isDarkMode ? 'settings-darkMode' : ''}`}></div>
                <div>
                    <DarkModeButton />
                </div>
            </div>
        </>
    );
}