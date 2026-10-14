import React, { useState } from "react";
import { CButton, CFormLabel, CFormSelect, CFormTextarea } from "@coreui/react";

/**
 * Sets or changes a ticket's delay reason. Codes come from the active
 * configuration; no free-text reason code is possible.
 */
export default function DelayReasonForm({ ticketId, reasons, onSave, disabledReason, initialCode = "", initialRemarks = "" }) {
  const [code, setCode] = useState(initialCode);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const options = (reasons || []).filter((reason) => reason.enabled !== false);
  const id = `sp-reason-${ticketId}`;

  const submit = async (event) => {
    event.preventDefault();
    if (!code) return;
    setSaving(true);
    setError("");
    try {
      await onSave({ delay_reason_code: code, delay_reason_remarks: remarks.trim() });
    } catch (err) {
      setError(err?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} aria-label={`Delay reason for ${ticketId}`}>
      <CFormLabel htmlFor={id}>Delay reason</CFormLabel>
      <CFormSelect id={id} value={code} onChange={(e) => setCode(e.target.value)} disabled={Boolean(disabledReason)} required>
        <option value="">Select a reason</option>
        {options.map((reason) => (
          <option key={reason.code} value={reason.code}>
            {reason.label || reason.code}
          </option>
        ))}
      </CFormSelect>
      <CFormLabel htmlFor={`${id}-remarks`} className="mt-2">
        Remarks (optional)
      </CFormLabel>
      <CFormTextarea id={`${id}-remarks`} rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} disabled={Boolean(disabledReason)} />
      {disabledReason && <div className="sp-notice mt-2">{disabledReason}</div>}
      {error && (
        <div className="sp-notice sp-notice--red mt-2" role="alert">
          {error}
        </div>
      )}
      <CButton type="submit" color="success" className="mt-2" disabled={!code || saving || Boolean(disabledReason)}>
        {saving ? "Saving…" : "Save"}
      </CButton>
    </form>
  );
}
