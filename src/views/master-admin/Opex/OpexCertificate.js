import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import TayproLogo from "../../../assets/brand/logofordarkbg.png";
import WhiteTayproLogo from "../../../assets/brand/logoforwhitebg.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CERTIFICATE_REQUEST":
      return {
        ...state,
        certificateLoading: true,
        certificateError: "",
        certificate: [],
      };
    case "FETCH_CERTIFICATE_SUCCESS":
      return {
        ...state,
        certificateLoading: false,
        certificate: action.payload,
      };
    case "FETCH_CERTIFICATE_FAIL":
      return {
        ...state,
        certificateLoading: false,
        certificateError: action.payload,
      };

    default:
      return state;
  }
};

const OpexCertificate = () => {
  const [{ certificate, certificateLoading }, dispatch] = useReducer(reducer, {
    certificate: [],
    certificateLoading: true,
    certificateError: "",
  });

  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    const fetchOpexCertificate = async () => {
      dispatch({ type: "FETCH_CERTIFICATE_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/opex/get-opex-certificate/${id}`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_CERTIFICATE_SUCCESS",
          payload: result.data.data,
        });
      } catch (certificateError) {
        dispatch({
          type: "FETCH_CERTIFICATE_FAIL",
          payload:
            certificateError.response.data.certificateError ||
            certificateError.response.data.message,
        });
        toast.certificateError(
          certificateError.response.data.certificateError ||
            certificateError.response.data.message
        );
      }
    };
    fetchOpexCertificate();
  }, [authtoken, id]);

  const exportToPdf = async (certificate) => {
    try {
      setLoadingPdf(true);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const doc = new jsPDF("p", "pt", "a4");
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      const bodyRows = [];

      // Row 1: Logo + Title
      bodyRows.push([
        {
          content: "", // Logo placeholder
          styles: { cellWidth: 120, halign: "center", minCellHeight: 50 },
        },
        {
          content: "MONTHLY CLEANING CYCLE CERTIFICATION",
          colSpan: 5,
          styles: { halign: "center", fontStyle: "bold", fontSize: 14 },
        },
      ]);

      // Row 2: Project Info
      bodyRows.push([
        { content: `Project Name: ` },
        {
          content: `${certificate.project_name || ""}`,
          styles: { fontStyle: "bold" },
        },
        { content: `Site Capacity: ` },
        {
          content: `${certificate.site_capacity || ""}`,
          styles: { fontStyle: "bold" },
        },
        { content: `Date: ` },
        {
          content: `${new Date(
            0,
            certificate.certificate_month - 1
          ).toLocaleString("en-US", { month: "long" })} - ${
            certificate.certificate_year || ""
          }`,
          styles: { fontStyle: "bold" },
        },
      ]);

      // Row 3: Approval and Meta Info
      bodyRows.push([
        { content: `Doc. No.: ` },
        {
          content: `${certificate.doc_no || ""}`,
          styles: { fontStyle: "bold" },
        },
        { content: `Prepared By: ` },
        {
          content: `${certificate.prepared_by || ""}`,
          styles: { fontStyle: "bold" },
        },
        { content: `Approved By: ` },
        { content: `TM-TPL`, styles: { fontStyle: "bold" } },
      ]);

      // Row 4: Rev. & Project Type
      bodyRows.push([
        { content: `Rev.: ` },
        { content: `A`, styles: { fontStyle: "bold" } },
        { content: `Project Type: ` },
        { content: `OPEX`, styles: { fontStyle: "bold" } },
        "",
        "",
      ]);

      // Header for cycles
      const cycleHeader = [
        "Sr No",
        "Start Date",
        "End Date",
        "Module",
        "Cleaning Cycle No",
        "Project Incharge Sign",
      ];
      bodyRows.push(cycleHeader);

      // Cycle data with Verified under Project Incharge Sign
      certificate.cycles.forEach((cycle, idx) => {
        bodyRows.push([
          idx + 1,
          formatDate(cycle.cycle_start_date) || "",
          formatDate(cycle.cycle_end_date) || "",
          cycle.cycle_module_count || "",
          cycle.cycle_number || "",
          "Verified",
        ]);
      });

      // Total row
      bodyRows.push([
        {
          content: "Total Module Cleaned",
          colSpan: 4,
          styles: { halign: "center", fontStyle: "bold" },
        },
        {
          content: certificate.total_modules_cleaned || "0",
          colSpan: 2,
          styles: { halign: "center", fontStyle: "bold" },
        },
      ]);
      // Draw the first table (main data)
      autoTable(doc, {
        head: [],
        body: bodyRows,
        theme: "grid",
        styles: {
          fontSize: 9,
          halign: "left",
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        didDrawCell: (data) => {
          if (data.row.index === 0 && data.column.index === 0) {
            doc.addImage(
              WhiteTayproLogo,
              "PNG",
              data.cell.x + 5,
              data.cell.y + 5,
              110,
              40
            );
          }
        },
        didParseCell: (data) => {
          if (data.row.index === 4) {
            data.cell.styles.fillColor = [220, 220, 220];
            data.cell.styles.textColor = [0, 0, 0];
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "center";
          }
        },
      });

      autoTable(doc, {
        head: [
          [
            {
              content: "For Client",
              colSpan: 2,
              styles: {
                halign: "center",
                fontStyle: "bold",
                fillColor: [220, 220, 220], // Light gray
                textColor: [0, 0, 0], // Dark text
              },
            },
            {
              content: "For TAYPRO",
              colSpan: 2,
              styles: {
                halign: "center",
                fontStyle: "bold",
                fillColor: [220, 220, 220], // Light gray
                textColor: [0, 0, 0], // Dark text
              },
            },
          ],
        ],
        body: [
          [
            { content: "Name:", styles: { fontStyle: "bold" } },
            { content: "             " },
            { content: "Name:", styles: { fontStyle: "bold" } },
            { content: "Abhay Singh" },
          ],
          [
            { content: "Sign:", styles: { fontStyle: "bold" } },
            { content: "             " },
            { content: "Sign:", styles: { fontStyle: "bold" } },
            { content: "Verified" },
          ],
          [
            { content: "Designation:", styles: { fontStyle: "bold" } },
            { content: "              " },
            { content: "Designation:", styles: { fontStyle: "bold" } },
            { content: "Ass. Service Manager" },
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 9,
          halign: "left",
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        columnStyles: {
          0: { cellWidth: "auto" }, // Auto adjust but equal space
          1: { cellWidth: "auto" },
          2: { cellWidth: "auto" },
          3: { cellWidth: "auto" },
        },
        tableWidth: "auto", // Ensures it spans full width like the table above
        startY: doc.lastAutoTable.finalY + 10,
      });

      doc.save(`Opex_Certificate_${certificate.project_name || "N_A"}.pdf`);

      setLoadingPdf(false);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div>
      <CRow>
        <CCol>
          <h2 className="text-center mt-4 mb-4">Opex Certificate Details</h2>
          {certificateLoading ? (
            <div
              style={{ height: "80vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-end mb-3">
                <Link
                  className="btn btn-sm btn-primary m-1"
                  onClick={() => exportToPdf(certificate)}
                >
                  {loadingPdf ? <LoadingSpinner size="sm" /> : "Export PDF"}
                </Link>
              </div>
              <div className="table-responsive">
                <CTable bordered hover>
                  <CTableHead>
                    {/* Top Row - Branding & Title */}
                    <CTableRow className="bg-dark text-white text-center">
                      <CTableHeaderCell>
                        <img
                          src={TayproLogo}
                          alt="Taypro Logo"
                          style={{
                            height: "60px",
                            width: "300px",
                            objectFit: "contain",
                          }}
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" colSpan={3}>
                        <h5 className="mb-0 ">
                          MONTHLY CLEANING CYCLE CERTIFICATION
                        </h5>
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ width: "120px" }}>
                        Doc. No.:{" "}
                        <span className="fw-bold">
                          {certificate.doc_no || "N/A"}
                        </span>
                      </CTableHeaderCell>

                      <CTableHeaderCell style={{ width: "120px" }}>
                        Prepared By:{" "}
                        <span className="fw-bold">
                          {" "}
                          {certificate.prepared_by || "N/A"}
                        </span>
                      </CTableHeaderCell>
                    </CTableRow>

                    <CTableRow className="bg-light text-center">
                      <CTableHeaderCell style={{ minWidth: "100px" }}>
                        Project:
                        <span className="fw-bold">
                          {certificate.project_name || "N/A"}{" "}
                        </span>
                      </CTableHeaderCell>

                      <CTableHeaderCell style={{ width: "180px" }}>
                        Site Capacity: <span className="fw-bold">50 MW</span>
                      </CTableHeaderCell>

                      <CTableHeaderCell style={{ width: "200px" }}>
                        Date:{" "}
                        <span className="fw-bold">
                          {" "}
                          {new Date(
                            0,
                            certificate.certificate_month - 1
                          ).toLocaleString("en-US", { month: "long" })}
                        </span>
                        -
                        <span className="fw-bold">
                          {certificate.certificate_year}
                        </span>
                      </CTableHeaderCell>

                      <CTableHeaderCell style={{ width: "100px" }}>
                        Rev. No.:
                        <span className="fw-bold">
                          {" "}
                          {certificate.revision || "N/A"}
                        </span>
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ width: "120px" }}>
                        Project Type:{" "}
                        <span className="fw-bold">
                          {" "}
                          {certificate.project_type || "N/A"}
                        </span>
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ width: "120px" }}>
                        Approved By:{" "}
                        <span className="fw-bold">
                          {" "}
                          {certificate.approved_by || "N/A"}
                        </span>
                      </CTableHeaderCell>
                    </CTableRow>

                    {/* Main Table Header */}
                    <CTableRow className="text-center">
                      <CTableHeaderCell className="bg-white text-dark">
                        Sr. No
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="bg-white text-dark"
                        style={{ width: "140px" }}
                      >
                        Start Date
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="bg-white text-dark"
                        style={{ width: "140px" }}
                      >
                        End Date
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="bg-white text-dark"
                        style={{ width: "160px" }}
                      >
                        Module
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="bg-white text-dark"
                        style={{ width: "180px" }}
                      >
                        Cleaning Cycle No.
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="bg-white text-dark"
                        style={{ width: "180px" }}
                      >
                        Project Incharge Sign
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {certificateLoading ? (
                      <LoadingSpinner />
                    ) : certificate.cycles?.length > 0 ? (
                      <>
                        {certificate.cycles.map((cycle, index) => (
                          <CTableRow key={index} className="text-center">
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>
                              {cycle.cycle_start_date
                                ? cycle.cycle_start_date.slice(0, 10)
                                : "N/A"}
                            </CTableDataCell>
                            <CTableDataCell>
                              {cycle.cycle_end_date
                                ? cycle.cycle_end_date.slice(0, 10)
                                : "N/A"}
                            </CTableDataCell>
                            <CTableDataCell>
                              {cycle.cycle_module_count}
                            </CTableDataCell>
                            <CTableDataCell>
                              {cycle.cycle_number}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CBadge color="success">Verified</CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        ))}

                        {/* Total Module Cleaned row */}
                        <CTableRow
                          className="fw-bold"
                          style={{ backgroundColor: "#f8f9fa" }}
                        >
                          <CTableDataCell
                            colSpan={4}
                            className="text-center"
                            style={{ padding: "15px" }}
                          >
                            Total Module Cleaned
                          </CTableDataCell>
                          <CTableDataCell
                            colSpan={2}
                            className="text-center"
                            style={{ padding: "15px" }}
                          >
                            {certificate.total_modules_cleaned}
                          </CTableDataCell>
                        </CTableRow>
                      </>
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={15} className="text-center">
                          <span className="badge bg-danger">No Data Found</span>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default OpexCertificate;
