import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './DocumentationExplorer.module.scss';
import { IQuery, useLazyFetchResultQuery } from '../../store/slices/apiSlice';
import Roller from '../Roller/Roller';
import { IArgument, IField, IType, getQueryFields } from '../../utils/queries';
import { getTypeSchema } from '../../utils/queries';

interface DocumentationProps {
  isOpened: boolean;
  closeHandle: () => void;
}

export default function DocumentationExplorer(props: DocumentationProps) {
  const [docTreeArray, setDocTreeArray] = useState<IQuery[]>([
    {
      queryString: getQueryFields(),
      variables: {},
      headers: {},
    },
  ]);
  const { t } = useTranslation('documentation');
  const [trigger, { data, error, isError, isFetching }] = useLazyFetchResultQuery();

  useEffect(() => {
    trigger(docTreeArray[docTreeArray.length - 1], true);
  }, [trigger, docTreeArray]);

  const removeQuery = () => {
    const newArray = [...docTreeArray.slice(0, -1)];
    setDocTreeArray(newArray);
  };

  const addQuery = (argument: string) => {
    const query: IQuery = {
      queryString: getTypeSchema(argument),
      variables: {},
      headers: {},
    };
    const newArray = [...docTreeArray, query];
    setDocTreeArray(newArray);
  };

  const getTypeName = (type: IType) => {
    if (type.kind === 'NON_NULL' && type.ofType) {
      return type.ofType;
    }
    return type;
  };

  const getUndefinedSpan = () => {
    return <span className={styles.undefined}>undefined</span>;
  };

  const getColoredSpan = (type: IType) => {
    if (type.kind === 'OBJECT') {
      return (
        <span className={styles.object} onClick={() => addQuery(type.name || '')}>
          {type.name}
        </span>
      );
    }
    if (type.kind == 'INPUT_OBJECT') {
      return (
        <span className={styles.inputObject} onClick={() => addQuery(type.name || '')}>
          {type.name}
        </span>
      );
    }
    return (
      <span className={styles.type} onClick={() => addQuery(type.name || '')}>
        {type.name}
      </span>
    );
  };

  const getReturnTypeName = (type: IType) => {
    const nonNullType = getTypeName(type);
    if (nonNullType?.ofType && nonNullType?.kind === 'LIST') {
      const nonNullType1 = getTypeName(nonNullType.ofType);
      if (nonNullType1) {
        return <>{getColoredSpan(nonNullType1)}[]</>;
      }
      return getUndefinedSpan();
    }
    if (nonNullType?.name) {
      return getColoredSpan(nonNullType);
    }
    return getUndefinedSpan();
  };

  const getArgumentTypeName = (type: IType) => {
    let nonNull = false;
    if (type.kind === 'NON_NULL') {
      nonNull = true;
    }
    const nonNullType = getTypeName(type);
    if (nonNullType.name) {
      return (
        <>
          {getColoredSpan(nonNullType)}
          {nonNull ? <span className={styles.required}>required</span> : <></>}
        </>
      );
    }
    return getUndefinedSpan();
  };

  const getElementByField = (field: IField) => {
    return (
      <div className={styles.field} key={field.name}>
        <span className={styles.function} id={field.name}>
          {field.name}
        </span>
        {field.args && field.args.length > 0 ? (
          <>
            {field.fields}(
            {field.args.map((arg: IArgument, idx) => (
              <span key={idx}>
                <span id={idx.toString()}>{arg.name}</span>:&nbsp;
                {getArgumentTypeName(arg.type)}
              </span>
            ))}
            )
            <br />
            &nbsp;&nbsp;{'->'}&nbsp;{getReturnTypeName(field.type)}
          </>
        ) : (
          <>:&nbsp;{getReturnTypeName(field.type)}</>
        )}
      </div>
    );
  };

  if (!props.isOpened) return <></>;
  return (
    <div className={styles.explorer}>
      {docTreeArray.length > 1 && (
        <img src="./back-arrow.svg" className={styles.backIcon} onClick={removeQuery} />
      )}
      <h3 className={styles.documenationHeader}>{t('documentation')}</h3>
      <img src="./cross.svg" className={styles.crossIcon} onClick={props.closeHandle} />
      {isFetching || !data ? (
        <Roller x={-20} y={0} scale={0.8} style={{ margin: 'auto', flex: 1, paddingTop: '50%' }} />
      ) : isError && error !== undefined ? (
        'data' in error ? (
          JSON.stringify(error.data)
        ) : (
          JSON.stringify(error)
        )
      ) : (
        <>
          {data.data.__schema && (
            <div className={styles.response}>
              <div className={styles.root}>Root types:</div>
              <span className={styles.function}>query: </span>
              <span
                className={styles.object}
                onClick={() => addQuery(data.data.__schema.queryType.name)}
              >
                {data.data.__schema.queryType.name}
              </span>
            </div>
          )}
          {/*JSON.stringify(data.data.__type)*/}
          {data.data.__type && (
            <div className={styles.response}>
              <span
                className={cn(styles.typeName, {
                  [styles.objectName]: data.data.__type.kind === 'OBJECT',
                  [styles.inputObjectName]: data.data.__type.kind === 'INPUT_OBJECT',
                })}
              >
                {data.data.__type.name}
              </span>
              {data.data.__type.description}
              {data.data.__type.fields &&
                data.data.__type.fields.map((field: IField) => getElementByField(field))}
              {data.data.__type.inputFields &&
                data.data.__type.inputFields.map((field: IField) => getElementByField(field))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
