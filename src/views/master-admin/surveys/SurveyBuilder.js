import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CButton,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CSpinner,
} from "@coreui/react";
import { publicUrl, surveyBase } from "./surveyPaths";

const emptyField = () => ({
  key: `f_${Math.random().toString(16).slice(2, 10)}`,
  label: "",
  type: "text",
  required: false,
  placeholder: "",
});

const SurveyBuilder = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const role = useSelector((s) => s.userInfo?.role);
  const base = surveyBase(role);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([emptyField()]);
  const [status, setStatus] = useState("DRAFT");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    axios
      .get(`/api/v1/surveys/${id}`, { withCredentials: true })
      .then((res) => {
        const survey = res.data.data;
        setTitle(survey.title || "");
        setDescription(survey.description || "");
        setFields(survey.fields?.length ? survey.fields : [emptyField()]);
        setStatus(survey.status || "DRAFT");
        setLink(publicUrl(survey.publicPath));
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load this survey"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateField = (index, patch) => {
    setFields((prev) => prev.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  };

  const moveField = (index, dir) => {
    setFields((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const save = async (publishAfter) => {
    setSaving(true);
    setError("");
    const payload = { title, description, fields };
    let surveyId = id;
    try {
      const saved = isEdit
        ? await axios.put(`/api/v1/surveys/${id}`, payload, { withCredentials: true })
        : await axios.post("/api/v1/surveys", payload, { withCredentials: true });
      surveyId = saved.data.data._id;
      let publishedPath = saved.data.data.publicPath;
      if (publishAfter) {
        const published = await axios.post(
          `/api/v1/surveys/${surveyId}/publish`,
          {},
          { withCredentials: true },
        );
        publishedPath = published.data.data.publicPath;
        setStatus("PUBLISHED");
        toast.success("Survey is live");
      } else {
        toast.success("Survey saved");
      }
      setLink(publicUrl(publishedPath));
      if (!isEdit) navigate(`${base}/${surveyId}/edit`, { replace: true });
    } catch (err) {
      if (!isEdit && surveyId && surveyId !== id) {
        navigate(`${base}/${surveyId}/edit`, { replace: true });
      }
      const message = err.response?.data?.message || "Could not save the survey";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <CSpinner />
        <div className="small text-body-secondary mt-2">Loading survey…</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
        <div>
          <h4 className="mb-1">{isEdit ? "Edit survey" : "New survey"}</h4>
          <div className="small text-body-secondary">
            Text, number, and file fields. Publish to open the public link.
          </div>
        </div>
        <Link className="btn btn-outline-secondary btn-sm" to={base}>
          Back
        </Link>
      </div>

      {error ? (
        <div className="border border-danger rounded px-3 py-2 mb-3">{error}</div>
      ) : null}

      {link ? (
        <div className="border rounded p-3 mb-3">
          <div className="small text-body-secondary mb-1">
            Public link {status === "PUBLISHED" ? "(live)" : `(${status.toLowerCase()})`}
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <CFormInput readOnly value={link} />
            <CButton color="secondary" onClick={copyLink}>
              Copy
            </CButton>
          </div>
        </div>
      ) : null}

      <div className="border rounded p-3 mb-3">
        <label className="form-label">Title</label>
        <CFormInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Site feedback" />
        <label className="form-label mt-3">Description</label>
        <CFormTextarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What should people know before they answer?"
        />
      </div>

      <div className="d-flex flex-column gap-3 mb-3">
        {fields.map((field, index) => (
          <div key={field.key} className="border rounded p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Field {index + 1}</div>
              <div className="d-flex gap-1">
                <CButton size="sm" color="secondary" variant="ghost" onClick={() => moveField(index, -1)}>
                  Up
                </CButton>
                <CButton size="sm" color="secondary" variant="ghost" onClick={() => moveField(index, 1)}>
                  Down
                </CButton>
                <CButton
                  size="sm"
                  color="danger"
                  variant="ghost"
                  onClick={() => setFields((prev) => prev.filter((_, i) => i !== index))}
                >
                  Remove
                </CButton>
              </div>
            </div>
            <div className="row g-2">
              <div className="col-md-6">
                <CFormInput
                  value={field.label}
                  placeholder="Question"
                  onChange={(e) => updateField(index, { label: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <CFormSelect
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="file">File upload</option>
                </CFormSelect>
              </div>
              <div className="col-md-3 d-flex align-items-center">
                <CFormCheck
                  label="Required"
                  checked={Boolean(field.required)}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                />
              </div>
              {field.type !== "file" ? (
                <div className="col-12">
                  <CFormInput
                    value={field.placeholder || ""}
                    placeholder="Placeholder (optional)"
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                  />
                </div>
              ) : (
                <div className="col-12 small text-body-secondary">
                  Images, PDF, Word, Excel, or text. 10 MB max.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <CButton
        color="secondary"
        variant="outline"
        className="mb-4"
        onClick={() => setFields((prev) => [...prev, emptyField()])}
      >
        Add field
      </CButton>

      <div className="d-flex gap-2 flex-wrap">
        <CButton color="primary" disabled={saving} onClick={() => save(false)}>
          {saving ? "Saving…" : "Save"}
        </CButton>
        <CButton color="success" disabled={saving} onClick={() => save(true)}>
          {saving ? "Saving…" : "Save and publish"}
        </CButton>
      </div>
    </div>
  );
};

export default SurveyBuilder;
