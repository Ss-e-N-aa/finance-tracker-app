import { useContext } from 'react';
import UserContext from '../context/userContext';
import Spinner from '../components/Spinner/Spinner'

export default function Dashboard() {
    const { loading, userData } = useContext(UserContext);

    if (loading || !userData) {
        // Show spinner while loading / userData is not yet populated
        return <Spinner />;
    }

    // Capitalize the first letter of the user's name
    const capitalizedUserName = userData.name.charAt(0).toUpperCase() + userData.name.slice(1);

    return (
        <div>
            <h1>Welcome to your Dashboard, {capitalizedUserName}</h1>
        </div>
    );
};
