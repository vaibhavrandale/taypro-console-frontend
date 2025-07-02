// import React from "react";

// const MicrofiberdataAdminWise = () => {
//   return <div>Hello Pookie</div>;
// };

// export default MicrofiberdataAdminWise;

import {
  CCard,
  CCardImage,
  CCardBody,
  CCardText,
  CRow,
  CCol,
  CModal,
  CModalBody,
  CImage,
  CFormInput,
  CModalHeader,
  CModalTitle,
  CBadge,
  CFormSelect,
} from "@coreui/react";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import LoadingSpinner from "../../../components/LoadingSpinner";

const initialState = {
  microfiberData: [],
  loading: false,
  error: "",
  modalVisible: false,
  selectedImage: null,
  selectedItem: null,
  searchTerm: "",
  loadingSites: false,
  sites: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, microfiberData: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };
    case "OPEN_MODAL":
      return {
        ...state,
        modalVisible: true,
        selectedImage: action.payload.image,
        selectedItem: action.payload.item,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        modalVisible: false,
        selectedImage: null,
        selectedItem: null,
      };
    default:
      return state;
  }
};

const MicrofiberdataAdminWise = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [site_id, setSiteId] = useState("all");
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: err.response?.data?.error || err.message,
        });
        toast.error("Failed to fetch sites");
      }
    };
    const fetchData = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await axios.get(
          `/api/v1/microfiberdata/get-by-siteId/${site_id}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to fetch Micro Fiber data"
        );
      }
    };

    if (userInfo._id) {
      fetchData();
    }
    fetchSites();
  }, [authtoken, site_id, userInfo._id]);

  const filteredData = state.microfiberData.filter(
    (item) =>
      item.site_id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <h2 className="text-center mt-2 mb-2">Micro Fiber Data</h2>
      <CRow className="mb-3 justify-content-between align-items-center">
        <CCol md={4}>
          <CFormSelect
            id="siteSelect"
            value={site_id}
            onChange={(e) => {
              setSiteId(e.target.value);
            }}
          >
            <option value="all">All Sites</option>
            <option disabled>────────────</option>
            {state.sites?.map((site, index) => (
              <option key={index} value={site.site_id}>
                {site.site_id}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Category..."
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
          />
        </CCol>
      </CRow>

      <CRow>
        {state.loading ? (
          <span className="text-center fw-bold">
            <LoadingSpinner />
          </span>
        ) : state.error ? (
          <p className="text-center fw-bold">{state.error}</p>
        ) : filteredData.length < 0 ? (
          <p className="text-center fw-bold">No Micro Fiber Data Found</p>
        ) : (
          filteredData.map((item) => (
            <CCol key={item._id} md={3} className="mb-4">
              <CCard className="shadow-sm">
                <CCardImage
                  orientation="top"
                  src={item.image}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    dispatch({
                      type: "OPEN_MODAL",
                      payload: { image: item.image, item },
                    })
                  }
                />
                <CCardBody>
                  <CCardText className="fw-bold mb-1">
                    Site ID: <CBadge color="blue">{item.site_id}</CBadge>
                  </CCardText>
                  <CCardText className="fw-bold mb-1">
                    Category: <CBadge color="warning">{item.category}</CBadge>
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        )}
      </CRow>

      <CModal
        visible={state.modalVisible}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        size="lg"
        centered
      >
        {state.selectedItem && (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle className="">
                Site ID: {state.selectedItem.site_id}
              </CModalTitle>
              <button
                type="button"
                className=" border-0 ms-auto py-0 px-1"
                onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>
            <CModalBody className="text-center">
              <CImage
                src={state.selectedImage}
                fluid
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
              <div className="mt-3">
                <CBadge
                  color={
                    state.selectedItem.category === "Good"
                      ? "success"
                      : state.selectedItem.category === "Bad"
                      ? "danger"
                      : "warning"
                  }
                  className="px-3 py-2 fs-6"
                >
                  Category: {state.selectedItem.category}
                </CBadge>
              </div>
            </CModalBody>
          </>
        )}
      </CModal>
    </div>
  );
};

export default MicrofiberdataAdminWise;
