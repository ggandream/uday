export const Slide = ({ children, alt = "", url = "", attributes = {} }) => {
  const attr = Object.entries(attributes)
    .map(([attrK, attrV]) => {
      return `${attrK}:"${attrV}"`;
    })
    .join(" ");

  return `<article class="slide" ${attr}>
            <h2 class="slide__title">${String(children).padStart(2, "0")}</h2>
            <img src="${url}" alt="${alt}" class="slide__img" loading="lazy"/>
          </article>`;
};
