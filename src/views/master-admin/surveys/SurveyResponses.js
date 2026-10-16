import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CButton,
  CFormInput,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { surveyBase } from "./surveyPaths";

const formatWhen = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const answerText = (answer) => {
  if (!answer) return "—";
  if (answer.type === "file") {
    if (!answer.file?.url) return "—";
    return (
      <a href={answer.file.url} target="_blank" rel="noreferrer">
        {answer.file.name || "Open file"}
      </a>
    );
  }
  if (answer.type === "number") {
    return answer.number === null || answer.number === undefined ? "—" : String(answer.number);
  }
  return answer.text || "—";
};

const deviceText = (device) =>
  [device?.platform, device?.screen, device?.timezone].filter(Boolean).join(" · ") || "—";

const SurveyResponses = () => {
  const { id } = useParams();
  const role = useSelector((s) => s.userInfo?.role);
  const base = surveyBase(role);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [survey, setSurvey] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");

  const fields = [...(survey?.fields || [])].sort((a, b) => a.order - b.order);

  const load = async (nextPage = page, query = search) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`/api/v1/surveys/${id}/responses`, {
        params: { page: nextPage, q: query || undefined },
        withCredentials: true,
      });
      setSurvey(data.data.survey);
      setRows(data.data.responses || []);
      setTotal(data.data.pagination?.total || 0);
      setPage(data.data.pagination?.page || nextPage);
      setLimit(data.data.pagination?.limit || 50);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load responses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const runSearch = () => {
    const next = q.trim();
    setSearch(next);
    load(1, next);
  };

  const exportExcel = async () => {
    try {
      setExporting(true);
      const res = await axios.get(`/api/v1/surveys/${id}/responses/export`, {
        params: { q: search || undefined },
        responseType: "blob",
        withCredentials: true,
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const header = res.headers["content-disposition"] || "";
      const named = /filename="?([^"]+)"?/.exec(header);
      link.href = url;
      link.download = named?.[1] || "survey-responses.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      let message = "Could not export responses";
      const data = err.response?.data;
      if (data instanceof Blob) {
        try {
          message = JSON.parse(await data.text()).message || message;
        } catch {
          /* keep default */
        }
      }
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
        <div>
          <h4 className="mb-1">{survey?.title || "Responses"}</h4>
          <div className="small text-body-secondary">
            {total} response{total === 1 ? "" : "s"}
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <CFormInput
            size="sm"
            placeholder="Search answers, files, device"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            style={{ width: 260 }}
          />
          <CButton color="secondary" size="sm" onClick={runSearch}>
            Search
          </CButton>
          <CButton
            color="success"
            size="sm"
            disabled={exporting || total === 0}
            onClick={exportExcel}
          >
            {exporting ? "Exporting…" : "Export Excel"}
          </CButton>
          <Link className="btn btn-outline-secondary btn-sm" to={base}>
            Back to surveys
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-5 text-center">
          <CSpinner />
          <div className="small text-body-secondary mt-2">Loading responses…</div>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="border rounded p-4 text-center">
          <div className="mb-2">{error}</div>
          <CButton color="secondary" size="sm" onClick={() => load(page, search)}>
            Try again
          </CButton>
        </div>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <div className="border rounded p-5 text-center text-body-secondary">
          {search
            ? "No responses match that search."
            : "No responses yet. Share the public link after the survey is published."}
        </div>
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <CTable hover bordered responsive align="middle">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: 56 }}>#</CTableHeaderCell>
              {fields.map((field) => (
                <CTableHeaderCell key={field.key}>{field.label}</CTableHeaderCell>
              ))}
              <CTableHeaderCell>Device</CTableHeaderCell>
              <CTableHeaderCell className="text-nowrap">Submitted</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rows.map((row, index) => {
              const byKey = new Map((row.answers || []).map((answer) => [answer.key, answer]));
              return (
                <CTableRow key={row._id}>
                  <CTableDataCell>{(page - 1) * limit + index + 1}</CTableDataCell>
                  {fields.map((field) => (
                    <CTableDataCell key={field.key}>{answerText(byKey.get(field.key))}</CTableDataCell>
                  ))}
                  <CTableDataCell className="small">{deviceText(row.device)}</CTableDataCell>
                  <CTableDataCell className="text-nowrap small">
                    {formatWhen(row.createdAt)}
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      ) : null}

      {!loading && !error && pages > 1 ? (
        <div className="d-flex gap-2 align-items-center">
          <CButton size="sm" color="secondary" disabled={page <= 1} onClick={() => load(page - 1, search)}>
            Previous
          </CButton>
          <span className="small text-body-secondary">
            Page {page} of {pages}
          </span>
          <CButton
            size="sm"
            color="secondary"
            disabled={page >= pages}
            onClick={() => load(page + 1, search)}
          >
            Next
          </CButton>
        </div>
      ) : null}
    </div>
  );
};

export default SurveyResponses;
