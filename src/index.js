import React from 'react';
import ReactDOM from 'react-dom';

import styles from './index.css';

const title = 'My React Webpack Babel Setup';

ReactDOM.render(
  <div className={styles.title}>{title}</div>,
  document.getElementById('app')
);

module.hot.accept();
