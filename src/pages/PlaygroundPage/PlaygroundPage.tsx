import { useState } from 'react';
import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import { isValidJSON } from '../../utils/utils';
import Roller from '../../components/Roller/Roller';

import styles from './PlaygroundPage.module.scss';

const PlaygroundPage = () => {
  const [trigger, { data, error, isError, isFetching }] = useLazyFetchResultQuery();

  const [variablesValue, setVariablesValue] = useState(``);
  const [queryValue, setQueryValue] = useState(``);
  const [isVariablesValid, setIsVariablesValid] = useState(true);

  const handleRun = () => {
    const haveVariables = variablesValue.trim().length > 1;

    if (!haveVariables || isValidJSON(variablesValue)) {
      setIsVariablesValid(true);
      trigger({
        queryString: queryValue,
        variables: haveVariables ? JSON.parse(variablesValue) : {},
      });
    } else {
      setIsVariablesValid(false);
    }
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
          {!isVariablesValid && (
            <span className={styles.errorText}>Variables JSON is not valid</span>
          )}

          {isFetching ? (
            <Roller scale={1} x={0} y={0} style={{ margin: 'auto' }} />
          ) : (
            <pre className={styles.responseJson}>
              {JSON.stringify(
                isError && error !== undefined ? ('data' in error ? error.data : error) : data,
                null,
                2
              )}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
