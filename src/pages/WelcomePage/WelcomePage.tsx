import { useEffect, useState } from 'react';
import styles from './WelcomePage.module.scss';
import { Trans, useTranslation } from 'react-i18next';

function WelcomePage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sectionRatios, setSectionRatios] = useState<number[]>([]);
  const [isAnimate, setIsAnimate] = useState(window.innerWidth > 1200);
  const { t } = useTranslation('welcomePage');
  const sectionHeights = [
    window.innerHeight,
    window.innerHeight * 3.5,
    window.innerHeight * 2,
    window.innerHeight * 2,
  ];

  if (!isAnimate) {
    for (let i = 0; i < sectionHeights.length; i++) {
      sectionHeights[i] = window.innerHeight;
    }
    sectionHeights[1] = window.innerHeight * 2;
  }

  const handleScroll = () => {
    setScrollPosition(window.pageYOffset);

    const newRatios = [...sectionRatios];
    for (let i = 0; i < sectionHeights.length; i++) {
      let heightToSubstract = 0;

      for (let j = 0; j < i; j++) {
        heightToSubstract += sectionHeights[j];
      }
      newRatios[i] = (scrollPosition - heightToSubstract) / sectionHeights[i];
    }
    setSectionRatios(newRatios);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => setIsAnimate(window.innerWidth > 1200));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', () => setIsAnimate(window.innerWidth > 1200));
    };
  });

  const getRsDescTransform = () => {
    if (!isAnimate) {
      return '';
    }
    if (sectionRatios[1] < 0) {
      return `translateX(${-sectionRatios[1] * 2000}px)`;
    }
    if (sectionRatios[1] > 0.4) {
      return `translateX(${(sectionRatios[1] - 0.4) * 2000}px)`;
    }
  };

  const getCircleTransform = () => {
    if (!isAnimate) {
      return '';
    }
    return `scale(${sectionRatios[0] * 50 + 5})`;
  };

  const getRsScreenshotTransform = () => {
    if (!isAnimate) {
      return '';
    }
    if (sectionRatios[1] > 0.4) {
      return `translateX(${-(sectionRatios[1] - 0.4) * 2000}px)`;
    }
  };

  return (
    <>
      <div className={styles.welcome}>
        <div className={`${styles.team}`} style={{ height: sectionHeights[0] + 'px' }}>
          <div className={styles.teamDesc}>
            {t('teamDesc')}{' '}
            <a href="https://rs.school/index.html" target="_blank" rel="noreferrer">
              <img src="./external-link.svg" className={styles.logo} />
              RS School.
            </a>
            <div className={styles.circle1} style={{ transform: getCircleTransform() }}>
              <div className={styles.circle2}>
                <div className={styles.circle3}></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.row} ${styles.rs}`}
          style={{
            height: sectionHeights[1] + 'px',
          }}
        >
          <div className={`${styles.sticky} ${styles.flex}`}>
            <div
              className={`${styles.col5} ${styles.screenshotCol}`}
              style={{ transform: getRsScreenshotTransform() }}
            >
              <div className={styles.rsscreenshot} />
            </div>
            <div
              className={`${styles.col5} ${styles.rsdesc}`}
              style={{ transform: getRsDescTransform() }}
            >
              <Trans i18nKey="rsDesc" t={t}>
                <span className={styles.coloredSpan}></span>
                <span className={styles.coloredSpan}></span>
              </Trans>
            </div>
          </div>
        </div>
        <div
          className={styles.afterRs}
          style={{
            height: sectionHeights[2] + 'px',
          }}
        >
          <div className={`${styles.sticky} ${styles.present} ${styles.footerOnWelcomePage}`}>
            {t('appTitle')} <span className={styles.coloredSpan}>GraphiQL App</span>.
            <div className={styles.images}>
              <div className={styles.appScreenshot} />
              <div className={styles.responseImage} />
              <img src="/images/app.png" alt="" className={styles.appimg} />
              <img src="/images/response.png" alt="" className={styles.responseimg} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WelcomePage;
