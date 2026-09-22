import React, { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CButton, CFormInput, CProgress, CSpinner } from "@coreui/react";

const ImageFileUploadQuestion = ({
  attemptId,
  question,
  mediaById = {},
  value,
  onUploaded,
  accept,
  label,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);

  const existingIds = value?.mediaIds || [];
  const existing = existingIds
    .map((id) => mediaById[String(id)])
    .filter(Boolean);

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setPct(0);
      const form = new FormData();
      form.append("file", file);
      form.append("questionId", question.questionId);
      const { data } = await axios.post(
        `/api/v1/quiz-portal/attempts/${attemptId}/media`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (ev) => {
            if (ev.total) setPct(Math.round((ev.loaded / ev.total) * 100));
          },
        },
      );
      toast.success("Uploaded");
      onUploaded?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {existing.map((m) =>
        m.resourceType === "image" || m.mime?.startsWith("image/") ? (
          <img
            key={m._id}
            src={m.url}
            alt={m.fileName}
            className="rounded mb-2"
            style={{ maxWidth: "100%", maxHeight: 280 }}
          />
        ) : (
          <div key={m._id} className="mb-2">
            <a href={m.url} target="_blank" rel="noreferrer">
              {m.fileName || "Open file"}
            </a>
          </div>
        ),
      )}
      <CFormInput
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={onPick}
      />
      <div className="small text-body-secondary mt-1">{label}</div>
      {uploading ? (
        <div className="mt-2">
          <CSpinner size="sm" /> {pct}%
          <CProgress className="mt-1" value={pct} color="success" />
        </div>
      ) : null}
      {existing.length > 0 ? (
        <CButton
          className="mt-2"
          size="sm"
          color="secondary"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          Replace
        </CButton>
      ) : null}
    </div>
  );
};

export default ImageFileUploadQuestion;
