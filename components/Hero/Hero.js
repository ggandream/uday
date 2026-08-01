import { Title } from "../Title/Title.js";
import { Text } from "../Text/Text.js";
import { Button } from "../Button/Button.js";
import months from "../../months.json" with { type: "json" };

export function Hero({
  title = "Title of Hero",
  children = "",
  published,
} = {}) {
  const dateObj = new Date(published + "T06:00:00.000Z");
  const date = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  const publishedText = `Published on ${months[month]} ${String(date).padStart(2, "0")}, ${year} CST`;

  return `<section class="hero">
            <article class="card">            
            <div class="card__body">
            ${Title({ level: 1, children: title, lineclamp: true })}
            ${Text({ variant: "primary", children: children, lineclamp: true })}
            </div>
            ${Text({ variant: "secondary", children: publishedText })}
            </article>
            ${Button({ variant: "primary", icon: "arrow", children: "More", attributes: { "data-action": "show" } })}
          </section>`;
}
