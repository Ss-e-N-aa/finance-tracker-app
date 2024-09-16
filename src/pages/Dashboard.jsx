import { useContext } from 'react';
import UserContext from '../context/userContext';
import Spinner from '../components/Spinner/Spinner'
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
    const { loading, userData } = useContext(UserContext);

    if (loading || !userData) {
        // Show spinner while loading / userData is not yet populated
        return <Spinner />;
    }

    return (
        <>
            <div className="layout-container">
                <Navbar />
                <Sidebar />
                <div className='layout-main'>
                    <Outlet />
                </div>
            </div>
        </>
    );
};
