import { renderVideo } from "../../functions/renderVideo.js";

export const Slide = ({
  children,
  alt = "",
  url = "",
  media_type = "image",
  attributes = {},
  thumbnail_url = "",
}) => {
  const attr = Object.entries(attributes)
    .map(([attrK, attrV]) => {
      return `${attrK}="${attrV}"`;
    })
    .join(" ");

  let mediaElement = `<img src="${thumbnail_url ? thumbnail_url : url}" alt="${alt}" class="slide__img" loading="lazy"/>`;

  if (media_type === "video" && thumbnail_url === "" && url.includes("mp4")) {
    mediaElement = renderVideo(url, children, "slide");
  }

  return `<button type="button" class="slide" ${attr}>
            <span class="slide__title">${String(children).padStart(2, "0")}</span>
            ${mediaElement}
          </button>`;
};
