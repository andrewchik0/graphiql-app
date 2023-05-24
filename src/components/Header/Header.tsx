import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/redux';
import { userSlice } from '../../store/slices/userSlice';
import styles from './Header.module.scss';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const isPlaygroundPage = location.pathname === '/playground';

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
      <div className={`${isIntersecting ? styles.header : styles.fixedHeader}`}>
        <div className={styles.mainHeader}>
          <Link to="/" className={styles.headerText}>
            GraphiQL&nbsp;App
          </Link>
        </div>
        <div className={`${styles.buttons} ${styles.textLeft}`}>
          {user.isAuth ? (
            <>
              {!isPlaygroundPage && (
                <button
                  className={`${styles.authLink} ${styles.greenbtn}`}
                  onClick={() => navigate('/playground')}
                >
                  Go to Playground
                </button>
              )}
              <button
                className={styles.signoutbtn}
                onClick={() => dispatch(userSlice.actions.removeAndLogOutUser())}
              >
                <img src="./logout.svg" className={styles.logoutLogo} />
                &nbsp;Sign Out
              </button>
            </>
          ) : (
            <>
              <button className={styles.authLink} onClick={() => navigate('/signin')}>
                Sign In
              </button>
              <button className={styles.authLink} onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
