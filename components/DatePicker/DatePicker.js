import { icons } from "../../icons/icon.js";

export const DatePicker = () => {
  return `<div class="date">
                <button class="date__btn" type="button">
                  <span><span class="date__icon">${icons["calendar"] ?? ""}</span></span>
                </button>
                <input
                    type="date"
                    class="date__input"
                    name="date__input"
                    min="1995-06-20"
                    max="${new Date().toISOString().split("T")[0]}"
                />
          </div>`;
};
