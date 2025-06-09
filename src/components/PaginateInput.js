import React from "react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilArrowRight } from "@coreui/icons";
import {
  CRow,
  CCol,
  CButton,
  CFormInput,
  CInputGroup,
  CFormSelect,
} from "@coreui/react";

const PaginateInput = ({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  pageInput,
  handlePageChange,
  handlePageInputChange,
  handlePageInputSubmit,
  limit,
  handleLimitChange, // New prop for handling limit change
}) => {
  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => (
        <CButton
          key={i + 1}
          color={page === i + 1 ? "primary" : "light"}
          onClick={() => handlePageChange(i + 1)}
          className="px-3"
          size="sm"
        >
          {i + 1}
        </CButton>
      ));
    }

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (startPage === 1) {
      endPage = 5;
    } else if (endPage === totalPages) {
      startPage = totalPages - 4;
    }

    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <CButton
          key={i}
          color={page === i ? "primary" : "light"}
          onClick={() => handlePageChange(i)}
          className="px-3"
          size="sm"
        >
          {i}
        </CButton>
      );
    }

    return pages;
  };

  return (
    <CRow className="mt-3">
      <CCol className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
        {/* Prev Button */}
        <CButton
          color="secondary"
          disabled={!hasPrevPage}
          onClick={() => handlePageChange(page - 1)}
          size="sm"
        >
          <CIcon color="dark" icon={cilArrowLeft} />
        </CButton>

        {renderPageNumbers()}

        {/* Next Button */}
        <CButton
          color="secondary"
          disabled={!hasNextPage}
          onClick={() => handlePageChange(page + 1)}
          size="sm"
        >
          <CIcon color="dark" icon={cilArrowRight} />
        </CButton>

        {/* Page Number Input */}
        <CInputGroup className="" style={{ width: "100px" }}>
          <CFormInput
            type="number"
            value={pageInput}
            onChange={handlePageInputChange}
            placeholder="Page no."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePageInputSubmit();
              }
            }}
            className="text-start p-1"
          />
          <CButton size="sm" color="secondary" onClick={handlePageInputSubmit}>
            <CIcon icon={cilArrowRight} />
          </CButton>
        </CInputGroup>

        {/* Page Limit Dropdown */}
        <CFormSelect
          value={limit}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
          size="sm"
          style={{ width: "80px" }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
          <option value={60}>60</option>
          <option value={70}>70</option>
          <option value={80}>80</option>
          <option value={90}>90</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={300}>300</option>
          <option value={400}>400</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
          <option value={2000}>2000</option>
          <option value={3000}>3000</option>
          <option value={6000}>6000</option>
          <option value={9000}>9000</option>
          <option value={10000}>10000</option>
          <option value={100000}>100000</option>
        </CFormSelect>
      </CCol>
    </CRow>
  );
};

export default PaginateInput;
