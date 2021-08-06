/// <reference types="react-scripts" />
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.md' {
  const content: string;
  export default content;
}
