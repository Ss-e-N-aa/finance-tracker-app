import { createContext, useState, useEffect } from 'react';
import { auth, db, setDoc, doc, getDoc } from '../../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile, onAuthStateChanged } from "firebase/auth";
import { fetchAndSetUserData } from '../utils/util'

// this context is for authentication
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
    const [loading, setLoading] = useState(false);
    const [userState, setUserState] = useState({ name: '', email: '', password: '' });
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

    useEffect(() => {
        const validPaths = ['/', '/signup', '/dashboard', '/dashboard/overview'];
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Always fetch and set userData if the user is logged in
                await fetchAndSetUserData(user.uid, setUserData);

                if (validPaths.includes(location.pathname)) {
                    navigate("/dashboard/overview");
                }
            } else {
                setUserData(null);

                // Allow user to stay on /signup if they are not logged in
                if (location.pathname !== '/signup') {
                    navigate("/");
                }
            }
        });

        return () => unsubscribe();
    }, [navigate]);


    // create user document in firestore 
    async function createUserDocument(user) {
        setLoading(true);
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            const name = user.displayName
            const email = user.email
            const createdAt = new Date();

            console.log("Document Data:", { name, email, createdAt }); // Debug: Check data before writing to Firestore

            try {
                await setDoc(userRef, { name, email, createdAt });
                await fetchAndSetUserData(user.uid, setUserData);
                setLoading(false)
            } catch (error) {
                toast.error("Error creating user document: " + error.message);
                console.error("Error creating user document: ", error.message);
                setLoading(false)
            }
        } else {
            console.error('User document already exists.');
            setLoading(false)
        }
    }

    async function emailLogin(e) {
        setLoading(true);
        e.preventDefault();

        try {
            const result = await signInWithEmailAndPassword(userState.email, userState.password);
            const user = result.user;
            // fetch and set user data
            await fetchAndSetUserData(user.uid, setUserData);

            navigate("/dashboard/overview");
            toast.success("Sign in successful");
            setLoading(false);
        } catch (error) {
            console.error(error.message);
            toast.error('Invalid Email or Password');
            setLoading(false);
        }
    }

    async function emailSignup(e) {
        setLoading(true);
        e.preventDefault();
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                userState.email,
                userState.password
            );

            const user = result.user;
            await updateProfile(user, {
                displayName: userState.name
            });

            console.log("User Created:", user); // Debug: Check created user
            await createUserDocument(user);

            navigate("/dashboard/overview");
            toast.success("Sign Up successful");
            setLoading(false);
        } catch (error) {
            toast.error('Unable to signup');
            console.error("Error signing up with email and password: ", error.message);
            setLoading(false);
        }
    }

    async function signWithGoogle(auth, provider) {
        setLoading(true);

        try {
            await signInWithPopup(auth, provider)
                .then(async (result) => {
                    await createUserDocument(result.user);
                    toast.success("User Authenticated Successfully!");
                    navigate("/dashboard/overview");
                })
                .catch((error) => {
                    if (error.code === 'auth/popup-closed-by-user') {
                        console.log(error);
                        toast.error("Google sign-in was canceled by user.");
                        setLoading(false);
                    } else {
                        toast.error(error.message);
                        setLoading(false);
                    }
                });
        } catch (error) {
            console.error("Error signing in with Google: ", error.message);
        }
    }


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
        loading,
        setLoading,
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
