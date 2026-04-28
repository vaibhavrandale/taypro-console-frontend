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
  CModalHeader,
  CModalTitle,
  CBadge,
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import LoadingSpinner from "../../../components/LoadingSpinner";

const initialState = {
  thermalImages: [],
  loading: false,
  error: "",
  modalVisible: false,
  selectedImage: null,
  selectedItem: null,
  searchTerm: "",
  sites: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, thermalImages: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_SITES":
      return { ...state, sites: action.payload };
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

const ThermalImageData = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [siteId, setSiteId] = useState("all");
  // const authtoken = useSelector((state) => state.authtoken);

  // Fetch Site List
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await axios.get("/api/v1/sites", {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({ type: "SET_SITES", payload: res.data.data });
      } catch (error) {
        console.error("Failed to fetch site list", error);
      }
    };

    if (authtoken) fetchSites();
  }, []);

  // Fetch Thermal Images
  useEffect(() => {
    const fetchImages = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await axios.get(
          `/api/v1/thermalimages/get-by-siteid/${siteId}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error("Failed to fetch thermal images");
      }
    };

    fetchImages();
  }, [siteId]);

  const filteredData = state.thermalImages.filter(
    (item) =>
      item.site_id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.device_id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.thermal_image_id
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase()),
  );

  return (
    <div className="p-2">
      <h2 className="text-center mt-2 mb-3">Thermal Images</h2>

      <CRow className="mb-3 justify-content-between align-items-center">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Site ID, Device ID, Thermal Image ID..."
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
          />
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
          >
            <option value="all">All Sites</option>
            {state.sites.map((site) => (
              <option key={site._id} value={site.site_id}>
                {site.site_id}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      {state.loading && state.thermalImages.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <CRow>
          {filteredData.length === 0 ? (
            <p className="text-center fw-bold">No Thermal Images Found</p>
          ) : (
            filteredData.map((item) => (
              <CCol key={item._id} md={3} className="mb-4">
                <CCard className="shadow-sm">
                  <CCardImage
                    orientation="top"
                    src={item.image_url}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      dispatch({
                        type: "OPEN_MODAL",
                        payload: { image: item.image_url, item },
                      })
                    }
                  />
                  <CCardBody>
                    <CCardText className="fw-bold mb-1">
                      Image ID:{" "}
                      <CBadge color="primary">{item.thermal_image_id}</CBadge>
                    </CCardText>
                    <CCardText className="fw-bold mb-1">
                      Device ID: <CBadge color="info">{item.device_id}</CBadge>
                    </CCardText>
                    <CCardText className="fw-bold mb-1">
                      Site: <CBadge color="dark">{item.site_id}</CBadge>
                    </CCardText>
                    {/* <CCardText>
                      <small className="text-muted">
                        Uploaded by: {item.user?.name}
                      </small>
                    </CCardText> */}
                  </CCardBody>
                </CCard>
              </CCol>
            ))
          )}
        </CRow>
      )}

      <CModal
        visible={state.modalVisible}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        size="lg"
        centered
      >
        {state.selectedItem && (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle>
                Image: {state.selectedItem.thermal_image_id} - Site:{" "}
                {state.selectedItem.site_id}
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
              <p className="mt-3">
                <strong>Device ID:</strong> {state.selectedItem.device_id}{" "}
                <br />
                <strong>Uploaded by:</strong> {state.selectedItem.user?.name}
              </p>
            </CModalBody>
          </>
        )}
      </CModal>
    </div>
  );
};

export default ThermalImageData;
