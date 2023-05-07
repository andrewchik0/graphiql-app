import React from 'react';

import styles from './Roller.module.scss';

export default function Roller(props: { scale: number; x: number; y: number; style?: object }) {
  return (
    <div
      className={styles.ldsRoller}
      style={{
        ...props.style,
        transform: `translate(${props.x}px, ${props.y}px) scale(${props.scale})`,
      }}
      data-testid="roller"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
