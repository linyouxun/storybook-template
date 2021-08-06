import { configure } from '@storybook/react';

// automatically import all files in stories folder
const req = require.context('../src/components', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
