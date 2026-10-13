import React from "react";
import { CFormSelect, CPagination, CPaginationItem } from "@coreui/react";

/** Server-driven pagination. The backend caps limit at 100. */
export default function Pager({ page, limit, total, onPage, onLimit, label = "Pages" }) {
  const pages = Math.max(1, Math.ceil((total || 0) / limit));
  if (!total) return null;
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const numbers = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  return (
    <div className="d-flex align-items-center gap-3 flex-wrap mt-2">
      <CPagination aria-label={label} className="mb-0">
        <CPaginationItem as="button" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
          ‹
        </CPaginationItem>
        {numbers.map((n) => (
          <CPaginationItem as="button" key={n} active={n === page} onClick={() => onPage(n)} aria-current={n === page ? "page" : undefined}>
            {n}
          </CPaginationItem>
        ))}
        <CPaginationItem as="button" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">
          ›
        </CPaginationItem>
      </CPagination>
      <span className="sp-small sp-muted">
        {total} rows · page {page} of {pages}
      </span>
      {onLimit && (
        <CFormSelect size="sm" style={{ width: 90 }} value={limit} onChange={(e) => onLimit(Number(e.target.value))} aria-label="Rows per page">
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </CFormSelect>
      )}
    </div>
  );
}
