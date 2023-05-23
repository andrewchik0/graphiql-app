import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.scss';
import Roller from '../Roller/Roller';
import { Suspense } from 'react';

const Layout = () => {
  return (
    <main className={styles.main}>
      <Suspense fallback={<Roller x={0} y={0} scale={1} style={{ margin: 'auto' }} />}>
        <Header />
        <Outlet />
        <Footer />
      </Suspense>
    </main>
  );
};

export default Layout;
