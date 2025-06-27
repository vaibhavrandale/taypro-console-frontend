import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CAvatar,
  CFormSelect,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DPRBYDATE_REQUEST":
      return { ...state, loadingDprs: true, error: "" };

    case "FETCH_DPRBYDATE_SUCCESS":
      return {
        ...state,
        loadingDprs: false,
        dprs: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };

    case "FETCH_DPRBYDATE_FAIL":
      return { ...state, loadingDprs: false, error: action.payload };

    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, error: action.payload };

    case "SELECT_SITENAME_REQUEST":
      return { ...state, loadingFields: true };

    case "SELECT_SITENAME_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedSiteName: action.payload,
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false };
    default:
      return state;
  }
};

const AllSiteDpr = () => {
  const [
    {
      error,
      dprs,
      loadingDprs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      successDelete,

      siteIds,
    },
    dispatch,
  ] = useReducer(reducer, {
    dprs: [],
    loading: true,
    loadingDprs: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    loadingSiteIds: false,
    loadingFields: false,
    siteIds: [],
  });
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [site_id, setSiteId] = useState("all");
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formData, setFormData] = useState({
    site_id: "",
    total_running_robots: "",
    total_failed_robots: "",
    robots_run_by: "",
    total_robots: "",
    comments: "",
  });

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITEID_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response.data.error || "Error fetching sites");
      }
    };

    const fetchDprDates = async () => {
      dispatch({ type: "FETCH_DPRBYDATE_REQUEST" });

      try {
        // Ensure the correct keys match the backend API
        const data = {
          startDate: new Date(fromDate).toISOString().split("T")[0], // Convert to proper format
          endDate: new Date(toDate).toISOString().split("T")[0],
          siteId: site_id, // Ensure the key matches
          pg: page,
          limit: limit,
        };

        const result = await axios.post(
          `/api/v1/techniciandprs/site_date_wise`,
          data,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(result.data.data.total) / Number(result.data.data.limit)
        );

        let next = result.data.data.hasNextPage;
        let prev = result.data.data.hasPrevPage;

        dispatch({
          type: "FETCH_DPRBYDATE_SUCCESS",
          payload: {
            data: result.data.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_DPRBYDATE_FAIL",
          payload: error.response?.data?.error || "Failed to fetch DPR by Date",
        });
        toast.error(
          error.response?.data?.error || "Failed to fetch DPR by Date"
        );
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchDprDates();
    }

    fetchSiteIds();
  }, [successDelete, authtoken, limit, page, fromDate, toDate, site_id]);

  const filteredInventories = dprs.filter((dpr) =>
    dpr.site_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal and load robot data
  const openModal = (dpr) => {
    setSelectedInventory(dpr);
    setFormData(dpr);
    setModalVisible(true);
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.item(uniqueSitenames);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName
    );

    if (selectedSite) {
      setSiteId(selectedSite.site_id);

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  const deleteDpr = async (dpr) => {
    if (dpr.is_delete) {
      toast.error("This DPR is already deleted.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete DPR of site - ${dpr.site_id}`
      )
    ) {
      try {
        await axios.delete(`/api/v1/techniciandprs/${dpr._id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        toast.success("DPR deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const exportToExcel = () => {
    if (filteredInventories.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    // Main data
    const excelData = filteredInventories.map((item, index) => ({
      "#": index + 1,
      "Site Id": item.site_id,
      "Running Robots": item.total_running_robots,
      "Failed Robots": item.total_failed_robots,
      "Total Robots": item.total_robots,
      "Robots Run By": item.robots_run_by,
      Comment: item.comments,
    }));

    // Create worksheet from main data
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Calculate last row position
    const lastRow = filteredInventories.length + 2; // +2 for header and an empty row

    // Add metadata at the end
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [""], // Empty row for spacing
        [`Report Period: From ${fromDate} To ${toDate}`],
        [`Site ID: ${site_id === "all" ? "All Sites" : site_id}`],
      ],
      { origin: `A${lastRow}` } // Place at the end of the sheet
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DPR");

    // Trigger download
    XLSX.writeFile(workbook, `${site_id}_${fromDate}_${toDate}_DPR.xlsx`);
  };

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  return (
    <div className="p-2">
      <h2 className="text-center mt-4">Daily Progress Reports</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-secondary m-1"
          to={`/${adminroute}/all-site-dpr/add-dpr`}
        >
          Add DPR
        </Link>
        <Link className="btn btn-sm btn-primary m-1" onClick={exportToExcel}>
          Export
        </Link>
      </div>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={3} className="m-1">
          <CFormSelect
            name="site_id"
            value={site_id}
            onChange={handleSiteNameChange}
          >
            <option value="">All</option>
            {siteIds?.length > 0 &&
              siteIds.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))}
          </CFormSelect>
        </CCol>
        <CCol md={3} className="m-1">
          <CFormInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </CCol>
        <CCol md={3} className="m-1">
          <CFormInput
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </CCol>
        <CCol md={4} className="mt-3">
          <CFormInput
            type="text"
            placeholder="Search by Site Id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Inventories Table */}
      <CTable
        bordered
        hover
        responsive
        className="text-center shadow-sm bg-important"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Site Id
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Running Robots
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Failed Robots
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Total Robots
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Run by
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Comments
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Date
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingDprs ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              {" "}
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredInventories.length > 0 ? (
            filteredInventories.map((dpr, index) => (
              <CTableRow
                key={index}
                className={dpr.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{dpr.site_id}</CTableDataCell>
                <CTableDataCell>{dpr.total_running_robots}</CTableDataCell>
                <CTableDataCell>{dpr.total_failed_robots}</CTableDataCell>
                <CTableDataCell>{dpr.total_robots}</CTableDataCell>
                <CTableDataCell>
                  {dpr.robots_run_by.toUpperCase()}
                </CTableDataCell>
                {/* <CTableDataCell>{dpr.comments}</CTableDataCell> */}
                <CTableDataCell>
                  {dpr.comments.length > 30
                    ? `${dpr.comments.slice(0, 30)}...`
                    : dpr.comments}
                </CTableDataCell>

                {/* <CTableDataCell>{dpr.createdAt}</CTableDataCell> */}
                <CTableDataCell>
                  {new Date(dpr.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="secondary"
                    size="sm"
                    onClick={() => openModal(dpr)}
                  >
                    View
                  </Link>

                  <Link
                    className="btn btn-sm btn-warning m-1"
                    to={`/${adminroute}/update-dpr/${dpr._id}`}
                  >
                    Update
                  </Link>
                  <Link
                    color="danger"
                    size="sm"
                    className=" btn btn-sm btn-danger m-1 text-white"
                    onClick={() => deleteDpr(dpr)}
                  >
                    Delete
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                No matching DPR found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit} // New prop
      />

      {/* view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            DPR Data :&nbsp;
            <span className="badge bg-success">{formData.site_id}</span>{" "}
          </CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {selectedInventory && (
            <>
              <CTable bordered responsive className="bg-important">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Object.entries(formData)
                    .filter(([key]) => key !== "last_activity") // Exclude last_activity
                    .map(([key, value]) => (
                      <CTableRow key={key}>
                        <CTableHeaderCell>
                          {key.replace(/_/g, " ")}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {Array.isArray(value) ? (
                            key === "technician_present" ? (
                              <CTable className=" border-0 bg-important">
                                <CTableBody>
                                  {value.map((tech, index) => {
                                    return (
                                      <CTableRow key={index} className="border">
                                        <CTableDataCell className="border-0">
                                          {index + 1})
                                        </CTableDataCell>
                                        <CTableDataCell className="border-0">
                                          <CAvatar
                                            src={tech.profile_image}
                                            className="me-2"
                                          />
                                        </CTableDataCell>
                                        <CTableDataCell className="border-0">
                                          {tech.name}
                                        </CTableDataCell>
                                        {/* <CTableDataCell className="border-0">
                                      {tech.technitian_email}
                                    </CTableDataCell> */}
                                      </CTableRow>
                                    );
                                  })}
                                </CTableBody>
                              </CTable>
                            ) : (
                              JSON.stringify(value)
                            )
                          ) : (
                            value?.toString() || "N/A"
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>

              {formData.last_activity && (
                <LastActivity lastactivity={formData.last_activity} />
              )}
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default AllSiteDpr;
