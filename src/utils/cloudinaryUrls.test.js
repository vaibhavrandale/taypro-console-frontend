import {
  isPdfPath,
  isAuthenticatedDeliveryUrl,
  isSafeDeliveryUrl,
  isSafeSignedUrl,
} from "./cloudinaryUrls";

const C = "decyim6cd";
const ok = [
  `https://res.cloudinary.com/${C}/image/upload/v1/expense-claim/bill.jpg`,
  `https://res.cloudinary.com/${C}/raw/upload/v1/commissioning-document/doc.pdf?fl_attachment=true`,
  `https://res.cloudinary.com/${C}/raw/authenticated/v1/expense-claim/8b0c.pdf`,
];
const bad = [
  "javascript:alert(document.cookie)//raw/authenticated/x",
  "JavaScript:alert(1)",
  " javascript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "vbscript:msgbox(1)",
  `http://res.cloudinary.com/${C}/image/upload/v1/x.jpg`,
  "https://res.cloudinary.com/othercloud/image/upload/v1/x.jpg",
  `https://evil.example/${C}/raw/authenticated/v1/x.pdf`,
  `https://res.cloudinary.com.evil.example/${C}/image/upload/v1/x.jpg`,
  `https://user@res.cloudinary.com/${C}/image/upload/v1/x.jpg`,
  `https://res.cloudinary.com/${C}/image/fetch/https://evil.example/x.jpg`,
  "/relative/path.pdf",
  "",
  null,
  undefined,
  42,
];

test("delivery URLs: only https res.cloudinary.com/<our cloud>/...", () => {
  ok.forEach((u) => expect(isSafeDeliveryUrl(u, C)).toBe(true));
  bad.forEach((u) => expect(isSafeDeliveryUrl(u, C)).toBe(false));
});

test("authenticated detection needs the real path segment, not a substring", () => {
  expect(isAuthenticatedDeliveryUrl(ok[2], C)).toBe(true);
  expect(isAuthenticatedDeliveryUrl(ok[0], C)).toBe(false);
  expect(isAuthenticatedDeliveryUrl(bad[0], C)).toBe(false);
});

test("signed URLs: only https api.cloudinary.com/v1_1/<our cloud>/<rt>/download", () => {
  expect(isSafeSignedUrl(`https://api.cloudinary.com/v1_1/${C}/raw/download?public_id=x&signature=y`, C)).toBe(true);
  [
    "javascript:alert(1)",
    `https://api.cloudinary.com/v1_1/othercloud/raw/download?x=1`,
    `https://api.cloudinary.com.evil.example/v1_1/${C}/raw/download`,
    `http://api.cloudinary.com/v1_1/${C}/raw/download`,
    `https://api.cloudinary.com/v1_1/${C}/raw/upload`,
    ok[0],
  ].forEach((u) => expect(isSafeSignedUrl(u, C)).toBe(false));
});

test("isPdfPath: path must end in .pdf; query/hash tricks are not PDFs", () => {
  expect(isPdfPath(`https://res.cloudinary.com/${C}/raw/upload/v1/nomenclature/a.PDF`)).toBe(true);
  [
    `https://res.cloudinary.com/${C}/raw/upload/v1/nomenclature/x.html?.pdf`,
    `https://res.cloudinary.com/${C}/raw/upload/v1/nomenclature/x.html#.pdf`,
    `https://res.cloudinary.com/${C}/raw/upload/v1/nomenclature/x.pdf.html`,
    "not a url",
    null,
  ].forEach((u) => expect(isPdfPath(u)).toBe(false));
});
