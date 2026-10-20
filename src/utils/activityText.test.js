import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { activityLines, activityToText } from "./activityText";
import LastActivity from "../components/LastActivity";

jest.mock("date-fns", () => ({ formatDistanceToNow: () => "just now" }));

test("strips formatting markup and decodes entities to plain text", () => {
  expect(
    activityToText("Expense updated and updated fields: <span class='text-success'>remark</span>: \n  <span class='text-success'>Changed from</span> \n \"&quot;a&quot;\" to \"&lt;img src=x&gt;\""),
  ).toBe('Expense updated and updated fields: remark: Changed from ""a"" to "<img src=x>"');
  expect(activityToText("&amp;lt;b&amp;gt;")).toBe("&lt;b&gt;");
  expect(activityToText(null)).toBe("");
  expect(activityLines("a, b,  c")).toEqual(["a", "b", "c"]);
});

test("LastActivity renders a stored XSS payload as inert text", () => {
  // Escaped payloads come through as visible text, e.g. "&lt;img ...".
  const payloads = [
    '<img src=x onerror="alert(1)">',
    "&lt;img src=x onerror=alert(1)&gt;",
    "<svg/onload=alert(1)>, <script>alert(1)</script>",
    '<a href="javascript:alert(1)">x</a>',
  ];
  for (const details of payloads) {
    const html = renderToStaticMarkup(
      <LastActivity lastactivity={[{ name: "n", timestamp: new Date().toISOString(), details, profile_image: "" }]} />,
    );
    const detailsHtml = html.slice(html.indexOf('<p class=" maxw-75'));
    expect(detailsHtml).toContain("maxw-75");
    expect(detailsHtml).not.toMatch(/<img|<svg|<script|<a /i);
  }
});
