import React, { Component } from 'react';
import { createLocal } from '../../utils/localnames';
import Counter from '../Counter';
import styles from './styles.scss';

const { localNames: local } = createLocal(styles);

export default class Footer extends Component {
  render() {
    return (
      <div className={local('main')}>
        <Counter />
      </div>
    );
  }
}
