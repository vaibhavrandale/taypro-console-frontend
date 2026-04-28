import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CButton,
  CFormInput,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingClients: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        clients: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loadingClients: false,
      };
    case "FETCH_FAIL":
      return { ...state, loadingClients: false, error: action.payload };
    default:
      return state;
  }
};

const AllClientDashboard = () => {
  const [
    { loadingClients, error, clients, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    clients: [],
    loadingClients: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const pagination = { pg: page, limit: limit };

    const fetchClients = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          `/api/v1/clients/get-clients`,
          pagination,
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
        dispatch({ type: "FETCH_FAIL", payload: error.toString() });
      }
    };

    fetchClients();
  }, [limit, page]);

  const filteredData = clients
    ? clients.filter(
        (item) =>
          item.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.client_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const userRole = userInfo?.role || "";
  let adminroute = "";
  if (userRole === "Master Admin") adminroute = "master-admin";
  else if (userRole === "Service Admin") adminroute = "service-admin";
  else if (userRole === "Project Admin") adminroute = "project-admin";
  else if (userRole === "Master User") adminroute = "master-user";
  else if (userRole === "Service User") adminroute = "service-user";
  else if (userRole === "Project User") adminroute = "project-user";

  return (
    <div className="p-4">
      <h2 className="blinker-semibold">All Clients Overview</h2>

      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Client Name or Client ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {loadingClients ? (
        <div className="d-flex justify-content-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center text-muted">No clients found.</div>
      ) : (
        <CRow
          xs={{ cols: 1 }}
          sm={{ cols: 2 }}
          md={{ cols: 3 }}
          lg={{ cols: 4 }}
          className="g-3"
        >
          {filteredData.map((client, index) => (
            <CCol key={client._id || index}>
              <CCard className="shadow-sm h-100 d-flex flex-column">
                <CCardBody className="d-flex flex-column align-items-center justify-content-between h-100">
                  <div className="d-flex flex-column align-items-center">
                    <CCardImage
                      orientation="top"
                      src={client.logo}
                      alt={`${client.client_name} logo`}
                      style={{
                        width: "120px",
                        height: "70px",
                        objectFit: "contain",
                      }}
                      className="mb-3"
                    />
                    <CCardTitle
                      className="mb-3 text-center"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      {client.client_name}
                    </CCardTitle>
                  </div>
                  <CButton
                    color="primary"
                    // size="sm"
                    className="btn btn-sm w-70 mt-auto"
                    as={Link}
                    to={`/${adminroute}/all-clients-dashboard/${client.client_id}`}
                  >
                    Manage
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}

      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={(newPage) => {
          if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
        }}
        handlePageInputChange={(e) => setPageInput(e.target.value)}
        handlePageInputSubmit={() => {
          const pageNumber = parseInt(pageInput);
          if (
            !isNaN(pageNumber) &&
            pageNumber >= 1 &&
            pageNumber <= totalPages
          ) {
            setPage(pageNumber);
          }
        }}
        limit={limit}
        handleLimitChange={setLimit}
      />
    </div>
  );
};

export default AllClientDashboard;
