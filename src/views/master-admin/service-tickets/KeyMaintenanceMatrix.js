import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTab,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabList,
  CTabPanel,
  CTabs,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import KeyMaintenanceMatrixOverview from "./KeyMaintenanceMatrixOverview";

const KeyPMMatrix = () => {
  return (
    <div>
      <CTabs activeItemKey="keyPMMatrix">
        <CTabList variant="tabs">
          <CTab itemKey="keyPMMatrix">Key Maintenance Matrix</CTab>
          <CTab itemKey="keyPMMatrixOverview">Key PM Matrix Overview</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel className="p-3" itemKey="keyPMMatrix">
            <KeyMaintenanceMatrix />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey="keyPMMatrixOverview">
            <KeyMaintenanceMatrixOverview />
          </CTabPanel>
        </CTabContent>
      </CTabs>
    </div>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PARAMETERS_REQUEST":
      return { ...state, loadingParameters: true, error: "" };
    case "FETCH_PARAMETERS_SUCCESS":
      return {
        ...state,
        loadingParameters: false,
        parameters: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_PARAMETERS_FAIL":
      return { ...state, loadingParameters: false, error: action.payload };
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
    default:
      return state;
  }
};

const KeyMaintenanceMatrix = () => {
  const [
    {
      error,
      parameters,
      loadingParameters,
      totalPages,
      hasNextPage,
      hasPrevPage,
      siteIds,
    },
    dispatch,
  ] = useReducer(reducer, {
    parameters: [],
    loadingParameters: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    siteIds: [],
  });
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [site_id, setSiteId] = useState("");

  const [, setFormData] = useState({});

  useEffect(() => {
    const fetchParameters = async () => {
      dispatch({ type: "FETCH_PARAMETERS_REQUEST" });
      try {
        const data = {
          site_id: site_id,
          pg: page,
          limit: limit,
        };
        const result = await axios.post(
          `/api/v1/servicetickets/service-ticket-parameters`,
          data,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );

        dispatch({
          type: "FETCH_PARAMETERS_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
          },
        });

        setFormData(result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_PARAMETERS_FAIL",
          payload:
            error.response?.data?.error ||
            "Failed to fetch Key Maintenance Matrices",
        });
        toast.error(
          error.response?.data?.error ||
            "Failed to fetch Key Maintenance Matrices"
        );
      }
    };

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
    fetchParameters();
    fetchSiteIds();
  }, [authtoken, limit, page, site_id]);

  const filteredProjectDocs = parameters.filter(
    (doc) =>
      doc.fault_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.robot_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

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

  return (
    <CCard className="mt-4">
      <CCardHeader>
        <h2 className="text-center">Key Maintenance Matrix</h2>
      </CCardHeader>
      {/* Search Input */}
      <CCardBody>
        <CRow className="justify-content-end mt-2 mb-4">
          <CCol md={4}>
            <CFormSelect
              name="site_id"
              value={site_id}
              onChange={handleSiteNameChange}
            >
              <option value="">Select Site ID</option>
              {siteIds?.length > 0 &&
                siteIds.map((item) => (
                  <option key={item.site_id} value={item.site_id}>
                    {item.site_id}
                  </option>
                ))}
            </CFormSelect>
          </CCol>
          <CCol md={4}>
            <CFormInput
              type="text"
              placeholder="Search by Fault Type & Robot No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>

        {/* parameters Table */}
        <CTable bordered hover responsive className="text-center shadow-sm">
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell style={{ minWidth: "200px" }}>
                Robot No
              </CTableHeaderCell>
              <CTableHeaderCell style={{ minWidth: "100px" }}>
                Fault Type
              </CTableHeaderCell>
              <CTableHeaderCell style={{ minWidth: "140px" }}>
                MTBF (Mean Time Between Failures)
              </CTableHeaderCell>
              <CTableHeaderCell style={{ minWidth: "140px" }}>
                MTTR (Average Time to Repair)
              </CTableHeaderCell>
              <CTableHeaderCell style={{ minWidth: "100px" }}>
                Failure Rate info
              </CTableHeaderCell>
              <CTableHeaderCell style={{ minWidth: "100px" }}>
                Reliability
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loadingParameters ? (
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
            ) : filteredProjectDocs.length > 0 ? (
              filteredProjectDocs.map((doc, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{doc.robot_no}</CTableDataCell>
                  <CTableDataCell>{doc.fault_type}</CTableDataCell>
                  <CTableDataCell>{doc.mtbf}</CTableDataCell>
                  <CTableDataCell>{doc.mttr}</CTableDataCell>
                  <CTableDataCell>{doc.failure_rate_info}</CTableDataCell>
                  <CTableDataCell>{doc.reliability}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center fw-bold">
                  No Matching Result Found.
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
      </CCardBody>
    </CCard>
  );
};

export default KeyPMMatrix;
