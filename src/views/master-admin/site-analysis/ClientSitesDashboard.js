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
import { useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
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
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ClientSitesDashboard = () => {
  const { clientId } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const [state, dispatch] = useReducer(reducer, {
    sites: [],
    loading: true,
    error: null,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchClientSites = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await axios.post(
          `/api/v1/sites/get-sites/${clientId}`,
          { pg: page, limit: limit },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit)
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
          type: "FETCH_ERROR",
          payload: error.response?.data?.error || error.response.data.message,
        });
        toast.error(error.response?.data?.error || error.response.data.message);
      }
    };
    fetchClientSites();
  }, [authtoken, clientId, limit, page]);

  const filteredSites = state.sites?.filter((site) =>
    site.siteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return state.loading ? (
    <div className="d-flex justify-content-center">
      <LoadingSpinner />
    </div>
  ) : state.error ? (
    <div className="text-center text-danger">{state.error}</div>
  ) : (
    <CContainer>
      <CFormInput
        type="text"
        placeholder="Search Site..."
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <CRow
        xs={{ cols: 1 }}
        sm={{ cols: 2 }}
        md={{ cols: 3 }}
        lg={{ cols: 4 }}
        className="g-3"
      >
        {filteredSites && filteredSites.length > 0 ? (
          filteredSites.map((site) => (
            <CCol key={site._id}>
              <CCard className="h-100 shadow-sm d-flex flex-column">
                <CCardBody className="d-flex flex-column align-items-center p-3">
                  <CCardImage
                    src={site.logo}
                    alt={`${site.siteName} logo`}
                    style={{
                      width: "120px",
                      height: "80px",
                      objectFit: "contain",
                    }}
                    className="mb-3"
                  />
                  <CCardTitle
                    className="text-center mb-4"
                    style={{ fontSize: "14px" }}
                  >
                    {site.siteName}
                  </CCardTitle>

                  <div className="d-flex gap-2 w-100 justify-content-center mt-auto">
                    <CButton size="sm" color="primary" className="flex-fill">
                      Tracking
                    </CButton>
                    <CButton size="sm" color="secondary" className="flex-fill">
                      Log
                    </CButton>
                    <CButton size="sm" color="info" className="flex-fill">
                      Analysis
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <div className="text-center w-100 mt-5">No sites found.</div>
        )}
      </CRow>
    </CContainer>
  );
};

export default ClientSitesDashboard;
