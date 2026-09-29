import axios from "axios";

/**
 * Browser → Cloudinary (signed) → backend confirm.
 *
 * axios.defaults.withCredentials is true app-wide. Cloudinary rejects
 * credentialed cross-origin uploads (CORS → Network Error), so the
 * Cloudinary POST must use withCredentials: false.
 */
export async function uploadQuizMediaDirect({
  attemptId,
  questionId,
  file,
  durationSec = 0,
  onProgress,
}) {
  const { data: signRes } = await axios.post(
    `/api/v1/quiz-portal/attempts/${attemptId}/media/sign`,
    {
      questionId: String(questionId),
      mime: file.type || "",
      fileName: file.name || "",
    },
    { withCredentials: true },
  );

  const s = signRes.data;
  const maxBytes = (s.maxSizeMb || 100) * 1024 * 1024;
  if (file.size > maxBytes) {
    const err = new Error(`File too large. Max ${s.maxSizeMb} MB`);
    err.statusCode = 413;
    throw err;
  }

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", s.apiKey);
  form.append("timestamp", String(s.timestamp));
  form.append("signature", s.signature);
  form.append("folder", s.folder);

  const cloudUrl = `https://api.cloudinary.com/v1_1/${s.cloudName}/${s.resourceType}/upload`;

  let uploaded;
  try {
    const cloudRes = await axios.post(cloudUrl, form, {
      withCredentials: false,
      timeout: 0,
      onUploadProgress: (ev) => {
        if (ev.total && onProgress) {
          onProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      },
    });
    uploaded = cloudRes.data;
  } catch (e) {
    const cloudMsg =
      e.response?.data?.error?.message ||
      e.response?.data?.message ||
      e.message;
    throw new Error(
      e.code === "ERR_NETWORK" || !e.response
        ? "Cloudinary upload failed (network/CORS). Retry once."
        : cloudMsg || "Cloudinary upload failed",
    );
  }

  const { data: confirmRes } = await axios.post(
    `/api/v1/quiz-portal/attempts/${attemptId}/media/confirm`,
    {
      questionId: String(questionId),
      publicId: uploaded.public_id,
      url: uploaded.secure_url,
      durationSec,
      fileSize: uploaded.bytes || file.size,
      mime: file.type || "",
      fileName: file.name || "upload",
      resourceType: s.resourceType,
    },
    { withCredentials: true },
  );

  return confirmRes.data?.data || confirmRes.data;
}
