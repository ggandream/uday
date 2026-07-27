export const renderVideo = (url, title, block_css) => {
  if (url.lastIndexOf("mp4") && !url.includes("youtube")) {
    return `<video class="${block_css}__video" src="${url}" ${block_css === "slide" ? ` autoplay muted loop ` : ` controls `}  playsinline
             
              preload="metadata"></video>`;
  }

  if (url.includes("youtube")) {
    return `<iframe class="${block_css}__video" title="${title}" src="${url}"
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>`;
  }
};
