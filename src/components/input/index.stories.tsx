import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from './index';
import markdown from './index.md';
import './index.less';

storiesOf('Input', module).add(
  'base',
  () => {
    return (
      <div id="component">
        <Input />
      </div>
    );
  },
  { notes: markdown }
);
