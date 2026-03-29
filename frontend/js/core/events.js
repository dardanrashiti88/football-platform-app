export const emitEvent = (name, detail) => {
  document.dispatchEvent(new CustomEvent(name, { detail }));
};

export const onEvent = (name, handler) => {
  document.addEventListener(name, handler);
};
