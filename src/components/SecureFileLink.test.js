// Security (#424 allowlist applied to chat attachments and nomenclature files):
// only our own Cloudinary URLs may render as a link; everything else is text.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SecureFileLink from "./SecureFileLink";

jest.mock("axios", () => ({ get: jest.fn() }));
jest.mock("react-hot-toast", () => ({ error: jest.fn() }));

const C = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "decyim6cd";
const chatPdf = `https://res.cloudinary.com/${C}/raw/upload/v1/chat-attachment/report.pdf`;
const nomRef = `https://res.cloudinary.com/${C}/image/upload/v1/nomenclature/drawing.png`;
const nomChat = `https://res.cloudinary.com/${C}/raw/upload/v1/nomenclature-chats/a.pdf`;

test.each([chatPdf, nomRef, nomChat])("our Cloudinary file renders a safe link: %s", (url) => {
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(<SecureFileLink url={url} signedUrlEndpoint={null}>open</SecureFileLink>);
  const a = div.querySelector("a");
  expect(a).not.toBeNull();
  expect(a.textContent).toBe("open");
  expect(a.getAttribute("href")).toBe(url);
  expect(a.getAttribute("target")).toBe("_blank");
  expect(a.getAttribute("rel")).toContain("noopener");
});

test.each([
  "javascript:alert(document.cookie)",
  "JavaScript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "https://evil.example/x.pdf",
  `https://res.cloudinary.com/othercloud/raw/upload/v1/chat-attachment/x.pdf`,
  `http://res.cloudinary.com/${C}/raw/upload/v1/chat-attachment/x.pdf`,
  "/relative/x.pdf",
])("anything else renders as plain text, never a link: %s", (url) => {
  const html = renderToStaticMarkup(<SecureFileLink url={url} signedUrlEndpoint={null}>open</SecureFileLink>);
  expect(html).not.toContain("<a");
  expect(html).not.toContain("href");
  expect(html).toContain("Invalid file link");
});

test("no url renders nothing", () => {
  expect(renderToStaticMarkup(<SecureFileLink url="" signedUrlEndpoint={null}>open</SecureFileLink>)).toBe("");
});
