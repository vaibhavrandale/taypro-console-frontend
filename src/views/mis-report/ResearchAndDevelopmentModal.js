import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormTextarea,
  CRow,
  CCol,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import LoadingSpinner from "../../components/LoadingSpinner";

const ResearchAndDevelopmentModal = ({
  visible,
  onClose,
  data,
  onSave,
  loading,
  success,
  error,
}) => {
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      size="xl"
      backdrop="static"
      scrollable
    >
      <CModalHeader className="bg-indigo-600 text-white" closeButton={false}>
        <CModalTitle>Edit Research & Development Data</CModalTitle>{" "}
        {error && <span className="text-danger ms-3">Error: {error}</span>}
        {success && <span className="text-success ms-3">{success}</span>}
        <button
          type="button"
          className=" border-0 ms-auto py-0 px-1"
          // onClick={() => setModalVisible(false)}
          onClose={onClose}
          style={{ background: "none" }}
        >
          <CIcon icon={cilX} size="lg" />
        </button>
      </CModalHeader>

      <CModalBody className="bg-gray-950 text-gray-100 max-h-[80vh] overflow-y-auto">
        <CRow className="g-4">
          {Object.entries(formData || {}).map(([key, value]) => {
            if (
              typeof value === "object" &&
              value !== null &&
              "current_month" in value
            ) {
              return (
                <CCol key={key} xs={12} md={6} className="mb-4">
                  <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
                    <h6 className="text-indigo-400 font-semibold mb-3 capitalize">
                      {key.replaceAll("_", " ")}
                    </h6>

                    <CFormInput
                      type="number"
                      label="Current Month"
                      value={value.current_month ?? ""}
                      onChange={(e) =>
                        handleChange(key, "current_month", e.target.value)
                      }
                      className="mb-3 bg-gray-800 text-white border-gray-700"
                    />

                    <CFormInput
                      type="number"
                      label="FYTD"
                      value={value.fy_td ?? ""}
                      onChange={(e) =>
                        handleChange(key, "fy_td", e.target.value)
                      }
                      className="mb-3 bg-gray-800 text-white border-gray-700"
                    />

                    <CFormTextarea
                      label="Remarks"
                      rows={2}
                      value={value.Remarks ?? ""}
                      onChange={(e) =>
                        handleChange(key, "Remarks", e.target.value)
                      }
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                </CCol>
              );
            }
            return null;
          })}
        </CRow>
        <CFormCheck
          id="isFilled"
          label="Mark report as filled"
          checked={formData.is_filled}
          onChange={(e) =>
            setFormData({ ...formData, is_filled: e.target.checked })
          }
        />
      </CModalBody>

      <CModalFooter className="bg-gray-900 border-gray-800">
        <CButton color="primary" size="sm" onClick={handleSubmit}>
          {loading ? <LoadingSpinner /> : "Save Changes"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ResearchAndDevelopmentModal;
