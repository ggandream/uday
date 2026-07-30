import { icons } from "../../icons/icon.js";

export const Button = ({
  variant = "primary",
  icon,
  children,
  attributes = {},
} = {}) => {
  const attr = Object.entries(attributes)
    .map(([attributeKey, attributeValue]) => {
      return `${attributeKey}="${attributeValue}"`;
    })
    .join(" ");

  return `<button type="button" class="btn btn--${variant}" aria-label="More information" ${attr}>
        <span><span class="btn__text btn__text--${variant}">${children}</span>
        ${icon ? `<span class="btn__icon">${icons[icon] ?? ""}</span>` : ""}
        </span>
      </button>`;
};
