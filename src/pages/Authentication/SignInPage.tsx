import React from 'react';
import { Link } from 'react-router-dom'

import styles from './Authentication.module.scss';

export default function SignInPage() {
  return (
    <div className={styles.form}>
      <div>
        <h2 className={styles.authHeader}>Sign In</h2>
        <div>
          <input name="email" type="text" placeholder='E-mail' className={styles.emailInput} />
        </div>
        <div>
          <input type="password" placeholder='Password'/>
        </div>
        <div className={styles.accountLink}>
          Don't have the account?&nbsp;<Link to='/signup'>Create an account</Link>
        </div>
        <button className={styles.submit}>Sign In</button>
      </div>
    </div>
  );
}