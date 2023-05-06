import React from 'react';
import { Link } from 'react-router-dom'

import styles from './Authentication.module.scss';

export default function SignUpPage() {
  return (
    <div className={styles.form}>
      <div>
        <h2>Sign Up</h2>
        <div>
          <input name="email" type="text" placeholder='E-mail' className={styles.emailInput} />
        </div>
        <div>
          <input type="password" placeholder='Password'/>
        </div>
        <div>
          <input type="password" placeholder='Confirm Password'/>
        </div>
        <div className={styles.accountLink}>
          Already have an account? <Link to='/signin'>Sign in</Link>
        </div>
        <button className={styles.submit}>Sign Up</button>
      </div>
    </div>
  );
}