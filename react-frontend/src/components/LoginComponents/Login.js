import axios from 'axios';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/LoginComponentStyles/Login.module.css'; // Import css modules stylesheet as styles

const preloadJournalBg = require('../../resources/journalBackground3.png');

const Login = ({ usernameValue, passwordValue, onUsernameChange, onPasswordChange,
    onValidUser, onLoadingUser, onLoginError }) => {

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const validateForm = (e) => {
        
        // Builds error message if error
        let error = null, focusRef = null;
        if (usernameValue === "") {
            error = "Please enter your username.";
            focusRef = usernameRef;
        }
        if (passwordValue === "") {
            error = (error) ? 
                error.substring(0, error.length - 1) + " and password." : "Please enter your password.";
            if (!focusRef) focusRef = passwordRef;
        }

        if (error) {
            alert(error);
            focusRef.current.focus();
            e.preventDefault();
        } else {
            onLoadingUser();

            axios.get(`/api/users?username=${usernameValue}&password=${passwordValue}`).then(response => {
                onValidUser(response.data._embedded.userList[0]);
            }).catch((error) => {
                if (String(error.response.data).startsWith('Proxy error')) {
                    onLoginError('The backend is not running.');
                } else {
                    onLoginError(error.response.data);
                }
            });
        }
    }

    return (
        <div className={`${styles.flexCenter} ${styles.body}`}>
            <div className={styles.title}>thoughtweb</div>
            <div id={styles.journal} />
            <div>
                <form className={styles.form}>
                    <div className={styles.inputRow}>
                        <label className={styles.label + " " + styles.textAlignCenter}> 
                            &nbsp;Journal Belongs To:&nbsp; 
                        </label><br />
                        <input 
                            type="text" 
                            id="Username" 
                            className={styles.textAlignCenter}
                            placeholder="Username"
                            ref={usernameRef}
                            value={usernameValue || ''}
                            onChange={onUsernameChange || null} 
                        />
                    </div>
                    <div className={styles.inputRow}>
                        <label className={styles.label + " " + styles.textAlignCenter}> 
                            &nbsp;Password:&nbsp; 
                        </label><br />
                        <input 
                            type="password" 
                            id="Password" 
                            className={styles.textAlignCenter}
                            placeholder="Password"
                            ref={passwordRef} 
                            value={passwordValue || ''}
                            onChange={onPasswordChange || null}
                            onKeyDown={(e) => {if (e.key === 'Enter') validateForm(e)}}
                        />
                    </div>
                    <div className={styles.submitContainer}>
                        <input 
                            type="button" 
                            className="button"
                            id="login" 
                            value="Login"
                            onClick={validateForm}
                        />
                    </div>
                </form>
                <div className={styles.linksContainer}>
					<Link className={styles.link} to="createAccount">Create Account</Link>
                    <Link className={styles.link}  to="forgotPassword">Forgot Password</Link>
                </div>
            </div>
            <img style={{display: 'none'}} src={preloadJournalBg} alt='background'/>
        </div>
    );
}

export default Login;