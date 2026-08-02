import { Hero } from "./components/Hero/Hero.js";
import { Nav } from "./components/Nav/Nav.js";
import { Gallery } from "./components/Gallery/Gallery.js";
import { Aside } from "./components/Aside/Aside.js";
import { API_KEY } from "./config.js";
import { ErrorMsg } from "./components/errorMsg/ErrorMsg.js";

const $main = document.querySelector("main");
let myDate = new Date().toISOString().split("T")[0];
const slides = [];
const urlNasa = "https://api.nasa.gov/planetary/apod?";
const STORAGE_KEY = "days-saved";

const getDaysSaved = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

const getData = async (date) => {
  let result = "";
  if (!checkDate(date)) {
    date = null;
  }
  const params = new URLSearchParams();
  params.append("api_key", API_KEY);
  params.append("thumbs", true);
  if (date !== null) {
    params.append("date", date);
  }

  const saved = getDaysSaved();
  const itemIsSaved = saved.find((item) => item.date === String(date));

  let arraySaved = [];

  try {
    let response = "";
    if (!itemIsSaved) {
      response = await fetch(urlNasa + params);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      result = await response.json();
      arraySaved = [...saved, result];
    } else {
      arraySaved = [...saved];
      result = itemIsSaved;
    }

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error(
            "404 - The server can’t find the requested resource.",
          );
        case 401:
          throw new Error(
            "401 - The server rejected your request due to missing or invalid authentication. ",
          );
        case 403:
          throw new Error(
            "403 - The server understood your request but denied access.",
          );
        case 500:
          throw new Error(
            "500 - Generic error. The server hit an unexpected problem that prevented it from completing the request. Try later!",
          );
        default:
          throw new Error(`Error HTTP: ${response.status}`);
      }
    }
  } catch (error) {
    const errorMsg = ErrorMsg({ children: error.message });
    $main.innerHTML = errorMsg;
  }

  if (arraySaved.length > 5) {
    arraySaved = [...arraySaved.slice(-5)];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(arraySaved));

  return result;
};

function checkDate(date) {
  const dateObj = new Date(date);
  return dateObj.toString() !== "Invalid Date";
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);

  return d.toISOString().split("T")[0];
}

const getDataGallery = async (date) => {
  if (!checkDate(date)) {
    date = new Date().toString().split("T")[0];
  }
  const startDate = addDays(date, -3);
  const endDate = addDays(date, -1);
  const params = new URLSearchParams();
  params.append("api_key", API_KEY);
  params.append("start_date", startDate);
  params.append("end_date", endDate);
  params.append("thumbs", true);

  try {
    const response = await fetch(urlNasa + params);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

// let params = new URLSearchParams(document.location.search);
const url = new URL(document.location.href);
let date = url.searchParams.get("date");

let dataf = await getData(date);
let data2f = await getDataGallery(dataf.date);

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
      media_type: data2.media_type,
      thumbnail_url: data2.thumbnail_url,
      iso_date: data2.date,
      href: url,
    });
  });

  const aside = Aside({
    title: data1.title,
    url: data1.url,
    media_type: data1.media_type,
    explanation: data1.explanation,
    copyright: data1.copyright,
  });
  const gallery = Gallery({ slides });
  const nav = Nav();

  $main.insertAdjacentHTML("beforeend", gallery);
  $main.insertAdjacentHTML("afterbegin", aside);
  $main.insertAdjacentHTML("afterbegin", hero);
  $main.insertAdjacentHTML("afterbegin", nav);

  const $title = $main.querySelector(".hero .title");
  $title.focus();

  if (data1.thumbnail_url === "" && data1.url.toLowerCase().includes("mp4")) {
    document.body.style.setProperty(
      "background-image",
      `linear-gradient(rgba(10, 14, 26, 0.46), rgba(10, 14, 26, 0.46)), url('./assets/images/saturn.webp')`,
    );
  } else {
    document.body.style.setProperty(
      "background-image",
      `linear-gradient(rgba(10, 14, 26, 0.46), rgba(10, 14, 26, 0.46)), url("${data1.thumbnail_url ? data1.thumbnail_url : data1.url}")`,
    );
  }

  // Eventos y animaciones

  const $dateInput = document.querySelector('input[name="date__input"]');
  const $dateBtn = document.querySelector(".date__btn");

  const $showAside = document.querySelector('[data-action="show"]');
  const $closeAside = document.querySelector('[data-action="close"]');
  const $asideElement = document.querySelector(".aside");
  const $gallery = document.querySelector(".gallery");

  $dateBtn.addEventListener("click", () => {
    try {
      $dateInput.showPicker();
    } catch (error) {
      console.log(error);
    }
  });

  $dateInput.addEventListener("change", async () => {
    myDate = $dateInput.value;
    dataf = await getData(myDate);
    data2f = await getDataGallery(myDate);

    url.searchParams.set("date", myDate);
    history.replaceState(null, "", url);

    render(dataf, data2f);
  });

  $dateInput.value = dataf.date;

  if (!("command" in HTMLButtonElement.prototype)) {
    $showAside.addEventListener("click", () => $asideElement.showModal());
    $closeAside.addEventListener("click", () => $asideElement.close());
  }

  $gallery.addEventListener("click", async (e) => {
    if (e.target.matches(".slide, .slide__img, .slide__title")) {
      console.log(e.target.closest(".slide").getAttribute("data-date"));
      dataf = await getData(
        e.target.closest(".slide").getAttribute("data-date"),
      );
      data2f = await getDataGallery(
        e.target.closest(".slide").getAttribute("data-date"),
      );
      render(dataf, data2f);
      history.replaceState(null, "", url);
    }
  });
};

render(dataf, data2f);
