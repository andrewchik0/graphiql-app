import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/redux';
import { userSlice } from '../../store/slices/userSlice';
import styles from './Header.module.scss';

export default function Header() {
  const navigate = useNavigate();
  const user = useAuth();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

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
      <div className={`${isIntersecting ? styles.header : styles.fixedHeader} ${styles.row}`}>
        <div className={styles.col8}>
          <Link to="/" className={styles.headerText}>
            GraphiQL App
          </Link>
        </div>
        <div className={`${styles.col2} ${styles.textLeft}`}>
          {user.isAuth ? (
            <>
              <button
                className={`${styles.authLink} ${styles.greenbtn}`}
                onClick={() => navigate('/')}
              >
                Go to Playground
              </button>
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
