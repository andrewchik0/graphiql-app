import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.scss';

const Layout = () => {
  return (
    <main className={styles.main}>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
