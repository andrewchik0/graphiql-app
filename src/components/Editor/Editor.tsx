import CodeMirror from '@uiw/react-codemirror';
import { materialDarkInit } from '@uiw/codemirror-theme-material';
import { graphql } from 'cm6-graphql';
import { json } from '@codemirror/lang-json';
import cn from 'classnames';

import styles from './Editor.module.scss';

interface IEditor {
  className?: string;
  type: 'json' | 'graphql';
  value: string;
  handleChange?: (value: string) => void;
  readOnly?: boolean;
}

const Editor: React.FC<IEditor> = ({
  className,
  type,
  value,
  handleChange,
  readOnly = false,
}: IEditor) => {
  const extesionArray = type === 'graphql' ? [graphql()] : type === 'json' ? [json()] : [];
  return (
    <CodeMirror
      className={cn(styles.editor, { className: className !== undefined })}
      minWidth="100%"
      minHeight="100%"
      theme={materialDarkInit({
        settings: {
          background: 'transparent',
          lineHighlight: 'transparent',
          foreground: 'white',
          selectionMatch: 'transparent',
          gutterForeground: 'rgb(253 253 253 / 60%);',
          gutterActiveForeground: 'rgb(255 255 255 / 100%);',
        },
      })}
      readOnly={readOnly}
      extensions={extesionArray}
      basicSetup={{ searchKeymap: false }}
      value={value}
      onChange={handleChange}
    />
  );
};

export default Editor;
