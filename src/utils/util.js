import { db, getDoc, doc } from '../../firebase';
import { toast } from 'react-toastify';

export function handleInputChange(e, setStateFunction, currentState) {
    setStateFunction({
        ...currentState,
        [e.target.name]: e.target.value
    });
};

// Fetches user data from Firestore and sets it in the provided state 
export async function fetchAndSetUserData(uid, setUserData) {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            setUserData(userDoc.data());
        } else {
            console.error("No such document!");
        }
    } catch (error) {
        toast.error("Error fetching user data: " + error.message);
        console.error("Error fetching user data: ", error.message);
    }
}

// Utility function to convert Firestore timestamp to readable date
export const formatFirestoreDate = (timestamp) => {
    let date;

    // Check if the timestamp is an instance of Firestore Timestamp
    if (timestamp && typeof timestamp.toMillis === 'function') {
        date = new Date(timestamp.toMillis());
    } else if (timestamp instanceof Date) {
        date = timestamp; // Already a Date object
    } else {
        return '';
    }

    return date.toLocaleString();
}