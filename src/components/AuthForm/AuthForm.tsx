import React from 'react';
import { Link } from 'react-router-dom';

import styles from './AuthForm.module.scss';
import { useForm, FieldValues } from 'react-hook-form';
import { mapErrors } from '../../firebase';
import Roller from '../Roller/Roller';

export enum AuthType {
  login,
  register,
}

export default function SignUpPage({
  authType,
  handleLogin,
  error,
  isLoading,
}: {
  authType: AuthType;
  handleLogin: (email: string, password: string) => void;
  error: string | null;
  isLoading: boolean;
}) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    handleLogin(data.email, data.password);
  };

  const getErrorMessage = () => {
    const result =
      errors.email?.message ||
      errors.password?.message ||
      errors.confirmPassword?.message ||
      (error && mapErrors(error));
    if (result) return '\u26A0 ' + result;
    return '';
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>{authType == AuthType.login ? 'Sign In' : 'Sign Up'}</h2>
        <div>
          <input
            type="text"
            placeholder="E-mail"
            className={styles.emailInput}
            {...register('email', {
              required: 'Enter an e-mail',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Enter a valid e-mail',
              },
            })}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Enter a password',
              validate:
                authType === AuthType.register
                  ? {
                      is8Symbols: (pas) =>
                        /.{8,}/.test(pas) || 'Password must be at least 8 symbols',
                      is1Letter: (pas) =>
                        /(?=.*?[A-Z])|(?=.*?[a-z])/.test(pas) ||
                        'Pasword must contain at least 1 letter',
                      is1Digit: (pas) =>
                        /(?=.*?[0-9])/.test(pas) || 'Password must contain at least 1 digit',
                      is1SpecialCharacter: (pas) =>
                        /(?=.*?[#?!@$%^&*-])/.test(pas) ||
                        'Password must contain at least 1 special chatacter',
                    }
                  : {},
            })}
          />
        </div>
        {authType == AuthType.register && (
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword', {
                validate: {
                  isEqual: (pas) => pas === watch('password') || 'Passwords must be the same',
                },
              })}
            />
          </div>
        )}
        <div className={styles.validationError}>{getErrorMessage()}</div>
        <div className={styles.accountLink}>
          {authType == AuthType.login ? (
            <>
              Don&apos;t have the account?&nbsp;<Link to="/signup">Create an account</Link>
            </>
          ) : (
            <>
              Already have an account?&nbsp;<Link to="/signin">Sign in</Link>
            </>
          )}
        </div>
        <button className={styles.submit} type="submit">
          {isLoading ? (
            <Roller scale={0.5} x={-10} y={-7} />
          ) : authType == AuthType.login ? (
            'Sign In'
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
}
