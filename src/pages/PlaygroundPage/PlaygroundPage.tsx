import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import { isValidJSON } from '../../utils/utils';
import Roller from '../../components/Roller/Roller';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { playgroundSlice } from '../../store/slices/playgroundSlice';

import styles from './PlaygroundPage.module.scss';
import Editor from '../../components/Editor/Editor';

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
      trigger({
        queryString: queryValue,
        variables: haveVariables ? JSON.parse(variablesValue) : {},
      });
    } else {
      setResponseValue(`Variables JSON is not valid`);
      setIsVariablesValid(false);
    }
  };

  const handleVariablesChange = (value: string) => {
    setVariablesValue(value);
  };
  const handleQueryChange = (value: string) => {
    setQueryValue(value);
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

        <section className={styles.requestQuery}>
          <Editor
            className={styles.requestQueryEditor}
            value={queryValue}
            handleChange={handleQueryChange}
            type="graphql"
          />
        </section>

        <label>Variables</label>

        <section className={styles.requestVariables}>
          <Editor
            className={styles.requestVariablesEditor}
            value={variablesValue}
            handleChange={handleVariablesChange}
            type="json"
          />
        </section>
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
