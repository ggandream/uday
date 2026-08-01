async function loadIcon(name) {
  const response = await fetch(`./icons/${name}.svg`);
  return response.text();
}

export const icons = {
  planet: await loadIcon("planet"),
  calendar: await loadIcon("calendar"),
  arrow: await loadIcon("arrow-narrow-right-dashed"),
  x: await loadIcon("x"),
};
