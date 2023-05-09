import React from 'react';

import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={`${styles.footer} ${styles.row}`}>
      <div className={styles.col4}>
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
          <div className={styles.name}>VasilevAndreiAV6</div>
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
          <div className={styles.name}>Biarslan</div>
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
          <div className={styles.name}>kovalevn89</div>
        </a>
      </div>
      <h3 className={`${styles.col2} ${styles.year}`}>2023&nbsp;&#169;</h3>
      <div className={`${styles.col4} ${styles.rsLogoCol}`}>
        <div className={styles.rsLogo}>
          <a href="https://rs.school/react/" target="_blank" rel="noreferrer">
            <img src="https://rs.school/images/rs_school_js.svg" height={50} />
          </a>
        </div>
      </div>
    </div>
  );
}
