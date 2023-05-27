import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import Roller from '../../components/Roller/Roller';
import ResponseError, { IErrorMessage } from '../../components/ErrorMessage/ResponseError';
import Editor from '../../components/Editor/Editor';
import DocumentationExplorer from '../../components/DocumentationExplorer/DocumentationExplorer';
import { validateJSON } from '../../utils/utils';

import iconUnfold from '../../assets/images/icon-unfold.svg';
import iconPlayArrow from '../../assets/images/icon-play-arrow.svg';
import iconDocumentation from '../../assets/images/icon-documentation.svg';
import styles from './PlaygroundPage.module.scss';
import { useTranslation } from 'react-i18next';

const PlaygroundPage = () => {
  const { t } = useTranslation('playground');
  const [trigger, { data, error, isError, isFetching, isLoading }] = useLazyFetchResultQuery();
  const [docIsOpen, setDocIsOpen] = useState(false);
  const [toolsIsOpen, setToolsIsOpen] = useState(true);
  const [responseValue, setResponseValue] = useState(``);
  const [responseErrors, setResponseErrors] = useState<IErrorMessage | null>(null);
  const [currentTool, setCurrentTool] = useState<'variables' | 'headers'>('variables');

  const queryValueRef = useRef(localStorage.getItem('gql-query') || '');
  const variablesValueRef = useRef(localStorage.getItem('gql-variables') || '');
  const headersValueRef = useRef(localStorage.getItem('gql-headers') || '');

  const updateQueryValue = (value: string) => {
    localStorage.setItem('gql-query', value);
    queryValueRef.current = value;
  };
  const updateVariablesValue = (value: string) => {
    localStorage.setItem('gql-variables', value);
    variablesValueRef.current = value;
  };
  const updateHeadersValue = (value: string) => {
    headersValueRef.current = value;
    localStorage.setItem('gql-headers', value);
  };

  const handleRun = () => {
    const queryValue = queryValueRef.current;
    const variablesValue = variablesValueRef.current;
    const headersValue = headersValueRef.current;
    setResponseErrors(null);
    const { jsonData: variablesJSON, isValidJSON: isValidJSONVariables } = validateJSON(
      variablesValue,
      'Variables'
    );
    const { jsonData: headersJSON, isValidJSON: isValidJSONHeaders } = validateJSON(
      headersValue,
      'Headers'
    );

    if (isValidJSONVariables && isValidJSONHeaders) {
      trigger(
        {
          queryString: queryValue,
          variables: variablesJSON,
          headers: headersJSON,
        },
        true
      );
    } else {
      const errorList = isValidJSONVariables ? headersJSON : variablesJSON;
      setResponseErrors(errorList);
    }
  };
  const toggleDocumentation = () => {
    setDocIsOpen(!docIsOpen);
  };
  const toggleTools = () => {
    setToolsIsOpen(!toolsIsOpen);
  };

  const handleLabelClick = (target: 'variables' | 'headers') => {
    setCurrentTool(target);
    if (!toolsIsOpen) setToolsIsOpen(true);
  };

  useEffect(() => {
    if (!isFetching && !isLoading) {
      if (data?.errors) {
        setResponseErrors(data);
        return;
      } else if (isError && error !== undefined) {
        const errors =
          'data' in error && error.data
            ? (error.data as IErrorMessage).errors
            : [new Error(JSON.stringify(error))];
        setResponseErrors({ errors });
        return;
      }
      setResponseValue(JSON.stringify(data, null, 2));
    }
  }, [isError, isFetching, error, data, isLoading]);

  return (
    <div className={styles.playgroundPage}>
      <div
        className={cn(styles.documentationWrapper, {
          [styles.documentationWrapperShow]: docIsOpen,
        })}
      >
        <DocumentationExplorer isOpened={docIsOpen} closeHandle={toggleDocumentation} />
      </div>

      <section className={cn(styles.request, { [styles.requestVarsOpened]: toolsIsOpen })}>
        <label className={styles.label}>{t('label.query')}</label>

        <div className={styles.requestQuery}>
          <Editor value={queryValueRef.current} type="graphql" handleChange={updateQueryValue} />
          <div className={styles.controls}>
            <button className={styles.button} onClick={handleRun}>
              <img className={styles.buttonIcon} src={iconPlayArrow} />
              <span className={styles.tooltip}>{t('label.executeQuery')}</span>
            </button>
            <button className={styles.button} onClick={toggleDocumentation}>
              <img className={styles.buttonIcon} src={iconDocumentation} />
              <span className={styles.tooltip}>{t('label.showDocs')}</span>
            </button>
          </div>
        </div>

        <div className={styles.toolsLabels}>
          <label
            className={cn(styles.label, styles.labelTool, {
              [styles.labelToolActive]: toolsIsOpen && currentTool === 'variables',
            })}
            onClick={() => handleLabelClick('variables')}
          >
            {t('label.variables')}
          </label>

          <label
            className={cn(styles.label, styles.labelTool, {
              [styles.labelToolActive]: toolsIsOpen && currentTool === 'headers',
            })}
            onClick={() => handleLabelClick('headers')}
          >
            {t('label.headers')}
          </label>
          <button className={styles.toolsToggleButton} onClick={toggleTools}>
            <img
              className={cn(styles.foldIcon, { [styles.foldIconOpened]: !toolsIsOpen })}
              src={iconUnfold}
              alt=""
            />
          </button>
        </div>

        <div className={cn(styles.requestVariables, { [styles.varsClosed]: !toolsIsOpen })}>
          {currentTool === 'variables' ? (
            <Editor
              value={variablesValueRef.current}
              type="json"
              handleChange={updateVariablesValue}
            />
          ) : (
            <Editor value={headersValueRef.current} type="json" handleChange={updateHeadersValue} />
          )}
        </div>
      </section>

      <section className={styles.response}>
        <label className={styles.label}>{t('label.response')}</label>
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
