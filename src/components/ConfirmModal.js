// ConfirmModal.jsx
import React from "react";
import { CModal, CModalBody, CModalFooter, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilWarning } from "@coreui/icons";

const ConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  confirmColor = "danger",
  loading = false,
}) => {
  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop="static"
      size="sm"
    >
      <div
        className="bg-dark text-white rounded"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <CModalBody className="px-4 pt-4 pb-3">
          {/* Icon */}
          <div className="d-flex justify-content-center mb-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 border border-danger border-opacity-25"
              style={{ width: 52, height: 52 }}
            >
              <CIcon icon={cilWarning} className="text-danger" size="lg" />
            </div>
          </div>

          {/* Title */}
          <p
            className="text-center fw-bold text-white mb-1"
            style={{ fontSize: 15 }}
          >
            {title}
          </p>

          {/* Message */}
          {message && (
            <p
              className="text-center   mb-0"
              dangerouslySetInnerHTML={{
                __html: message,
              }}
            />
          )}
        </CModalBody>

        <CModalFooter className="border-0 px-4 pb-4 pt-1 d-flex gap-2 justify-content-center">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="px-3"
          >
            Cancel
          </CButton>
          <CButton
            color={confirmColor}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="px-3"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Sending...
              </>
            ) : (
              confirmLabel
            )}
          </CButton>
        </CModalFooter>
      </div>
    </CModal>
  );
};

export default ConfirmModal;
