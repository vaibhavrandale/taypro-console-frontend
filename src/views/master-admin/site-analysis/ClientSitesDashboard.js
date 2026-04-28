import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CButton,
  CFormInput,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link, useParams } from "react-router-dom";
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        sites: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ClientSitesDashboard = () => {
  const { clientId } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const [state, dispatch] = useReducer(reducer, {
    sites: [],
    loading: true,
    error: null,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const userInfo = useSelector((state) => state.userInfo);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");

  const { sites, totalPages, hasNextPage, hasPrevPage } = state;

  useEffect(() => {
    const fetchClientSites = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.post(
          `/api/v1/sites/get-sites/${clientId}`,
          { pg: page, limit: limit },
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit),
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: total,
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message,
        });
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            error.message,
        );
      }
    };
    fetchClientSites();
  }, [clientId, limit, page]);

  const filteredSites = sites.filter(
    (site) =>
      site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const userRole = userInfo?.role || "";
  let adminroute = "";
  if (userRole === "Master Admin") adminroute = "master-admin";
  else if (userRole === "Service Admin") adminroute = "service-admin";
  else if (userRole === "Project Admin") adminroute = "project-admin";
  else if (userRole === "Master User") adminroute = "master-user";
  else if (userRole === "Service User") adminroute = "service-user";
  else if (userRole === "Project User") adminroute = "project-user";

  return state.loading ? (
    <div className="d-flex justify-content-center">
      <LoadingSpinner />
    </div>
  ) : state.error ? (
    <div className="text-center text-danger">{state.error}</div>
  ) : (
    <CContainer fluid>
      <CRow className="mb-4 justify-content-end">
        <CCol xs={12} sm={8} md={6} lg={4}>
          <CFormInput
            type="text"
            placeholder="Search Site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      <CRow xs={{ cols: 1 }} sm={{ cols: 2 }} md={{ cols: 3 }} className="g-4">
        {filteredSites && filteredSites.length > 0 ? (
          filteredSites.map((site) => (
            <CCol key={site._id}>
              <CCard
                className="h-100 shadow-sm d-flex flex-column"
                style={{ minWidth: "320px" }}
              >
                <CCardBody className="d-flex flex-column align-items-center p-3">
                  <CCardImage
                    src={site.logo}
                    alt={`${site.siteName} logo`}
                    style={{
                      width: "120px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                    className="mb-3"
                  />
                  <CCardTitle
                    className="text-center mb-3"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    {site.location}
                  </CCardTitle>
                  {/* Button Container - All buttons in single line */}
                  <div className="w-100 mt-auto">
                    <div className="d-flex justify-content-between gap-1">
                      <CButton
                        color="primary"
                        className="btn btn-sm w-70 text-nowrap"
                        // style={{ padding: "4px 10px" }}
                        as={Link}
                        to={`/${adminroute}/robots-tracker`}
                      >
                        Tracking
                      </CButton>
                      <CButton
                        color="primary"
                        className="btn btn-sm w-70 text-nowrap"
                        as={Link}
                        to={`/${adminroute}/all-clients-dashboard/${clientId}/RobotTrackingLog/${site.site_id}`}
                      >
                        Log
                      </CButton>
                      <CButton
                        color="primary"
                        className="btn btn-sm w-70 text-nowrap"
                        as={Link}
                        to={`/${adminroute}/all-clients-dashboard/${clientId}/sitewise-timer/${site.site_id}`}
                      >
                        Timer
                      </CButton>
                      <CButton
                        color="primary"
                        className="btn btn-sm w-70 text-nowrap"
                        as={Link}
                        to={`/${adminroute}/all-clients-dashboard/${clientId}/RobotDataGraphs/${site.site_id}`}
                      >
                        Robot Analysis
                      </CButton>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <div className="text-center w-100 mt-5">No sites found.</div>
        )}
      </CRow>
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
        handleLimitChange={setLimit}
      />
    </CContainer>
  );
};

export default ClientSitesDashboard;
