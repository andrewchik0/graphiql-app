import { useState } from 'react';
import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import Roller from '../../components/Roller/Roller';

import styles from './PlaygroundPage.module.scss';

const PlaygroundPage = () => {
  const [trigger, { data, isFetching }] = useLazyFetchResultQuery();

  const [variablesValue, setVariablesValue] = useState(``);
  const [queryValue, setQueryValue] = useState(``);

  const handleRun = () => {
    trigger({ queryString: queryValue, variables: JSON.parse(variablesValue) });
  };

  const handleVariablesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVariablesValue(e.target.value);
  };
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQueryValue(e.target.value);
  };

  return (
    <div className={styles.playgroundPage}>
      <div className={styles.request}>
        <label>Query</label>
        <textarea
          className={styles.requestQuery}
          value={queryValue}
          onChange={handleQueryChange}
        ></textarea>
        <label>Variables</label>
        <textarea
          className={styles.requestVariables}
          value={variablesValue}
          onChange={handleVariablesChange}
        ></textarea>
        <button className={styles.requestButton} onClick={handleRun}>
          Run
        </button>
      </div>

      <div className={styles.response}>
        <label>Response</label>
        <div className={styles.responseOutput}>
          {isFetching ? (
            <Roller scale={1} x={0} y={0} style={{ margin: 'auto' }} />
          ) : (
            <pre className={styles.responseJson}>{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
