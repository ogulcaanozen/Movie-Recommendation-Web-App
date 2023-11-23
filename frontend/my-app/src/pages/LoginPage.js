import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import FormButton from "./../components/Form Elements/FormButton";
import { login, verifyToken } from '../services/authService';
import { MyContext } from '../context/Context';
import Cookies from 'js-cookie';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      console.log('Login response:', response);
      if (response && response.token) {
        const { token } = response;
        Cookies.set('token', token, { expires: 0.5 }); // Expires in 12 hours
      } else {
        console.error('Token not found in the response');
      }
      setIsLoggedIn(true);
      alert('User logged in successfully');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };
  

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <h2 className={styles.signInHeader}>Sign In</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h5 className={styles.formText}>Username</h5>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                />
                <h5 className={styles.formText}>Password</h5>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                />
                <FormButton text={"Sign In"} clickHandler={handleSubmit} backgroundColor="#FFD426"/>
                <div class={styles.lineWithText}>
                  <span>Don't have an account?</span>
                </div>
                <FormButton text={"Register"} clickHandler={handleRegisterClick} backgroundColor="#EFE9E9"/>
            </form>
        </div>
      
      
    </div>
  );
}

export default LoginPage;
