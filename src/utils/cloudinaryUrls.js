// Security (#424 B1): only our own Cloudinary URLs may ever become a link.
// Anything else (javascript:, data:, other hosts, other clouds) must render as
// plain text. Cloud name is public (it is in every image URL).
export const CLOUDINARY_CLOUD_NAME =
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "decyim6cd";

const RESOURCE_TYPES = ["image", "raw", "video"];
const DELIVERY_TYPES = ["upload", "authenticated"];

const parse = (value) => {
  if (typeof value !== "string" || !value || value.length > 2000) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const plainHttps = (u, host) =>
  u &&
  u.protocol === "https:" &&
  u.hostname === host &&
  !u.port &&
  !u.username &&
  !u.password;

/** https://res.cloudinary.com/<our cloud>/<image|raw|video>/<upload|authenticated>/... */
export function parseOurDeliveryUrl(value, cloudName = CLOUDINARY_CLOUD_NAME) {
  const u = parse(value);
  if (!plainHttps(u, "res.cloudinary.com")) return null;
  const seg = u.pathname.split("/");
  // ["", cloud, rt, type, ...rest]
  if (seg.length < 5 || seg[0] !== "" || seg[1] !== cloudName) return null;
  if (!RESOURCE_TYPES.includes(seg[2]) || !DELIVERY_TYPES.includes(seg[3]))
    return null;
  if (seg.slice(4).some((s) => s === "" || s === "..")) return null;
  return { resourceType: seg[2], type: seg[3] };
}

export const isSafeDeliveryUrl = (value, cloudName) =>
  parseOurDeliveryUrl(value, cloudName) !== null;

export const isAuthenticatedDeliveryUrl = (value, cloudName) =>
  parseOurDeliveryUrl(value, cloudName)?.type === "authenticated";

/** Signed URL from the backend: https://api.cloudinary.com/v1_1/<our cloud>/<rt>/download?... */
export function isSafeSignedUrl(value, cloudName = CLOUDINARY_CLOUD_NAME) {
  const u = parse(value);
  if (!plainHttps(u, "api.cloudinary.com")) return false;
  const seg = u.pathname.split("/");
  return (
    seg.length === 5 &&
    seg[0] === "" &&
    seg[1] === "v1_1" &&
    seg[2] === cloudName &&
    RESOURCE_TYPES.includes(seg[3]) &&
    seg[4] === "download"
  );
}
