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