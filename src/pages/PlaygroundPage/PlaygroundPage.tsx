import { useState, useEffect, useRef } from 'react';
import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import Roller from '../../components/Roller/Roller';
import ResponseError, { IErrorMessage } from '../../components/ErrorMessage/ResponseError';
import Editor from '../../components/Editor/Editor';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { playgroundSlice } from '../../store/slices/playgroundSlice';
import { validateJSON } from '../../utils/utils';
import styles from './PlaygroundPage.module.scss';

const PlaygroundPage = () => {
  const [trigger, { data, error, isError, isFetching, isLoading }] = useLazyFetchResultQuery();
  const storedPlaygroundValues = useAppSelector((store) => store.playgroundSlice);
  const dispatch = useAppDispatch();

  const [variablesValue, setVariablesValue] = useState(
    storedPlaygroundValues.variables || localStorage.getItem('variables') || ''
  );
  const [queryValue, setQueryValue] = useState(
    storedPlaygroundValues.query || localStorage.getItem('gql-query') || ''
  );
  const [responseValue, setResponseValue] = useState(``);
  const [responseErrors, setResponseErrors] = useState<IErrorMessage | null>(null);
  const handleRun = () => {
    setResponseErrors(null);
    const { jsonData, isValidJSON } = validateJSON(variablesValue);
    if (isValidJSON) {
      trigger(
        {
          queryString: queryValue,
          variables: jsonData,
        },
        true
      );
    } else {
      setResponseErrors(jsonData);
    }
  };

  const handleVariablesChange = (value: string) => {
    setVariablesValue(value);
  };
  const handleQueryChange = (value: string) => {
    setQueryValue(value);
  };

  useEffect(() => {
    if (!isFetching && !isLoading) {
      if (data?.errors) {
        setResponseErrors(data);
        return;
      } else if (isError && error !== undefined) {
        const errors =
          'data' in error
            ? (error.data as IErrorMessage).errors
            : [new Error(JSON.stringify(error))];
        setResponseErrors({ errors });
        return;
      }
      setResponseValue(JSON.stringify(data, null, 2));
    }
  }, [isError, isFetching, error, data, isLoading]);

  const onUnmount = useRef<() => void>();
  onUnmount.current = () => {
    localStorage.setItem('gql-query', queryValue);
    localStorage.setItem('gql-variables', variablesValue);
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
          <Editor value={queryValue} handleChange={handleQueryChange} type="graphql" />
        </section>

        <label>Variables</label>

        <section className={styles.requestVariables}>
          <Editor value={variablesValue} handleChange={handleVariablesChange} type="json" />
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
          ) : responseErrors ? (
            <ResponseError errors={responseErrors.errors} />
          ) : (
            <Editor value={responseValue} type="json" readOnly={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
