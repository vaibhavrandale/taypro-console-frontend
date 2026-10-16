import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CSpinner } from "@coreui/react";
import Tayprofordarkbg from "../../assets/brand/logofordarkbg.png";
import { surveyDevice } from "./deviceSignature";

const shell = {
  minHeight: "100vh",
  background: "#0e1116",
  color: "#e8edf2",
};

const card = {
  background: "#171b22",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

const inputStyle = {
  width: "100%",
  background: "#0e1116",
  color: "#e8edf2",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 10,
  padding: "12px 14px",
  outline: "none",
};

const SurveyPublic = () => {
  const { slug } = useParams();
  const device = useMemo(() => surveyDevice(), []);
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const path = slug
        ? `/api/v1/surveys/public/${slug}`
        : "/api/v1/surveys/public/latest";
      const { data } = await axios.get(path, {
        withCredentials: true,
        headers: { "x-survey-client": device.clientId },
      });
      setForm(data.data);
      setDone(Boolean(data.data?.alreadySubmitted));
    } catch (err) {
      setForm(null);
      setError(err.response?.data?.message || "Could not load this survey");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // device id is stable for this browser
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form?.slug || submitting) return;
    setSubmitting(true);
    setFieldErrors({});
    setError("");
    try {
      const body = new FormData();
      body.append("device", JSON.stringify(device));
      body.append("answers", JSON.stringify(values));
      Object.entries(files).forEach(([key, file]) => {
        if (file) body.append(key, file);
      });
      await axios.post(`/api/v1/surveys/public/${form.slug}/submit`, body, {
        withCredentials: true,
        headers: { "x-survey-client": device.clientId },
      });
      setJustSent(true);
      setDone(true);
    } catch (err) {
      const payload = err.response?.data;
      if (err.response?.status === 409) {
        setDone(true);
        return;
      }
      setFieldErrors(payload?.errors || {});
      setError(payload?.message || "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={shell}>
      <div className="container py-4 py-md-5" style={{ maxWidth: 720 }}>
        <div className="d-flex align-items-center gap-2 mb-4">
          <img src={Tayprofordarkbg} alt="Taypro" style={{ height: 34 }} />
          <div>
            <div className="fw-semibold">Survey</div>
            <div style={{ color: "#9aa3af", fontSize: 12 }}>Open response form</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5" style={card}>
            <CSpinner color="light" />
            <div className="mt-3" style={{ color: "#9aa3af" }}>
              Loading survey…
            </div>
          </div>
        ) : null}

        {!loading && error && !form ? (
          <div className="p-4 text-center" style={card}>
            <div className="fw-semibold mb-2">{error}</div>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={load}>
              Try again
            </button>
          </div>
        ) : null}

        {!loading && form && (done || form.alreadySubmitted) ? (
          <div className="p-4 p-md-5 text-center" style={card}>
            <div className="fw-semibold fs-5 mb-2">
              {justSent ? "Response recorded" : "Response already recorded"}
            </div>
            <p className="mb-0" style={{ color: "#9aa3af" }}>
              {justSent
                ? "Thanks. This device cannot submit this survey again."
                : `This device has submitted ${form.title}. A second response is not accepted.`}
            </p>
          </div>
        ) : null}

        {!loading && form && !done && !form.alreadySubmitted && form.closed ? (
          <div className="p-4 p-md-5 text-center" style={card}>
            <div className="fw-semibold fs-5 mb-2">{form.title}</div>
            <p className="mb-0" style={{ color: "#9aa3af" }}>
              This survey is closed.
            </p>
          </div>
        ) : null}

        {!loading && form && !done && !form.alreadySubmitted && !form.closed ? (
          <form onSubmit={onSubmit} className="p-3 p-md-4" style={card}>
            <h1 className="h4 fw-semibold mb-2">{form.title}</h1>
            {form.description ? (
              <p className="mb-4" style={{ color: "#c5ced6", whiteSpace: "pre-wrap" }}>
                {form.description}
              </p>
            ) : null}

            {error ? (
              <div
                className="mb-3 px-3 py-2"
                style={{
                  background: "rgba(220, 53, 69, 0.15)",
                  border: "1px solid rgba(220, 53, 69, 0.45)",
                  borderRadius: 10,
                }}
              >
                {error}
              </div>
            ) : null}

            <div className="d-flex flex-column gap-3">
              {(form.fields || []).map((field) => (
                <label key={field.key} className="d-flex flex-column gap-1">
                  <span className="fw-semibold">
                    {field.label}
                    {field.required ? <span style={{ color: "#ff8b8b" }}> *</span> : null}
                  </span>
                  {field.type === "text" ? (
                    <textarea
                      rows={3}
                      value={values[field.key] || ""}
                      placeholder={field.placeholder || ""}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      style={inputStyle}
                    />
                  ) : null}
                  {field.type === "number" ? (
                    <input
                      type="number"
                      inputMode="decimal"
                      value={values[field.key] ?? ""}
                      placeholder={field.placeholder || ""}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      style={inputStyle}
                    />
                  ) : null}
                  {field.type === "file" ? (
                    <input
                      type="file"
                      accept="image/*,.pdf,.txt,.csv,.xls,.xlsx,.doc,.docx"
                      onChange={(e) =>
                        setFiles((prev) => ({
                          ...prev,
                          [field.key]: e.target.files?.[0] || null,
                        }))
                      }
                      style={{ ...inputStyle, padding: "10px 12px" }}
                    />
                  ) : null}
                  {fieldErrors[field.key] ? (
                    <span style={{ color: "#ff8b8b", fontSize: 13 }}>
                      {fieldErrors[field.key]}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 mt-4"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit response"}
            </button>
            <div className="text-center mt-3" style={{ color: "#9aa3af", fontSize: 12 }}>
              One response per device. No sign-in required.
            </div>
          </form>
        ) : null}

        <div className="text-center mt-4">
          <Link to="/login" style={{ color: "#9aa3af", fontSize: 13 }}>
            Console login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SurveyPublic;
