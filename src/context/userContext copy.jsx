import { createContext, useState } from 'react';
import { auth, db, setDoc, doc, getDoc } from '../../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { fetchAndSetUserData } from '../utils/util'

export const UserContext = createContext({
    userState: {
        name: '',
        email: '',
        password: ''
    },
    userData: null,
    emailSignup: () => { },
    emailLogin: () => { },
    googleLogin: () => { },
    logout: () => { },
    signWithGoogle: () => { },
});

export function UserContextProvider({ children }) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [userState, setUserState] = useState({ name: '', email: '', password: '' });
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

    // create user document in firestore 
    async function createUserDocument(user) {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            const name = user.displayName || '';    // Use displayName from user object
            const email = user.email || '';         // Use email from user object
            const createdAt = new Date();

            try {
                await setDoc(userRef, {
                    name,
                    email,
                    createdAt
                });

                // fetch and set userData , then use it in Header to display name
                await fetchAndSetUserData(user.uid, setUserData);

            } catch (error) {
                toast.error(error.message);;
            }
        } else {
            console.error('Document already exists.');
        }
    }

    async function emailLogin() {
        try {
            const result = await signInWithEmailAndPassword(userState.email, userState.password);
            const user = result.user;

            // fetch and set user data
            await fetchAndSetUserData(user.uid, setUserData);

            navigate('/dashboard');
            toast.success("Sign in successful");
        } catch (error) {
            console.error(error.message);
            toast.error('Invalid Email or Password');
        }
    }

    async function emailSignup() {
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                userState.email,
                userState.password
            );

            const user = result.user;
            await createUserDocument(user);

            await fetchAndSetUserData(user.uid, setUserData);

            navigate("/dashboard");
            toast.success("Sign Up successful");
        } catch (error) {
            console.error("Error signing up with email and password: ", error.message);
            toast.error('Unable to signup');
        }
    }

    async function signWithGoogle(auth, provider) {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await createUserDocument(user);

            toast.success("User Authenticated Successfully!");
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.message);
            console.error("Error signing in with Google: ", error.message);
        }
    };

    function logout() {
        try {
            auth.signOut();
            setUserData(null); // Clear user data on logout
            setUserState({ name: '', email: '', password: '' }) // to clear the form inputs
            navigate("/");
            toast.success("Logged out Successfully!");
        } catch (error) {
            toast.error(error.message);
            console.error("Error logging out: ", error.message);
        }
    }

    const userCtx = {
        userData,
        setUserData,
        userState,
        setUserState,
        emailLogin,
        emailSignup,
        logout,
        signWithGoogle,
    };

    return (
        <UserContext.Provider value={userCtx}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
