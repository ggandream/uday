import { Button } from "../Button/Button.js";
import { Logo } from "../Logo/Logo.js";

export const Aside = ({
  title = "",
  url,
  explanation,
  copyright,
  media_type = "image",
}) => {
  let mediaElement = `<img src="${url}" alt="" class="aside__img" loading="lazy" />`;

  if (media_type === "video") {
    mediaElement = `<iframe
                          class="aside__video"
                          title="${title}"
                          src="${url}">
                        </iframe>`;
  }

  return `<aside class="aside hide">
        <header class="aside__header">
        ${Logo()}
        ${Button({
          variant: "secondary",
          icon: "x",
          children: "Close",
          attributes: { "data-action": "close" },
        })}
        </header>
        ${mediaElement}
        <h2 class="aside__title">${title}</h2>
        <p class="aside__text">
       ${title}
        </p>
        ${copyright ? `<p class="aside__text"> Image Credit & Copyright:  ${copyright} </p> ` : ""}
        <p class="aside__text">
        ${explanation}
        </p>
      </aside>`;
};
