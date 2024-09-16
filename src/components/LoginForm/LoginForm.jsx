import { FcGoogle } from "react-icons/fc";
import { useContext } from "react"
import { NavLink } from "react-router-dom";
import styles from './LoginForm.module.css';
import { auth, provider } from "../../../firebase";
import { handleInputChange } from "../../utils/util";
import UserContext from "../../context/userContext";

export default function LoginForm() {
    const { loading, emailLogin, userState, setUserState, signWithGoogle } = useContext(UserContext)

    function onChange(e) {
        handleInputChange(e, setUserState, userState);
    };

    function handleGoogleLogin() {
        signWithGoogle(auth, provider);
    };

    return (
        <>
            <section className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.text}>
                        Login
                    </div>
                    <div className={styles.underline}></div>
                </div>
                <form>
                    <div className={styles.inputs}>
                        <div className={styles.input}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={userState.email}
                                onChange={onChange}
                            />
                        </div>

                        <div className={styles.input}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={userState.password}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                    <div className={styles.createAcc}>
                        <span><NavLink to="/signup">Create an account</NavLink></span>
                    </div>
                    <div className={styles.submitContainer}>
                        <button className={styles.button} onClick={emailLogin} disabled={loading}>
                            {loading ? 'Loading...' : 'Login with Email and Password'}
                        </button>
                    </div>
                    <p style={{ textAlign: "center" }}>or</p>
                    <div className={styles.submitContainer}>
                        <button className={styles.googleButton} onClick={handleGoogleLogin} disabled={loading}>
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
