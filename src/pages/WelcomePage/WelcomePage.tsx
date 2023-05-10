import { useEffect, useState } from 'react';
import styles from './WelcomePage.module.scss';

function WelcomePage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sectionRatios, setSectionRatios] = useState<number[]>([]);
  const sectionHeights = [
    window.innerHeight,
    window.innerHeight * 3.5,
    window.innerHeight * 2,
    window.innerHeight * 2,
  ];

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const getRsDescTransform = () => {
    if (sectionRatios[1] < 0) {
      return `translateX(${-sectionRatios[1] * 2000}px)`;
    }
    if (sectionRatios[1] > 0.4) {
      return `translateX(${(sectionRatios[1] - 0.4) * 2000}px)`;
    }
  };

  const getCircleTransform = () => {
    return `scale(${sectionRatios[0] * 50 + 5})`;
  };

  const getRsScreenshotTransform = () => {
    if (sectionRatios[1] > 0.4) {
      return `translateX(${-(sectionRatios[1] - 0.4) * 2000}px)`;
    }
  };

  return (
    <>
      <div className={styles.welcome}>
        <div className={`${styles.team}`} style={{ height: sectionHeights[0] + 'px' }}>
          <div className={styles.teamDesc}>
            We are a team of student developers at the{' '}
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
          <div className={`${styles.sticky}`}>
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
              <span className={styles.coloredSpan}>RS School</span> is a free-of-charge and
              community-based <span className={styles.coloredSpan}>education program</span>{' '}
              conducted by The Rolling Scopes developer community since 2013.
            </div>
          </div>
        </div>
        <div
          className={styles.afterRs}
          style={{
            height: sectionHeights[2] + 'px',
          }}
        >
          <div className={`${styles.sticky} ${styles.present}`}>
            We present our <span className={styles.coloredSpan}>GraphiQL App</span>.
          </div>
        </div>
        <div
          style={{
            height: sectionHeights[3] + 'px',
          }}
        >
          <div className={`${styles.sticky} ${styles.present} ${styles.footerOnWelcomePage}`}>
            You can <span className={styles.coloredSpan}>edit queries</span>, headers, variables and
            get response from <span className={styles.coloredSpan}>GraphQL API</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default WelcomePage;
