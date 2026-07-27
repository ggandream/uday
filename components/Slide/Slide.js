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

  console.log(`media type ${media_type}`);

  let mediaElement = `<img src="${thumbnail_url ? thumbnail_url : url}" alt="${alt}" class="slide__img" loading="lazy"/>`;

  if (media_type === "video") {
    mediaElement = `<iframe
                          class="slide__video"
                          title="${children}"
                          src="${url}">
                        </iframe>`;
  }

  return `<button type="button" class="slide" ${attr}>
            <span class="slide__title">${String(children).padStart(2, "0")}</span>
            ${mediaElement}
          </button>`;
};
