import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import Roller from '../../components/Roller/Roller';
import ResponseError, { IErrorMessage } from '../../components/ErrorMessage/ResponseError';
import Editor from '../../components/Editor/Editor';
import DocumentationExplorer from '../../components/DocumentationExplorer/DocumentationExplorer';
import { validateJSON } from '../../utils/utils';

import iconUnfold from '../../assets/images/icon-unfold.svg';
import iconFold from '../../assets/images/icon-fold.svg';
import iconPlayArrow from '../../assets/images/icon-play-arrow.svg';
import iconDocumentation from '../../assets/images/icon-documentation.svg';
import styles from './PlaygroundPage.module.scss';

const PlaygroundPage = () => {
  const [trigger, { data, error, isError, isFetching, isLoading }] = useLazyFetchResultQuery();
  const [docIsOpen, setDocIsOpen] = useState(false);
  const [varsIsOpen, setVarsIsOpen] = useState(true);
  const [responseValue, setResponseValue] = useState(``);
  const [responseErrors, setResponseErrors] = useState<IErrorMessage | null>(null);

  const queryValueRef = useRef(localStorage.getItem('gql-query') || '');
  const variablesValueRef = useRef(localStorage.getItem('gql-variables') || '');

  const updateQueryValue = (value: string) => {
    queryValueRef.current = value;
  };
  const updateVariablesValue = (value: string) => {
    variablesValueRef.current = value;
  };

  const handleRun = () => {
    const queryValue = queryValueRef.current;
    const variablesValue = variablesValueRef.current;
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
  const toggleDocumentation = () => {
    setDocIsOpen(!docIsOpen);
  };
  const toggleVariables = () => {
    setVarsIsOpen(!varsIsOpen);
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

  useEffect(() => {
    return () => {
      localStorage.setItem('gql-query', queryValueRef.current);
      localStorage.setItem('gql-variables', variablesValueRef.current);
    };
  }, []);
  return (
    <div className={styles.playgroundPage}>
      <div
        className={cn(styles.documentationWrapper, {
          [styles.documentationWrapperShow]: docIsOpen,
        })}
      >
        <DocumentationExplorer isOpened={docIsOpen} closeHandle={toggleDocumentation} />
      </div>

      <section className={cn(styles.request, { [styles.requestVarsOpened]: varsIsOpen })}>
        <label className={styles.label}>Query</label>

        <div className={styles.requestQuery}>
          <Editor value={queryValueRef.current} type="graphql" handleChange={updateQueryValue} />
          <div className={styles.controls}>
            <button className={styles.button} onClick={handleRun}>
              <img className={styles.buttonIcon} src={iconPlayArrow} />
              <span className={styles.tooltip}>Execute query</span>
            </button>
            <button className={styles.button} onClick={toggleDocumentation}>
              <img className={styles.buttonIcon} src={iconDocumentation} />
              <span className={styles.tooltip}>Show documentation explorer</span>
            </button>
          </div>
        </div>

        <label className={styles.label} onClick={toggleVariables}>
          Variables
          <img className={styles.foldIcon} src={varsIsOpen ? iconUnfold : iconFold} alt="" />
        </label>

        <div className={cn(styles.requestVariables, { [styles.varsClosed]: !varsIsOpen })}>
          <Editor
            value={variablesValueRef.current}
            type="json"
            handleChange={updateVariablesValue}
          />
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
