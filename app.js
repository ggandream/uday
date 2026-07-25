import { Hero } from "./components/Hero/Hero.js";
import { Nav } from "./components/Nav/Nav.js";
import { Gallery } from "./components/Gallery/Gallery.js";
import { Aside } from "./components/Aside/Aside.js";
import { API_KEY } from "./config.js";

const $main = document.querySelector("main");
let myDate = new Date().toISOString().split("T")[0];
const slides = [];
const url = "https://api.nasa.gov/planetary/apod?";

const getData = async (date) => {
  const params = new URLSearchParams();
  params.append("api_key", API_KEY);
  params.append("date", date);

  try {
    const response = await fetch(url + params);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);

  return d.toISOString().split("T")[0];
}

const getDataGallery = async (date) => {
  const startDate = addDays(date, -3);
  const endDate = addDays(date, -1);
  const params = new URLSearchParams();
  params.append("api_key", API_KEY);
  params.append("start_date", startDate);
  params.append("end_date", endDate);

  try {
    const response = await fetch(url + params);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

let dataf = await getData(myDate);
let data2f = await getDataGallery(myDate);

const render = (data1, data2) => {
  $main.innerHTML = "";
  slides.length = 0;
  const hero = Hero({
    title: data1.title,
    children: data1.explanation,
    published: data1.date,
  });

  Array.from(data2).forEach((data2) => {
    slides.push({
      children: data2.date.slice(8, 10),
      alt: data2.title,
      url: data2.url,
      date: data2.date,
    });
  });

  const aside = Aside({
    title: data1.title,
    url: data1.url,
    explanation: data1.explanation,
    copyright: data1.copyright,
  });
  const gallery = Gallery({ slides });
  const nav = Nav();

  $main.insertAdjacentHTML("beforeend", gallery);
  $main.insertAdjacentHTML("afterbegin", aside);
  $main.insertAdjacentHTML("afterbegin", hero);
  $main.insertAdjacentHTML("afterbegin", nav);

  document.body.style.setProperty(
    "background-image",
    `linear-gradient(rgba(10, 14, 26, 0.46), rgba(10, 14, 26, 0.46)), url("${data1.url}")`,
  );

  // Eventos y animaciones

  const $dateInput = document.querySelector('input[name="date__input"]');
  const $dateBtn = document.querySelector(".date__btn");

  const $showAside = document.querySelector('[data-action="show"]');
  const $closeAside = document.querySelector('[data-action="close"]');
  const $asideElement = document.querySelector(".aside");

  $dateBtn.addEventListener("click", () => {
    try {
      $dateInput.showPicker();
    } catch (error) {
      console.log(error);
    }
  });

  $dateInput.addEventListener("change", async () => {
    console.log($dateInput.value);
    myDate = $dateInput.value;
    dataf = await getData(myDate);
    data2f = await getDataGallery(myDate);
    render(dataf, data2f);
  });

  $showAside.addEventListener("click", () => {
    $asideElement.classList.remove("hide");
    $asideElement.classList.add("show");
  });

  $closeAside.addEventListener("click", () => {
    $asideElement.classList.remove("show");
    $asideElement.classList.add("hide");
  });
};

render(dataf, data2f);

// // Eventos y animaciones

// const $dateInput = document.querySelector('input[name="date__input"]');
// const $dateBtn = document.querySelector(".date__btn");

// const $showAside = document.querySelector('[data-action="show"]');
// const $closeAside = document.querySelector('[data-action="close"]');
// const $asideElement = document.querySelector(".aside");

// $dateBtn.addEventListener("click", () => {
//   try {
//     $dateInput.showPicker();
//   } catch (error) {
//     console.log(error);
//   }
// });

// $dateInput.addEventListener("change", async () => {
//   console.log($dateInput.value);
//   myDate = $dateInput.value;
//   dataf = await getData(myDate);
//   data2f = await getDataGallery(myDate);
//   render(dataf, data2f);
// });

// $showAside.addEventListener("click", () => {
//   $asideElement.classList.remove("hide");
//   $asideElement.classList.add("show");
// });

// $closeAside.addEventListener("click", () => {
//   $asideElement.classList.remove("show");
//   $asideElement.classList.add("hide");
// });
