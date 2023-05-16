import { useState, useEffect, useRef } from 'react';
import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import Roller from '../../components/Roller/Roller';
import ResponseError, { IErrorMessage } from '../../components/ErrorMessage/ResponseError';
import Editor from '../../components/Editor/Editor';
import DocumentationExplorer from '../../components/DocumentationExplorer/DocumentationExplorer';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { playgroundSlice } from '../../store/slices/playgroundSlice';
import { validateJSON } from '../../utils/utils';

import iconPlayArrow from '../../assets/images/icon-play-arrow.svg';
import iconDocumentation from '../../assets/images/icon-documentation.svg';
import styles from './PlaygroundPage.module.scss';

const PlaygroundPage = () => {
  const [trigger, { data, error, isError, isFetching, isLoading }] = useLazyFetchResultQuery();
  const storedPlaygroundValues = useAppSelector((store) => store.playgroundSlice);
  const dispatch = useAppDispatch();
  const [docIsOpen, setDocIsOpen] = useState(false);
  const [variablesValue, setVariablesValue] = useState(
    storedPlaygroundValues.variables || localStorage.getItem('gql-variables') || ''
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
  const toggleDocumentation = () => {
    setDocIsOpen(!docIsOpen);
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
      <div className={styles.documentationWrapper}>
        <DocumentationExplorer isOpened={docIsOpen} closeHandle={toggleDocumentation} />
      </div>

      <section className={styles.request}>
        <label className={styles.label}>Query</label>

        <div className={styles.requestQuery}>
          <Editor value={queryValue} handleChange={handleQueryChange} type="graphql" />
          <div className={styles.controls}>
            <button className={styles.button} onClick={handleRun}>
              <img src={iconPlayArrow} />
              <span className={styles.tooltip}>Execute query</span>
            </button>
            <button className={styles.button} onClick={toggleDocumentation}>
              <img src={iconDocumentation} />
              <span className={styles.tooltip}>Show documentation explorer</span>
            </button>
          </div>
        </div>

        <label className={styles.label}>Variables</label>

        <div className={styles.requestVariables}>
          <Editor value={variablesValue} handleChange={handleVariablesChange} type="json" />
        </div>
      </section>

      <section className={styles.response}>
        <label className={styles.label}>Response</label>
        <div className={styles.responseOutput}>
          {isFetching ? (
            <Roller scale={1} x={0} y={0} style={{ margin: 'auto' }} />
          ) : responseErrors ? (
            <ResponseError errors={responseErrors.errors} />
          ) : (
            <Editor value={responseValue} type="json" readOnly={true} />
          )}
        </div>
      </section>
    </div>
  );
};

export default PlaygroundPage;
