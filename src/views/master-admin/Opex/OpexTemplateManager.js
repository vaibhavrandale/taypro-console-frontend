import React, { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CRow,
  CCol,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CImage,
  CButton,
  CFormCheck,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_OPEX_REQUEST":
      return { ...state, loadingOpex: true, error: "" };
    case "FETCH_OPEX_SUCCESS":
      return {
        ...state,
        loadingOpex: false,
        opexData: action.payload,
      };
    case "FETCH_OPEX_FAIL":
      return { ...state, loadingOpex: false, error: action.payload };

    case "CREATE_REQUEST":
      return { ...state, createLoading: true, createError: "", success: false };
    case "CREATE_SUCCESS":
      return { ...state, createLoading: false, success: true };
    case "CREATE_FAIL":
      return { ...state, createLoading: false, createError: action.payload };

    case "GENERATE_CERTIFICATE_REQUEST":
      return { ...state, generatingCertificate: true, certificateError: "" };
    case "GENERATE_CERTIFICATE_SUCCESS":
      return {
        ...state,
        generatingCertificate: false,
        opexData: action.payload,
        selectedCycles: [],
      };
    case "GENERATE_CERTIFICATE_FAIL":
      return {
        ...state,
        generatingCertificate: false,
        certificateError: action.payload,
      };

    case "VERIFY_CYCLE_REQUEST":
      return {
        ...state,
        verifyCycleLoading: true,
        verifyCycleError: "",
        success: false,
      };
    case "VERIFY_CYCLE_SUCCESS":
      return {
        ...state,
        verifyCycleLoading: false,

        // cycles: [...state.opexData.cycles, action.payload],
        opexData: {
          ...state.opexData,
          cycles: state.opexData.cycles.map((cycle) =>
            cycle._id === action.payload._id ? action.payload : cycle
          ),
        },
      };
    case "VERIFY_CYCLE_FAIL":
      return {
        ...state,
        verifyCycleLoading: false,
        verifyCycleError: action.payload,
      };
    case "DELETE_CYCLE_REQUEST":
      return { ...state, deletingCycleLoading: true, deleteError: "" };
    case "DELETE_CYCLE_SUCCESS":
      return {
        ...state,
        deletingCycleLoading: false,
        opexData: {
          ...state.opexData,
          cycles: state.opexData.cycles.filter(
            (cycle) => cycle._id !== action.payload
          ),
        },
      };
    case "DELETE_CYCLE_FAIL":
      return {
        ...state,
        deletingCycleLoading: false,
        deleteError: action.payload,
      };

    default:
      return state;
  }
};

