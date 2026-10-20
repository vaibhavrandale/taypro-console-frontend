import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Security GO: expense-claim and commissioning-document files uploaded after
// the backend change are Cloudinary type "authenticated". Their stored URL
// cannot be opened directly; the backend issues a signed URL valid for at most
// 10 minutes, only to users allowed to see the record. Old public URLs keep
// opening directly, exactly as before.

export const isAuthenticatedFileUrl = (url) =>
  typeof url === "string" && /\/(image|raw|video)\/authenticated\//.test(url);

/**
 * Props:
 *  - url: the stored file URL
 *  - signedUrlEndpoint: API path that returns { data: { url } }, or null when
 *    the record is not saved yet
 *  - download: ask for a download (attachment) instead of inline view
 *  - legacyHref: href to use for old public files (defaults to url)
 */
const SecureFileLink = ({
  url,
  signedUrlEndpoint,
  download = false,
  legacyHref,
  className,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  if (!url) return null;

  if (!isAuthenticatedFileUrl(url)) {
    return (
      <a
        href={legacyHref || url}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  if (!signedUrlEndpoint) {
    return (
      <span className="text-muted" title="Save first, then open the file">
        Save to view
      </span>
    );
  }

  const open = async (e) => {
    e.preventDefault();
    if (loading) return;
    // Open the tab synchronously so popup blockers allow it, then point it at
    // the signed URL once the API answers.
    const win = window.open("", "_blank");
    if (win) win.opener = null;
    setLoading(true);
    try {
      const { data } = await axios.get(signedUrlEndpoint, {
        params: download ? { download: true } : {},
        withCredentials: true,
      });
      const signed = data?.data?.url;
      if (!signed) throw new Error("No URL returned");
      if (win) win.location.href = signed;
      else window.location.assign(signed);
    } catch (err) {
      if (win) win.close();
      toast.error(
        err?.response?.status === 403
          ? "You do not have access to this file."
          : "Could not open the file. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <a
      href="#"
      onClick={open}
      className={className}
      aria-busy={loading}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

export default SecureFileLink;
