import fs from "fs";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { activityToText } from "./activityText";

const render = (el) => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(el);
  document.body.appendChild(container);
  return { container };
};

// Security (#426 follow-up): robot / notification activity views render the
// backend "details" string as text. Payload-derived values are stored
// HTML-escaped by the backend (#533 B4); older rows may still hold raw markup.
const VIEWS = [
  "views/master-admin/site-management/RobotActivity.js",
  "views/robot-position/RobotLastActivity.js",
  "views/master-admin/notifications/Notifications.js",
];

test.each(VIEWS)(
  "%s has no dangerouslySetInnerHTML and uses activityToText",
  (rel) => {
    const src = fs.readFileSync(path.join(__dirname, "..", rel), "utf8");
    expect(src).not.toMatch(/dangerouslySetInnerHTML/);
    expect(src).toMatch(/activityToText\(/);
  },
);

const cases = [
  // legacy raw payload stored before #533
  `<span class='text-success'><img src=x onerror="window.__xss=1"></span> command sent to R1 (D1) by <span class='text-success'>u</span>.`,
  // escaped payload stored after #533 B4
  `<span class='text-success'>&lt;img src=x onerror=&quot;window.__xss=1&quot;&gt;</span> command sent to R1 (D1) by <span class='text-success'>u</span>.`,
  `<svg onload="window.__xss=1">`,
  `&lt;script&gt;window.__xss=1&lt;/script&gt;`,
];

test.each(cases)("renders as inert text: %s", (details) => {
  window.__xss = 0;
  const { container } = render(<span>{activityToText(details)}</span>);
  expect(container.querySelector("img, svg, script")).toBeNull();
  expect(window.__xss).toBe(0);
  expect(container.textContent).not.toMatch(/<span/);
});

test("escaped payload shows the literal characters once", () => {
  const { container } = render(
    <span>
      {activityToText(
        `<span class='text-success'>&lt;b&gt;14&lt;/b&gt;</span> command sent`,
      )}
    </span>,
  );
  expect(container.textContent).toBe("<b>14</b> command sent");
  expect(container.querySelector("b")).toBeNull();
});
