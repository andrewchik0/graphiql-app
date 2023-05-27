import { useTranslation } from 'react-i18next';
import styles from './NotFoundPage.module.scss';

function NotFoundPage() {
  const { t } = useTranslation('notFound');
  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundText}>{t('title')}</div>
    </div>
  );
}

export default NotFoundPage;
