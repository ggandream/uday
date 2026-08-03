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
const STORAGE_KEY2 = "gallery_saved";

const getSavedDays = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

const getSavedGalleryDays = () => {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY2) || "[]");
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

  const saved = getSavedDays();
  const itemIsSaved = saved.find((item) => item.date === String(date));

  let arraySaved = [];
  let response = "";
  try {
    if (!itemIsSaved) {
      $main.innerHTML = `<div class="loader" role="status"></div>`;
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
        case 503:
          throw new Error(
            "503 - The server is busy, down for maintenance, or overloaded with too many visitors",
          );
      }
    }
  } catch (e) {
    const errorMsg = ErrorMsg({ children: e.name + ": " + e.message });
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

  const saved = getSavedGalleryDays(); //obtener el string de session storage

  const daysRange = saved.find(
    (group) => group.some((day) => day.date === startDate), //Obtener el grupo que empieza por StartDate
  );

  let arraySaved = [];
  let result;
  try {
    if (!daysRange) {
      const response = await fetch(urlNasa + params);

      sessionStorage.setItem(STORAGE_KEY2, JSON.stringify(response));
      console.log("Guardando", JSON.stringify(response));

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      result = await response.json();

      arraySaved = [...saved, result];
    } else {
      arraySaved = [...saved];
      result = daysRange;
    }
  } catch (error) {
    console.log(error);
  }

  sessionStorage.setItem(STORAGE_KEY2, JSON.stringify(arraySaved));
  return result;
};

// let params = new URLSearchParams(document.location.search);
const url = new URL(document.location.href);
let date = url.searchParams.get("date");

let dataf = await getData(date); //
let data2f = await getDataGallery(dataf.date);

const appendEvent = () => {
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

  //DatePicker - input date
  $dateInput.addEventListener("change", async () => {
    myDate = $dateInput.value;
    dataf = await getData(myDate); //Fetch background
    data2f = await getDataGallery(myDate); //fetch gallery

    url.searchParams.set("date", myDate);
    history.pushState(null, "", url);

    renderHero(dataf);
    renderGallery(data2f);
  });

  $dateInput.value = dataf.date;

  if (!("command" in HTMLButtonElement.prototype)) {
    $showAside.addEventListener("click", () => $asideElement.showModal());
    $closeAside.addEventListener("click", () => $asideElement.close());
  }

  if (!("closedby" in HTMLDialogElement.prototype)) {
    $asideElement.addEventListener("click", (e) => {
      console.log(e.target);
      if (e.target === $asideElement) $asideElement.close();
    });
  }
};

const renderHero = (data1) => {
  $main.innerHTML = "";

  slides.length = 0;
  const hero = Hero({
    title: data1.title,
    children: data1.explanation,
    published: data1.date,
  });

  const aside = Aside({
    title: data1.title,
    url: data1.url,
    media_type: data1.media_type,
    explanation: data1.explanation,
    copyright: data1.copyright,
  });

  const nav = Nav();

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

  appendEvent();
};

const renderGallery = (data) => {
  Array.from(data).forEach((data) => {
    slides.push({
      children: data.date.slice(8, 10),
      alt: data.title,
      url: data.url,
      media_type: data.media_type,
      thumbnail_url: data.thumbnail_url,
      iso_date: data.date,
      href: url,
    });
  });

  const gallery = Gallery({ slides });

  $main.insertAdjacentHTML("beforeend", gallery);
};

renderHero(dataf);
renderGallery(data2f);

addEventListener("popstate", async () => {
  const urlPop = new URL(document.location.href);
  myDate = urlPop.searchParams.get("date");

  dataf = await getData(myDate); //Fetch background
  data2f = await getDataGallery(myDate); //fetch gallery

  renderHero(dataf);
  renderGallery(data2f);
});
