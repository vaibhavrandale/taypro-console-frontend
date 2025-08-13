import React, { useEffect, useReducer, useState } from "react";
import { CRow, CCol } from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import TayproDarkBgLogo from "../../../assets/brand/logofordarkbg.png";
import TayproWhiteBgLogo from "../../../assets/brand/logoforwhitebg.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const exportToPdf = async () => {
    try {
      setLoadingPdf(true);

      const input = document.querySelector(".table-responsive");
      if (!input) {
        toast.error("Table not found for export");
        setLoadingPdf(false);
        return;
      }

      // Clone the table so we don't modify the page
      const clone = input.cloneNode(true);

      // Change logo in clone
      const logo = clone.querySelector("img");
      if (logo) logo.src = TayproWhiteBgLogo;

      // Apply white bg + dark text to clone
      clone.setAttribute(
        "style",
        `background-color: white !important;
         color: #000 !important;
         border: 1px solid #000 !important;`
      );
      clone.querySelectorAll("table, th, td").forEach((el) => {
        el.style.backgroundColor = "white";
        el.style.color = "#000";
        el.style.border = "1px solid #000";
      });
      // Special style for the header row with id="cycle-head"

      // Special style for the header row with id="cycle-head"
      const cycleHead = clone.querySelector("#cycle-head");
      if (cycleHead) {
        cycleHead.style.backgroundColor = "rgb(217, 217, 217)";
        cycleHead.style.color = "#000";
        cycleHead.style.fontWeight = "bold";
        cycleHead.style.borderLeft = "1px solid #000";
        cycleHead.style.borderRight = "1px solid #000";
        cycleHead.style.borderTop = "none";
        cycleHead.style.borderBottom = "none";
      }

      // Put clone off-screen so html2canvas can read it
      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);

      // Capture the CLONE
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
      });

      // Remove clone from DOM
      document.body.removeChild(clone);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 5;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `Opex_Certificate_${certificate.certificate_month}_${certificate.certificate_year}.pdf`
      );

      setLoadingPdf(false);
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF");
      setLoadingPdf(false);
    }
  };

  return (
    <div>
      <CRow>
        {certificateLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <CCol>
            <h4 className="text-center my-1">
              <span className="text-success">
                {new Date(certificate.certificate_month - 1).toLocaleString(
                  "en-US",
                  { month: "long" }
                )}
                &nbsp;{certificate.certificate_year}&nbsp;
              </span>
              - Cleaning Certificate
            </h4>

            <>
              <div className="d-flex justify-content-end mb-3">
                <Link
                  className="btn btn-sm btn-primary m-1"
                  onClick={() => exportToPdf(certificate)}
                >
                  {loadingPdf ? <LoadingSpinner size="sm" /> : "Export PDF"}
                </Link>
              </div>

              <div className="table-responsive  p-2">
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    border: "0.5px solid white",
                  }}
                >
                  <thead>
                    <tr>
                      <td
                        rowSpan={2}
                        style={{
                          border: "0.5px solid white",
                          textAlign: "center",
                          padding: "5px",
                          width: "200px",
                        }}
                      >
                        <img
                          src={TayproDarkBgLogo}
                          className="logo"
                          alt="Taypro Logo"
                          style={{ height: "50px" }}
                        />
                      </td>
                      <td
                        rowSpan={2}
                        colSpan={3}
                        style={{
                          border: "0.5px solid white",
                          textAlign: "center",
                          fontSize: "20px",
                        }}
                      >
                        MONTHLY CLEANING CYCLE CERTIFICATION
                      </td>
                      <td
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Doc. No.
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        {certificate.doc_no || "N/A"}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Prepared By
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        {certificate.prepared_by || "N/A"}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Project - {certificate.project_name || "N/A"}
                      </td>
                      <td
                        colSpan={2}
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Date -{" "}
                        {new Date(
                          0,
                          certificate.certificate_month - 1
                        ).toLocaleString("en-US", { month: "long" })}{" "}
                        {certificate.certificate_year}
                      </td>
                      <td
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Approved By
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        {certificate.approved_by || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Site Capacity - 50 MW
                      </td>
                      <td
                        colSpan={2}
                        style={{ border: "0.5px solid white" }}
                      ></td>
                      <td
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Rev.
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        {certificate.revision || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        style={{ border: "0.5px solid white" }}
                      ></td>
                      <td
                        style={{
                          border: "0.5px solid white",

                          padding: "5px",
                        }}
                      >
                        Project Type
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        {certificate.project_type || "N/A"}
                      </td>
                    </tr>
                  </thead>
                </table>
                <table
                  style={{
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    borderRight: "0.5px solid white",
                    borderBottom: "0.5px solid white",
                  }}
                >
                  <thead>
                    <tr
                      id="cycle-head"
                      style={{ backgroundColor: "#d9d9d9", color: "#000" }}
                    >
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        Sr No.
                      </th>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          width: "150px",
                        }}
                      >
                        Start Date
                      </th>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          width: "150px",
                        }}
                      >
                        End Date
                      </th>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          width: "150px",
                        }}
                      >
                        Module
                      </th>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          width: "150px",
                        }}
                      >
                        Cleaning Cycle No
                      </th>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        Project Incharge Sign
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificateLoading ? (
                      <LoadingSpinner />
                    ) : certificate.cycles?.length > 0 ? (
                      <>
                        {certificate.cycles.map((cycle, index) => (
                          <tr key={index} style={{ textAlign: "center" }}>
                            <td
                              style={{
                                border: "0.5px solid white",
                                padding: "10px",
                                width: "50px",
                              }}
                            >
                              {index + 1}
                            </td>
                            <td
                              style={{
                                border: "0.5px solid white",
                                padding: "5px",
                              }}
                            >
                              {cycle.cycle_start_date
                                ? cycle.cycle_start_date.slice(0, 10)
                                : "N/A"}
                            </td>
                            <td
                              style={{
                                border: "0.5px solid white",
                                padding: "5px",
                              }}
                            >
                              {cycle.cycle_end_date
                                ? cycle.cycle_end_date.slice(0, 10)
                                : "N/A"}
                            </td>
                            <td
                              style={{
                                border: "0.5px solid white",
                                padding: "5px",
                              }}
                            >
                              {cycle.cycle_module_count}
                            </td>
                            <td
                              style={{
                                border: "0.5px solid white",
                                padding: "5px",
                              }}
                            >
                              {cycle.cycle_number}
                            </td>
                            <td
                              style={{
                                border: "0.5px solid white",
                                padding: "5px",
                              }}
                            >
                              {cycle.projectInchargeSign ? (
                                <img
                                  src={cycle.projectInchargeSign}
                                  alt="Signature"
                                  style={{ height: "30px" }}
                                />
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <span style={{ textAlign: "center" }}>No Data Found</span>
                    )}
                  </tbody>
                </table>
                {/* <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    border: "0.5px solid white",
                  }}
                >
                  <thead>
                    <tr style={{ fontWeight: "bold" }}>
                      <th
                        colSpan={2}
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        Total Module Cleaned
                      </th>
                      <th
                        colSpan={2}
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "left",
                        }}
                      >
                        1069376
                      </th>
                    </tr>
                    <tr
                      style={{ backgroundColor: "#d9d9d9", fontWeight: "bold" }}
                    >
                      <th
                        colSpan={2}
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          color: "#000",
                        }}
                      >
                        For Client
                      </th>
                      <th
                        colSpan={2}
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          color: "#000",
                        }}
                      >
                        For TAYPRO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          width: "15%",
                        }}
                      >
                        Name
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      ></td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Sign
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        <img
                          src="signature.png" // replace with actual signature image path
                          alt="Signature"
                          style={{ height: "40px" }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Sign
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      ></td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Name
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Abhay Singh
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Designation
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      ></td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Designation
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Asst. Service Manager
                      </td>
                    </tr>
                  </tbody>
                </table> */}
                <table
                  style={{
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    borderRight: "0.5px solid white",
                    borderBottom: "0.5px solid white",
                  }}
                >
                  <thead>
                    {/* Total Module Cleaned Row */}
                    <tr style={{ fontWeight: "bold" }}>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          width: "50%",
                        }}
                      >
                        Total Module Cleaned
                      </th>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          width: "50%",
                        }}
                      >
                        {certificate.total_modules_cleaned}
                      </th>
                    </tr>

                    {/* Section Headers */}
                    <tr
                      style={{ backgroundColor: "#d9d9d9", fontWeight: "bold" }}
                    >
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          color: "#000",
                          width: "50%",
                        }}
                      >
                        For Client
                      </th>
                      <th
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          textAlign: "center",
                          color: "#000",
                          width: "50%",
                        }}
                      >
                        For TAYPRO
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "0.5px solid white",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Name <span style={{ marginLeft: "60px" }}>:</span>
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Name
                        <span style={{ marginLeft: "60px" }}>
                          : {certificate.taypro_name}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "0.5px solid white",
                          padding: "15px 5px",
                        }}
                      >
                        Sign
                        <span style={{ marginLeft: "70px" }}>
                          :
                          {/* <img
                            src={TayproLogo}
                            alt="Taypro Logo"
                            style={{ height: "40px" }}
                          /> */}
                        </span>
                      </td>
                      <td
                        style={{
                          border: "0.5px solid white",
                          padding: "15px 5px",
                        }}
                      >
                        Sign
                        <span style={{ marginLeft: "70px" }}>
                          :
                          <img
                            // src="https://res.cloudinary.com/decyim6cd/image/upload/v1755000739/profile-image/giwgwsgzvkcrdszr6luz.jpg"
                            src={certificate.taypro_sign}
                            alt="Taypro Sign"
                            style={{ height: "40px", marginLeft: "20px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Designation
                        <span style={{ marginLeft: "25px" }}>:</span>
                      </td>
                      <td
                        style={{ border: "0.5px solid white", padding: "5px" }}
                      >
                        Designation
                        <span style={{ marginLeft: "25px" }}>
                          : {certificate.taypro_designation}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          </CCol>
        )}
      </CRow>
    </div>
  );
};

export default OpexCertificate;
