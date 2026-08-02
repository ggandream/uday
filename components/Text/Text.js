export function Text({
  variant = "primary",
  children = "",
  lineclamp = false,
}) {
  if (lineclamp) {
    return `<p class="text text--${variant} text--lines" tabindex="-1">${children}</p>`;
  } else {
    return `<p class="text text--${variant}">${children}</p>`;
  }
}