const OpexTemplateManager = () => {
  const [
    {
      opexData,
      loadingOpex,
      error,
      createLoading,
      createError,
      generatingCertificate,
      certificateError,
      verifyCycleError,
      verifyCycleLoading,
      deletingCycleLoading,
      deleteError,
    },
    dispatch,
  ] = useReducer(reducer, {
    opexData: {},
    loadingOpex: true,
    createError: "",
    createLoading: false,
    error: "",
    generatingCertificate: false,
    certificateError: "",
    verifyCycleError: "",
    verifyCycleLoading: false,
    deletingCycleLoading: false,
    deleteError: "",
  });

  const { site_id } = useParams();
  const [selectedCycles, setSelectedCycles] = useState([]);
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(String(currentMonth));
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";
  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo.role === "Opex Client Admin") {
    adminroute = "opex-client-admin";
  } else if (userInfo.role === "Opex Site Technician") {
    adminroute = "opex-site-technician";
  }

  const fetchOpexData = async () => {
    dispatch({ type: "FETCH_OPEX_REQUEST" });
    try {
      const result = await axios.get(`/api/v1/opex/site/${site_id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({
        type: "FETCH_OPEX_SUCCESS",
        payload: result.data.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_OPEX_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  useEffect(() => {
    fetchOpexData();
  }, [authtoken]);

  const handleCreateCycle = async (id) => {
    dispatch({ type: "CREATE_REQUEST" });

    try {
      const response = await axios.post(
        `/api/v1/opex/first-cycle/${id}`,
        { start_date: startDate },
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
        sucess: true,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message);
      }
      setModalVisible(false);
      fetchOpexData();
    } catch (error) {
      dispatch({
        type: "CREATE_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  const deleteOpexCycle = async (moduleId, cycleId, reason) => {
    dispatch({ type: "DELETE_CYCLE_REQUEST" });

    try {
      const { data } = await axios.put(
        `/api/v1/opex/delete-cycle/${moduleId}/${cycleId}`,
        { reason }, // ✅ PUT body goes here
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "DELETE_CYCLE_SUCCESS",
        payload: cycleId,
      });

      toast.success(data.message);
      setShowDeleteModal(false);
      setDeleteReason("");
      fetchOpexData();
    } catch (error) {
      dispatch({
        type: "DELETE_CYCLE_FAIL",
        payload: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (cycle) => {
    setSelectedCycles((prev) =>
      prev.some((c) => c._id === cycle._id)
        ? prev.filter((c) => c._id !== cycle._id)
        : [...prev, cycle]
    );
  };

  // Select all cycles
  const selectAllCycles = () => {
    if (selectedCycles.length === opexData.cycles.length) {
      setSelectedCycles([]);
    } else {
      setSelectedCycles([...opexData.cycles]);
    }
  };

  // Generate certificate for selected cycles
  const generateCertificate = async () => {
    if (selectedCycles.length === 0) {
      toast.error("Please select at least one cycle to generate certificate");
      return;
    }

    dispatch({ type: "GENERATE_CERTIFICATE_REQUEST" });

    try {
      const response = await axios.put(
        `/api/v1/opex/generate-certificate/${opexData._id}/${site_id}`,
        { cyclesArray: selectedCycles.map((cycle) => cycle._id) },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({
        type: "GENERATE_CERTIFICATE_SUCCESS",
        payload: response.data.updatedModule,
      });

      toast.success("Certificate generated successfully");
      fetchOpexData();
    } catch (error) {
      dispatch({
        type: "GENERATE_CERTIFICATE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const verifyCycleHandler = async (id) => {
    dispatch({ type: "VERIFY_CYCLE_REQUEST" });

    try {
      const response = await axios.put(
        `/api/v1/opex/verify-cycle/${opexData._id}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      dispatch({
        type: "VERIFY_CYCLE_SUCCESS",
        payload: response.data.cycle,
      });

      toast.success(response.data.message);
    } catch (error) {
      dispatch({
        type: "VERIFY_CYCLE_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  const years = [
    ...new Set(
      opexData?.cycles?.map((c) => new Date(c.start_date).getFullYear())
    ),
  ];
  const filteredCycles = opexData?.cycles?.filter((cycle) => {
    const startDate = new Date(cycle.start_date);
    const monthMatch = selectedMonth
      ? startDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const yearMatch = selectedYear
      ? startDate.getFullYear() === parseInt(selectedYear)
      : true;
    return monthMatch && yearMatch;
  });

  const exportToExcel = () => {
    if (!opexData || Object.keys(opexData).length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const mergedData = [];

    // ========================
    // 1. Site Information
    // ========================
    mergedData.push([`Site Information`]);
    mergedData.push(["Client Name", opexData.client?.client_name || "N/A"]);
    mergedData.push(["Site Name", opexData.site?.siteName || "N/A"]);
    mergedData.push(["Location", opexData.site?.location || "N/A"]);
    mergedData.push(["Site Type", opexData.site?.site_type || "N/A"]);
    mergedData.push(["Total Modules", opexData.total_modules || "N/A"]);
    mergedData.push(["Frequency", opexData.cycle_frequency || "N/A"]);
    mergedData.push([
      "Daily Target",
      opexData.modules_cleaned_per_day || "N/A",
    ]);
    mergedData.push(["Total Robots", opexData.total_robots || 0]);
    mergedData.push(["Total Manpower", opexData.total_manpower || 0]);
    mergedData.push(["Total Trolleys", opexData.total_trolley || 0]);
    mergedData.push([]);
    mergedData.push([]); // 2 blank rows for spacing

    // ========================
    // 2. Cycle-wise Data
    // ========================
    if (filteredCycles && filteredCycles.length > 0) {
      filteredCycles.forEach((cycle, cycleIndex) => {
        // Cycle Header
        let cycle_status =
          cycle?.modules_cleaned === cycle?.modules_planned
            ? "Completed"
            : "In Progress";
        const cycleId =
          (cycle?._id != null && String(cycle._id)) ||
          (cycle?.cycle_id != null && String(cycle.cycle_id)) ||
          "N/A";
        mergedData.push([`Cycle ${cycleIndex + 1} Information`]);

        // ✅ Keep cycle details grouped clearly
        mergedData.push(["Field", "Value"]);
        mergedData.push(["ID", cycleId]);
        mergedData.push([
          "Status",
          cycle.is_cycle_verified ? "Verified" : "Pending",
        ]);
        mergedData.push([
          "Start Date",
          cycle.start_date
            ? new Date(cycle.start_date).toLocaleDateString("en-GB")
            : "N/A",
        ]);
        mergedData.push([
          "End Date",
          cycle.end_date
            ? new Date(cycle.end_date).toLocaleDateString("en-GB")
            : "N/A",
        ]);
        mergedData.push(["Planned Modules", cycle.modules_planned || 0]);
        mergedData.push(["Cleaned Modules", cycle.modules_cleaned || 0]);
        mergedData.push(["Remaining Modules", cycle.modules_remaining || 0]);
        mergedData.push(["CLeaning Status", cycle_status]);
        mergedData.push(["Verified", cycle?.is_cycle_verified ? "Yes" : "No"]);
        mergedData.push([]);
        mergedData.push([]);

        // Day-wise Data for this cycle
        mergedData.push([`Cycle ${cycleIndex + 1} - Day-wise Data`]);

        if (cycle.day_wise_data && cycle.day_wise_data.length > 0) {
          mergedData.push([
            "Date",
            "Planned Modules",
            "Cleaned Modules",
            "Remaining Modules",
            "Cleaning Done",
            "Verified",
            "Verified By",
            "Verified At",
            "Remarks",
          ]);

          cycle.day_wise_data.forEach((dayData) => {
            mergedData.push([
              dayData.date
                ? new Date(dayData.date).toLocaleDateString("en-GB")
                : "N/A",
              dayData.modules_planned_for_day || 0,
              dayData.modules_cleaned_for_day || 0,
              dayData.modules_remaining_for_day || 0,
              dayData.is_cleaning_done ? "Yes" : "No",
              dayData.is_verified ? "Yes" : "No",
              dayData.verified_by?.name || "N/A",
              dayData.verified_by?.verified_at
                ? new Date(dayData.verified_by.verified_at).toLocaleString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "N/A",
              dayData.remarks || "N/A",
            ]);
          });
        } else {
          mergedData.push(["No day-wise data available for this cycle"]);
        }
        mergedData.push([]);
        mergedData.push([]); // 2 blank rows
      });
    } else {
      mergedData.push(["No cycles available"]);
      mergedData.push([]);
      mergedData.push([]);
    }

    // ========================
    // 3. Summary
    // ========================
    mergedData.push(["Summary"]);
    mergedData.push(["Generated At", new Date().toLocaleString()]);
    mergedData.push([
      "Total",
      filteredCycles ? `${filteredCycles.length} Cycles` : "0 Cycles",
    ]);

    // ========================
    // Create Sheet
    // ========================
    const ws = XLSX.utils.aoa_to_sheet(mergedData);

    // Merge & Style for section headings
    if (!ws["!merges"]) ws["!merges"] = [];
    mergedData.forEach((row, rowIndex) => {
      if (
        row[0] &&
        (row[0].includes("Site Information") ||
          row[0].includes("Cycle") ||
          row[0].includes("Summary"))
      ) {
        ws["!merges"].push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: 8 },
        });
        const cellAddr = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
        ws[cellAddr].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "F7F700" } }, // highlight headings
        };
      }
    });

    // Style Site Info & Cycle Info tables (2-column)
    mergedData.forEach((row, rowIndex) => {
      if (rowIndex > 0 && row.length === 2) {
        const fieldAddr = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
        const valueAddr = XLSX.utils.encode_cell({ r: rowIndex, c: 1 });

        if (ws[fieldAddr]) {
          ws[fieldAddr].s = {
            font: { bold: true },
            alignment: { horizontal: "left", vertical: "center" },
          };
        }
        if (ws[valueAddr]) {
          ws[valueAddr].s = {
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }
    });

    // Style Day-wise Table Headers
    mergedData.forEach((row, rowIndex) => {
      if (
        row.length > 2 &&
        row.every((cell) => typeof cell === "string") &&
        (row.includes("Date") || row.includes("Planned Modules"))
      ) {
        row.forEach((_, colIndex) => {
          const cellAddr = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
          if (ws[cellAddr]) {
            ws[cellAddr].s = {
              font: { bold: true, color: { rgb: "000000" } },
              alignment: { horizontal: "center", vertical: "center" },
              fill: { fgColor: { rgb: "F7F700" } },
            };
          }
        });
      }
    });

    // Style Day-wise Data Content (centered)
    mergedData.forEach((row, rowIndex) => {
      if (
        rowIndex > 0 &&
        row.length > 2 &&
        !(row.includes("Date") || row.includes("Planned Modules"))
      ) {
        row.forEach((_, colIndex) => {
          const cellAddr = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
          if (ws[cellAddr]) {
            ws[cellAddr].s = {
              alignment: { horizontal: "center", vertical: "center" },
            };
          }
        });
      }
    });

    // Column widths
    ws["!cols"] = Array(10).fill({ wch: 20 });

    // ========================
    // Create Workbook
    // ========================
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OPEX Data");

    try {
      XLSX.writeFile(
        wb,
        `OPEX_${opexData.site?.siteName || "Unknown"}_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  //End of Export To Excel

  const isLastDayOfMonth = (dateStr) => {
    const d = new Date(dateStr);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return d.getDate() === lastDay.getDate();
  };

  const openUploadStartDateModal = () => {
    setModalVisible(true);
    setStartDate("");
  };

  return (
    <div className="mt-5">
      {!loadingOpex && Object.keys(opexData).length === 0 && (
        <div style={{ minWidth: "160px" }} className="text-end mb-2">
          {!["Master User", "Project User", "Service User"].includes(
            userInfo?.role
          ) && (
            <Link
              to={`/${adminroute}/create-template/${site_id}`}
              className="btn btn-warning btn-sm"
            >
              Create Template
            </Link>
          )}
        </div>
      )}
      {loadingOpex ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="d-flex justify-content-center">
          <CBadge color="danger" className="my-1">
            {error}
          </CBadge>
        </div>
      ) : (
        <>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex w-100 align-items-center justify-content-between">
                {/* Left: Client Logo */}

                {/* Center: Title */}
                <div className="">
                  <h5 className="mb-0">Site Information</h5>
                </div>
              </div>
            </CCardHeader>

            <CCardBody>
              <CRow>
                <CCol md={4}>
                  <div className="d-flex align-items-between mb-3">
                    <div style={{ minWidth: "60px" }} className="m-1 rounded-1">
                      {opexData.client.logo && (
                        <CImage
                          src={opexData.client.logo}
                          width={90}
                          height={60}
                          style={{ objectFit: "contain" }}
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="text-danger mb-0">
                        {opexData.client.client_name}
                      </h6>
                      <CBadge color="success">{opexData.site.site_type}</CBadge>
                    </div>
                  </div>
                  <p className="mb-1">Site : {opexData.site.siteName}</p>
                  <p className="mb-1">Location : {opexData.site.location}</p>
                </CCol>
                <CCol md={4}>
                  <h6 className="text-success">Modules Information</h6>
                  <p className="mb-1">
                    Total Modules :{" "}
                    <span className="">{opexData.total_modules}</span>
                  </p>
                  <p className="mb-1">
                    Cycle Frequency :{" "}
                    <CBadge color="success">{opexData.cycle_frequency}</CBadge>
                  </p>
                  <p className="mb-1">
                    Daily Target : {opexData.modules_cleaned_per_day}
                  </p>
                </CCol>
                <CCol md={4}>
                  <h6 className="text-success">Resources</h6>
                  <p className="mb-1">Robots : {opexData.total_robots}</p>
                  <p className="mb-1">Manpower : {opexData.total_manpower}</p>
                  <p className="mb-1">Trolleys : {opexData.total_trolley}</p>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          {/* Blocks Configuration Card */}
          {opexData && opexData.blocks_data.length > 0 && (
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Blocks Configuration</h5>
              </CCardHeader>
              <CCardBody>
                <CTable bordered hover responsive>
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Block No</CTableHeaderCell>
                      <CTableHeaderCell>Robots</CTableHeaderCell>
                      <CTableHeaderCell>Manpower</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loadingOpex ? (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          <LoadingSpinner />
                        </CTableDataCell>
                      </CTableRow>
                    ) : error ? (
                      <CTableRow>
                        {" "}
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          {error}
                        </CTableDataCell>
                      </CTableRow>
                    ) : opexData.blocks_data.length > 0 ? (
                      opexData.blocks_data.map((block, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{block.block_no}</CTableDataCell>
                          <CTableDataCell>{block.no_of_robots}</CTableDataCell>
                          <CTableDataCell>
                            {block.no_of_manpower}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          No matching Result Found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          {/* certificate Card */}
          {opexData && opexData.certificates.length > 0 && (
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Certificates</h5>
              </CCardHeader>
              <CCardBody>
                <CTable bordered hover responsive>
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Month</CTableHeaderCell>
                      <CTableHeaderCell>Certificate ID</CTableHeaderCell>
                      <CTableHeaderCell>Verified By</CTableHeaderCell>
                      <CTableHeaderCell>Verified At</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loadingOpex ? (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          <LoadingSpinner />
                        </CTableDataCell>
                      </CTableRow>
                    ) : error ? (
                      <CTableRow>
                        {" "}
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          {error}
                        </CTableDataCell>
                      </CTableRow>
                    ) : opexData.certificates.length > 0 ? (
                      opexData.certificates.map((block, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {new Date(
                              block.verified_by.timestamp
                            ).toLocaleString("en-GB", {
                              month: "long",
                              year: "numeric",
                            })}
                          </CTableDataCell>
                          <CTableDataCell>{block._id}</CTableDataCell>
                          <CTableDataCell>
                            {block.verified_by.name}
                          </CTableDataCell>
                          <CTableDataCell>
                            {new Date(
                              block.verified_by.timestamp
                            ).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </CTableDataCell>
                          <CTableDataCell>
                            <Link
                              className="btn btn-primary btn-sm m-1"
                              to={`/${adminroute}/opexdata/${site_id}/opex-certificate/${block._id}`}
                            >
                              View
                            </Link>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          No certificates Found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          <div
            className="d-flex flex-row align-items-end justify-content-end mb-2"
            style={{ minWidth: "150px" }}
          >
            {/* Export to Excel */}
            <CButton
              color="primary"
              size="sm"
              onClick={exportToExcel}
              className="me-2"
            >
              Export Cycle
            </CButton>

            {/* Create Cycle (only for allowed roles) */}
            {!["Master User", "Project User", "Service User"].includes(
              userInfo.role
            ) && (
              <Link
                onClick={openUploadStartDateModal}
                className="btn btn-primary btn-sm me-2"
              >
                Create Cycle
              </Link>
            )}

            {/* Error Message */}
            {createError && (
              <span className="text-danger align-self-center">
                {createError}
              </span>
            )}
          </div>

          <div className="d-flex justify-content-end mb-3">
            {selectedCycles.length > 0 &&
              !["Master User", "Project User", "Service User"].includes(
                userInfo?.role
              ) && (
                <CButton
                  color="success"
                  size="sm"
                  onClick={generateCertificate}
                  disabled={
                    generatingCertificate || selectedCycles.length === 0
                  }
                >
                  {generatingCertificate ? (
                    <>
                      Generating Certificate <LoadingSpinner />
                    </>
                  ) : (
                    "Generate Certificate"
                  )}
                </CButton>
              )}
          </div>
          {(certificateError || verifyCycleError) && (
            <div className="d-flex justify-content-center">
              <CBadge color="danger" className="my-1">
                {certificateError || verifyCycleError}
              </CBadge>
            </div>
          )}
          {/* Cycles Information Card */}
          <CCard className="mb-4">
            <CCardHeader className="bg-light border-bottom py-3">
              <CRow className="align-items-center">
                {/* Title */}
                <CCol xs="12" md="4" className="mb-2 mb-md-0">
                  <h5 className="mb-0 fw-bold text-secondary">
                    Cycles Information
                  </h5>
                </CCol>

                {/* Filters */}
                <CCol xs="12" md="8">
                  <div className="d-flex justify-content-md-end gap-2">
                    <CFormSelect
                      size="sm"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="shadow-sm "
                      style={{ maxWidth: "160px" }}
                    >
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </CFormSelect>

                    <CFormSelect
                      size="sm"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="shadow-sm "
                      style={{ maxWidth: "140px" }}
                    >
                      <option value="">All Years</option>
                      {years.map((year, idx) => (
                        <option key={idx} value={year}>
                          {year}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
              {error && (
                <CBadge color="danger" className="p-2">
                  {error}
                </CBadge>
              )}
            </CCardHeader>

            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>
                      <CFormCheck
                        checked={
                          filteredCycles &&
                          selectedCycles.length === filteredCycles.length
                        }
                        onChange={selectAllCycles}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Cycle</CTableHeaderCell>
                    {/* <CTableHeaderCell>Cycle id</CTableHeaderCell> */}
                    <CTableHeaderCell>Cycle status</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Planned</CTableHeaderCell>
                    <CTableHeaderCell>Cleaned</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "150px" }}>
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loadingOpex ? (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="10"
                        className="text-center fw-bold"
                      >
                        <LoadingSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : error ? (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="10"
                        className="text-center fw-bold"
                      >
                        {error}
                      </CTableDataCell>
                    </CTableRow>
                  ) : filteredCycles && filteredCycles.length > 0 ? (
                    filteredCycles.map((cycle, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CFormCheck
                            checked={selectedCycles.some(
                              (c) => c._id === cycle._id
                            )}
                            onChange={() => handleCheckboxChange(cycle)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>Cycle {index + 1}</CTableDataCell>
                        {/* <CTableDataCell>{cycle._id}</CTableDataCell> */}
                        <CTableDataCell>
                          {cycle.is_cycle_verified ? (
                            <CBadge color="success">Verified</CBadge>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.start_date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.end_date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </CTableDataCell>
                        <CTableDataCell>{cycle.modules_planned}</CTableDataCell>
                        <CTableDataCell>{cycle.modules_cleaned}</CTableDataCell>
                        <CTableDataCell>
                          {cycle.modules_remaining}
                        </CTableDataCell>
                        <CTableDataCell>
                          {cycle.modules_cleaned === cycle.modules_planned ? (
                            <CBadge color="success">Completed</CBadge>
                          ) : (
                            <CBadge color="warning">In Progress</CBadge>
                          )}
                        </CTableDataCell>

                        <CTableDataCell>
                          <Link
                            className="btn btn-primary btn-sm m-1"
                            to={`/${adminroute}/opexdata/${site_id}/${opexData._id}/cycle/${cycle._id}`}
                          >
                            Manage
                          </Link>
                          {[
                            "Master Admin",
                            "Project Admin",
                            "Service Admin",
                          ].includes(userInfo.role) && (
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(cycle); // store cycle info
                                setShowDeleteModal(true);
                              }}
                            >
                              Delete
                            </CButton>
                          )}

                          {!cycle.is_cycle_verified &&
                          (cycle.modules_planned === cycle.modules_cleaned ||
                            isLastDayOfMonth(
                              cycle.day_wise_data[
                                cycle.day_wise_data.length - 1
                              ].date
                            )) &&
                          ![
                            "Master User",
                            "Project User",
                            "Service User",
                          ].includes(userInfo?.role) ? (
                            <Link
                              className="btn btn-primary btn-sm m-1"
                              onClick={() => verifyCycleHandler(cycle._id)}
                            >
                              {verifyCycleLoading ? (
                                <LoadingSpinner />
                              ) : (
                                "Verify"
                              )}
                            </Link>
                          ) : cycle.is_cycle_verified ? (
                            <CBadge color="success">Verified</CBadge>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="11"
                        className="text-center fw-bold"
                      >
                        No cycles found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <LastActivity lastactivity={opexData.last_activity} />
        </>
      )}
      {/* add start_date */}
      <CModal
        scrollable
        alignment="center"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle id="addStartDateModalTitle">
            Cycle Start Date
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
            aria-label="Close"
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {/* <CFormLabel htmlFor="start_date">Add Start Date</CFormLabel> */}
          <CFormInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            size="sm"
            className="text-white"
            onClick={() => handleCreateCycle(opexData._id)}
            disabled={!startDate}
          >
            {createLoading ? (
              <>
                Saving <LoadingSpinner />
              </>
            ) : (
              "Save"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Cycle Modal */}

      <CModal
        scrollable
        alignment="center"
        backdrop="static"
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteReason("");
          setSelectedItem(null);
        }}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Delete Cycle</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteReason("");
              setSelectedItem(null);
            }}
            style={{ background: "none" }}
            aria-label="Close"
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          {selectedItem && (
            <>
              <p>
                Are you sure you want to delete{" "}
                <strong>
                  Cycle{" "}
                  {filteredCycles.findIndex((c) => c._id === selectedItem._id) +
                    1}{" "}
                  -{" "}
                  {new Date(selectedItem.start_date).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {new Date(selectedItem.start_date).getFullYear()}
                </strong>
                ?
              </p>
              {/* <p className="text-muted small">
                Start Date:{" "}
                {new Date(selectedItem.start_date).toLocaleDateString()}
                {selectedItem.end_date &&
                  ` | End Date: ${new Date(
                    selectedItem.end_date
                  ).toLocaleDateString()}`}
              </p> */}
            </>
          )}
          <CFormInput
            placeholder="Enter reason for deletion"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            disabled={deletingCycleLoading}
          />
          {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteReason("");
              setSelectedItem(null);
            }}
            disabled={deletingCycleLoading}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            size="sm"
            disabled={!deleteReason || deletingCycleLoading}
            onClick={() => {
              deleteOpexCycle(opexData._id, selectedItem._id, deleteReason);
            }}
          >
            {deletingCycleLoading ? <LoadingSpinner size="sm" /> : "Delete"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default OpexTemplateManager;
