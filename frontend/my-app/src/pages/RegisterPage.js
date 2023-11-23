import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import FormButton from "./../components/Form Elements/FormButton"
import { register } from '../services/authService';

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== repassword) {
        alert('Passwords do not match');
        return;
      }
      const response = await register(email, username, password);
      console.log('Registration response:', response);
      alert('User registered successfully');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        // Access the `message` property from the error object
        alert(error.response.data.message);
      } else {
        alert(`An error occurred during registration: ${error.message}`);
      }
    }
    
    
  };
  

  return (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <h2 className={styles.signInHeader}>Create Account</h2>
            <form action='/register' method='POST' onSubmit={handleSubmit} className={styles.form}>
                <h6 className={styles.formText}>E-mail</h6>
                <input
                type="email"
                value={email}
                name="name"
                onChange={(e) => setEmail(e.target.value)}
                className={styles.styledInput}
                />
                <h6 className={styles.formText}>Username</h6>
                <input
                type="text"
                value={username}
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                className={styles.styledInput}
                />
                <h6 className={styles.formText}>Password</h6>
                <input
                type="password"
                value={password}
                name='password'
                onChange={(e) => setPassword(e.target.value)}
                className={styles.styledInput}
                />
                <h6 className={styles.formText}>Re-enter Password</h6>
                <input
                type="password"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
                className={styles.styledInput}
                />
                <FormButton text={"Register"} clickHandler={handleSubmit} backgroundColor="#FFD426"/>
                <hr className={styles.horizontalLine}/>
                <p className={styles.signInText}>Already have an account? <a href='/login'>Sign in.</a></p>
            </form>
        </div>
    </div>
  );
}

export default RegisterPage;
