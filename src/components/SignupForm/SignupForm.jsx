import { FcGoogle } from "react-icons/fc";
import { useContext } from "react"
import { NavLink } from "react-router-dom";
import styles from './SignupForm.module.css';
import { auth, provider, } from "../../../firebase";
import { handleInputChange } from "../../utils/util";
import UserContext from "../../context/userContext";


export default function SignupForm() {
    const { loading, emailSignup, signWithGoogle, userState, setUserState } = useContext(UserContext);

    function onChange(e) {
        handleInputChange(e, setUserState, userState);
    };

    function handleGoogleSignIn() {
        signWithGoogle(auth, provider);
    };

    return (
        <>
            <section className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.text}>
                        Sign Up
                    </div>
                    <div className={styles.underline}></div>
                </div>
                <form>
                    <div className={styles.inputs}>
                        <div className={styles.input}>
                            <input
                                value={userState.name}
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={onChange}
                            />
                        </div>

                        <div className={styles.input}>
                            <input
                                value={userState.email}
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={onChange}
                            />
                        </div>

                        <div className={styles.input}>
                            <input
                                value={userState.password}
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={onChange}
                            />
                        </div>
                    </div>
                    <div className={styles.createAcc}>
                        Already have an account? <span><NavLink to="/">Sign in here</NavLink></span>
                    </div>
                    <div className={styles.submitContainer}>
                        <button type="submit" className={styles.button} onClick={emailSignup} disabled={loading}>
                            {loading ? 'Loading...' : 'Signup with Email and password'}
                        </button>
                    </div>
                    <p style={{ textAlign: "center" }}>or</p>
                    <div className={styles.submitContainer}>
                        <button type="submit" className={styles.googleButton} onClick={handleGoogleSignIn} disabled={loading} >
                            {loading ? 'Loading...' : (
                                <>
                                    <span className={styles.iconGoogle}><FcGoogle /></span>
                                    Continue with Google
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}
