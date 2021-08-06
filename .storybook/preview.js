import { addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
// import 'antd/dist/antd.css';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));
