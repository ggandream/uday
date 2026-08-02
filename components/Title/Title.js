export function Title({ level = 1, children = "", lineclamp = false } = {}) {
  return `<h${level} class="title ${lineclamp ? `title--lines` : ""}" tabindex="-1">${children}</h${level}>`;
}
