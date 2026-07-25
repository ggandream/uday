import { Slide } from "../Slide/Slide.js";

export const Gallery = ({ slides = [] }) => {
  const cards = slides
    .map((slide) =>
      Slide({
        children: slide.children,
        alt: slide.alt,
        url: slide.url,
        attributes: { "data-date": slide.date },
      }),
    )
    .join(" ");

  return `<section class="gallery">
          <div class="slide__container">
          ${cards}
          </div>
          </section>`;
};
