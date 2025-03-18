import React from "react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilArrowRight } from "@coreui/icons";
import { CRow, CCol, CButton, CFormInput, CInputGroup } from "@coreui/react";

const PaginateInput = ({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  pageInput,
  handlePageChange,
  handlePageInputChange,
  handlePageInputSubmit,
}) => {
  return (
    <CRow className="mt-3">
      <CCol className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
        {/* Prev Button */}
        <CButton
          color="secondary"
          className=""
          disabled={!hasPrevPage}
          onClick={() => handlePageChange(page - 1)}
          size="sm"
        >
          <CIcon color="dark" icon={cilArrowLeft} />
        </CButton>

        {/* Page Number Buttons */}
        {Array.from({ length: totalPages }, (_, i) => (
          <CButton
            key={i + 1}
            color={page === i + 1 ? "primary" : "light"}
            onClick={() => handlePageChange(i + 1)}
            className="px-3"
            size="sm"
          >
            {i + 1}
          </CButton>
        ))}

        {/* Next Button */}
        <CButton
          color="secondary"
          disabled={!hasNextPage}
          onClick={() => handlePageChange(page + 1)}
          size="sm"
        >
          <CIcon color="dark" icon={cilArrowRight} />
        </CButton>

        <div className="d-flex justify-content-center align-itmes-center">
          <CInputGroup className="" style={{ width: "100px" }}>
            <CFormInput
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              placeholder="page no."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handlePageInputSubmit();
                }
              }}
              className="text-start p-1"
            />
            <CButton
              size="sm"
              color="secondary"
              style={{ width: "30px" }}
              onClick={handlePageInputSubmit}
            >
              <CIcon icon={cilArrowRight} />
            </CButton>
          </CInputGroup>
        </div>
      </CCol>
    </CRow>
  );
};

export default PaginateInput;
