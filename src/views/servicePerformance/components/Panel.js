import React from "react";

export function NotAuthorized({ message, detail }) {
  return (
    <div className="sp-notice sp-notice--red" role="alert">
      <strong>Not authorized:</strong> {message}
      {detail && <div className="sp-small sp-mono mt-1">{detail}</div>}
    </div>
  );
}

export function Skeleton({ lines = 4 }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="sp-skeleton" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  if (error?.status === 403) return <NotAuthorized message={error.message} detail={error.detail} />;
  return (
    <div className="sp-notice sp-notice--red" role="alert">
      <strong>Error:</strong> {error?.message}{" "}
      {onRetry && (
        <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={onRetry}>
          Try again
        </button>
      )}
      {error?.detail && <div className="sp-small sp-mono mt-1">{error.detail}</div>}
    </div>
  );
}

/** White card with built-in loading, error and empty states. */
export default function Panel({ title, subtitle, actions, loading, error, onRetry, empty, emptyText = "Nothing recorded for this period.", children, lines }) {
  let body = children;
  if (loading) body = <Skeleton lines={lines} />;
  else if (error) body = <ErrorState error={error} onRetry={onRetry} />;
  else if (empty) body = <div className="sp-muted sp-small py-3">{emptyText}</div>;
  return (
    <section className="sp-card" aria-label={typeof title === "string" ? title : undefined}>
      {(title || actions) && (
        <div className="sp-card-head">
          <div>
            {title && <h2 className="sp-card-title">{title}</h2>}
            {subtitle && <div className="sp-small sp-muted">{subtitle}</div>}
          </div>
          {actions}
        </div>
      )}
      {body}
    </section>
  );
}
