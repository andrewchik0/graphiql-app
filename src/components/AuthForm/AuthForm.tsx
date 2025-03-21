import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation('authform');

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
        <h2>{authType == AuthType.login ? t('signin') : t('signup')}</h2>
        <div>
          <input
            type="text"
            placeholder={t('form.placeholder.email')}
            className={styles.emailInput}
            {...register('email', {
              required: t('errors.enterEmail'),
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: t('errors.enterValidEmail'),
              },
            })}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder={t('form.placeholder.password')}
            className={styles.passwordInput}
            {...register('password', {
              required: t('errors.enterPassword'),
              validate:
                authType === AuthType.register
                  ? {
                      is8Symbols: (pas) => /.{8,}/.test(pas) || t('errors.passwordLength'),
                      is1Letter: (pas) =>
                        /(?=.*?[A-Z])|(?=.*?[a-z])/.test(pas) || t('errors.password1Letter'),
                      is1Digit: (pas) => /(?=.*?[0-9])/.test(pas) || t('errors.password1Digit'),
                      is1SpecialCharacter: (pas) =>
                        /(?=.*?[#?!@$%^&*-])/.test(pas) || t('errors.password1Special'),
                    }
                  : {},
            })}
          />
        </div>
        {authType == AuthType.register && (
          <div>
            <input
              type="password"
              placeholder={t('form.placeholder.confirmPassword')}
              className={styles.passwordInput}
              {...register('confirmPassword', {
                validate: {
                  isEqual: (pas) => pas === watch('password') || t('errors.passwordSame'),
                },
              })}
            />
          </div>
        )}
        <div className={styles.validationError}>{getErrorMessage()}</div>
        <div className={styles.accountLink}>
          {authType == AuthType.login ? (
            <>
              {t('noAccount')}&nbsp;<Link to="/signup">{t('createAccount')}</Link>
            </>
          ) : (
            <>
              {t('haveAccount')}&nbsp;<Link to="/signin">{t('signinVerb')}</Link>
            </>
          )}
        </div>
        <button className={styles.submit} type="submit">
          {isLoading ? (
            <Roller scale={0.5} x={-10} y={-7} />
          ) : authType == AuthType.login ? (
            t('button.signin')
          ) : (
            t('button.signup')
          )}
        </button>
      </form>
    </div>
  );
}
