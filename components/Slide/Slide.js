import { renderVideo } from "../../functions/renderVideo.js";
import months from "../../months.json" with { type: "json" };
export const Slide = ({
  children,
  alt = "",
  url = "",
  media_type = "image",
  iso_date = "",
  thumbnail_url = "",
  href = "",
} = {}) => {
  let mediaElement = `<img src="${thumbnail_url ? thumbnail_url : url}" alt="${alt}" class="slide__img" loading="lazy" onerror="this.onerror=null; this.src='./assets/images/saturn.webp'"/>`;

  if (media_type === "video" && thumbnail_url === "" && url.includes("mp4")) {
    mediaElement = renderVideo(url, children, "slide");
  }

  const dateObj = new Date(iso_date + "T06:00:00.000Z");
  const date = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  let newHref = String(href).split("?")[0];

  const ariaLabel = `View ${months[month]} ${String(date).padStart(2, "0")}, ${year}`;

  return `<a class="slide" aria-label="${ariaLabel}" href="${newHref + `?date=${iso_date}`}" >
            <span class="slide__title">${String(children).padStart(2, "0")}</span>
            ${mediaElement}
          </a>`;
};
