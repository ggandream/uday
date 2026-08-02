export const ErrorMsg = ({ children = "error" } = {}) => {
  return `<div class="error" tabindex="-1" role="alert"><p>${children}</p></div>`;
};
