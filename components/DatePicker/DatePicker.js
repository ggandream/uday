import { icons } from "../../icons/icon.js";

export const DatePicker = () => {
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const maxDate = String(
    year +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(date).padStart(2, "0"),
  );

  return `<div class="date">
                <button class="date__btn" type="button" aria-label="Choose a date">
                  <span><span class="date__icon" aria-hidden="true" focusable="false">${icons["calendar"] ?? ""}</span></span>
                </button>
                <input
                    type="date"
                    class="date__input"
                    name="date__input"
                    min="1995-06-20"
                    max="${maxDate}"
                />
          </div>`;
};
