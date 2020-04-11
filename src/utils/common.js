export const wait = (idle) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, idle);
});