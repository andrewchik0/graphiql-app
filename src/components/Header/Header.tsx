import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import useAuth from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/redux';
import { userSlice } from '../../store/slices/userSlice';
import styles from './Header.module.scss';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const isPlaygroundPage = location.pathname === '/playground';
  const { t, i18n } = useTranslation('header');

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });
    observer.observe(ref.current as HTMLElement);

    return () => observer.disconnect();
  }, [isIntersecting]);

  return (
    <>
      <div ref={ref} className={styles.invisibleIntersect}></div>
      <div className={cn(styles.header, { [styles.headerFixed]: !isIntersecting })}>
        <Link to="/" className={styles.headerText}>
          GraphiQL&nbsp;App
        </Link>
        <div className={styles.buttons}>
          {user.isAuth ? (
            <>
              {!isPlaygroundPage && (
                <button
                  className={cn(styles.authLink, styles.greenbtn)}
                  onClick={() => navigate('/playground')}
                >
                  {t('playground')}
                </button>
              )}
              <button
                className={styles.signoutbtn}
                onClick={() => dispatch(userSlice.actions.removeAndLogOutUser())}
              >
                <img src="./logout.svg" className={styles.logoutLogo} />
                &nbsp;{t('signout')}
              </button>
            </>
          ) : (
            <>
              <button className={styles.authLink} onClick={() => navigate('/signin')}>
                {t('signin')}
              </button>
              <button className={styles.authLink} onClick={() => navigate('/signup')}>
                {t('signup')}
              </button>
            </>
          )}
          <select
            className={styles.language}
            onChange={changeLanguage}
            defaultValue={i18n.language}
          >
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>
        </div>
      </div>
    </>
  );
}
