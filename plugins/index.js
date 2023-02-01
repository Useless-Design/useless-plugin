import vue from "@vitejs/plugin-vue";
import Inspect from "vite-plugin-inspect";

const fileRegex = /\.vue$/;

const createMyPlugin = () => {
  const myPlugin = {
    name: "add-hello-world",
    transform(code, id) {
      if (fileRegex.test(id)) {
        return code.replace(
          "<template>",
          `<template>
<h1>Hello World</h1>`
        );
      }
    },
  };
  return [myPlugin, vue(), Inspect()];
};

export default createMyPlugin;
