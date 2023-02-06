import { marked } from "marked";
import createRenderer from "./utils/md-renderer";
const mdRenderer = createRenderer();

const mdToVue = (code) => {
  const tokens = marked.lexer(code);
  const docMainTemplate = marked.parser(tokens, {
    gfm: true,
    renderer: mdRenderer,
  });
  const docTemplate = `<template>
  ${docMainTemplate}
</template>
`;
  return docTemplate;
};

export default mdToVue;
