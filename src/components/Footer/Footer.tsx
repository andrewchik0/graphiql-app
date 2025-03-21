import logoRSSchool from '../../assets/images/logo-rs-school.svg';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a href="https://rs.school/react/" target="_blank" rel="noreferrer">
        <img src={logoRSSchool} className={styles.rsLogo} />
      </a>
      <div className={styles.authors}>
        <a
          href="https://github.com/VasilevAndreiAV6"
          className={styles.author}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://avatars.githubusercontent.com/u/68250467?v=4"
            className={styles.avatar}
          />
          VasilevAndreiAV6
        </a>
        <a
          href="https://github.com/Biarslan"
          className={styles.author}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://avatars.githubusercontent.com/u/27864304?v=4"
            className={styles.avatar}
          />
          Biarslan
        </a>
        <a
          href="https://github.com/kovalevn89"
          className={styles.author}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://avatars.githubusercontent.com/u/106650356?v=4"
            className={styles.avatar}
          />
          kovalevn89
        </a>
      </div>
      <h3 className={styles.year}>2023</h3>
    </footer>
  );
}
