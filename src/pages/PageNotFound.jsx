import { NavLink } from 'react-router-dom';

export default function PageNotFound() {
    return (
        <>
            <div className="page-not-found-container">
                <h2>Page not found.</h2>
                <NavLink to="/dashboard">Back</NavLink>
            </div>
        </>
    );
}
