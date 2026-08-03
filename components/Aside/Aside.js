import { renderVideo } from "../../functions/renderVideo.js";
import { Button } from "../Button/Button.js";
import { Logo } from "../Logo/Logo.js";

export const Aside = ({
  title = "",
  url,
  explanation,
  copyright,
  media_type = "image",
}) => {
  let mediaElement = `<img src="${url}" class="aside__img" loading="lazy" alt="${title}" />`;

  if (media_type === "video") {
    mediaElement = renderVideo(url, title, "aside");
  }

  return `<dialog class="aside" id="dinamic-aside" aria-labelledby="aside-title" closedby="any" >
        <header class="aside__header">
        ${Logo()}
        ${Button({
          variant: "secondary",
          icon: "x",
          children: "Close",
          attributes: {
            "data-action": "close",
            command: "close",
            commandfor: "dinamic-aside",
            "aria-label": "Close",
          },
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
      </dialog>`;
};
