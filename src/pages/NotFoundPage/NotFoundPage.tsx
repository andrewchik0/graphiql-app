import styles from './NotFoundPage.module.scss';

function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundText}>404. Not found.</div>
    </div>
  );
}

export default NotFoundPage;
