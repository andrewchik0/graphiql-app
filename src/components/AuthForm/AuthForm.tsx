import React from 'react';
import { Link } from 'react-router-dom'

import styles from './AuthForm.module.scss';

export enum AuthType {
  login,
  register,
}

export default function SignUpPage({ authType, handleSubmit }: { authType: AuthType, handleSubmit: () => void}) {
  return (
    <div className={styles.form}>
      <div>
        <h2>{authType == AuthType.login ? 'Sign In' : 'Sign Up'}</h2>
        <div>
          <input name="email" type="email" placeholder='E-mail' className={styles.emailInput} />
        </div>
        <div>
          <input type="password" placeholder='Password'/>
        </div>
        {authType == AuthType.register && <div>
          <input type="password" placeholder='Confirm Password'/>
        </div>}
        <div className={styles.accountLink}>
          {authType == AuthType.login ?
            <>Don't have the account?&nbsp;<Link to='/signup'>Create an account</Link></> :
            <>'Already have an account?'&nbsp;<Link to='/signin'>Sign in</Link></>}
        </div>
        <button className={styles.submit} onClick={handleSubmit}>{authType == AuthType.login ? 'Sign In' : 'Sign Up'}</button>
      </div>
    </div>
  );
}