import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import { isValidJSON } from '../../utils/utils';
import Roller from '../../components/Roller/Roller';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { playgroundSlice } from '../../store/slices/playgroundSlice';

import styles from './PlaygroundPage.module.scss';

const PlaygroundPage = () => {
  const [trigger, { data, error, isError, isFetching }] = useLazyFetchResultQuery();
  const storedPlaygroundValues = useAppSelector((store) => store.playgroundSlice);
  const dispatch = useAppDispatch();
  const [variablesValue, setVariablesValue] = useState(storedPlaygroundValues.variables || '');
  const [queryValue, setQueryValue] = useState(storedPlaygroundValues.query || '');
  const [responseValue, setResponseValue] = useState(``);
  const [isVariablesValid, setIsVariablesValid] = useState(true);
  const handleRun = () => {
    const haveVariables = variablesValue.trim().length > 1;
    if (!haveVariables || isValidJSON(variablesValue)) {
      setIsVariablesValid(true);
      trigger(
        {
          queryString: queryValue,
          variables: haveVariables ? JSON.parse(variablesValue) : {},
        },
        true
      );
    } else {
      setResponseValue(`Variables JSON is not valid`);
      setIsVariablesValid(false);
    }
  };

  const handleVariablesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVariablesValue(e.target.value);
  };
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQueryValue(e.target.value);
  };

  useEffect(() => {
    if (!isFetching) {
      setResponseValue(
        JSON.stringify(
          isError && error !== undefined ? ('data' in error ? error.data : error) : data,
          null,
          2
        )
      );
    }
  }, [isError, isFetching, error, data]);

  const onUnmount = useRef<() => void>();
  onUnmount.current = () => {
    dispatch(
      playgroundSlice.actions.setPlaygroundValues({
        variables: variablesValue,
        query: queryValue,
      })
    );
  };
  useEffect(() => {
    return () => {
      if (onUnmount.current) onUnmount.current();
    };
  }, []);

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
            <pre className={cn(styles.responseJson, { [styles.errorText]: !isVariablesValid })}>
              {responseValue}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
