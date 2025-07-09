import React, {
  useEffect,
  useReducer,
  useRef,
  useCallback,
  useState,
} from "react";
import {
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CImage,
} from "@coreui/react";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
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
  page: 1,
  hasMore: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        microfiberData: [...state.microfiberData, ...action.payload.data],
        hasMore: action.payload.hasMore,
        page: state.page + 1,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "RESET_DATA":
      return { ...state, microfiberData: [], page: 1, hasMore: true };
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
  const [loadedImages, setLoadedImages] = useState({});
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const observer = useRef();

  const fetchData = async (page = 1) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await axios.get(
        `/api/v1/microfiberdata/get-by-siteId/${site_id}?page=${page}&limit=8`,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          data: res.data.data,
          hasMore: res.data.hasMore,
        },
      });
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
        payload:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to fetch Micro Fiber data",
      });
      toast.error("Failed to fetch Micro Fiber data");
    }
  };

  useEffect(() => {
    dispatch({ type: "RESET_DATA" });
  }, [site_id]);

  useEffect(() => {
    if (userInfo._id && state.page === 1) {
      fetchData();
    }
  }, [site_id, authtoken, userInfo._id]);

  const lastCardRef = useCallback(
    (node) => {
      if (state.loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMore) {
          fetchData(state.page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [state.loading, state.hasMore, state.page]
  );

  const filteredData = state.microfiberData.filter(
    (item) =>
      item.site_id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

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
    fetchSites();
  }, [authtoken]);

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
        {state.loading && state.microfiberData.length === 0 ? (
          <span className="text-center fw-bold">
            <LoadingSpinner />
          </span>
        ) : state.error ? (
          <p className="text-center fw-bold">{state.error}</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center fw-bold">No Micro Fiber Data Found</p>
        ) : (
          filteredData.map((item, index) => {
            const isLast = index === filteredData.length - 1;
            const isImageLoaded = loadedImages[item._id];

            return (
              <CCol
                key={item._id}
                md={3}
                className="mb-4"
                ref={isLast ? lastCardRef : null}
              >
                <CCard className="shadow-sm">
                  <CCardImage
                    loading="lazy"
                    orientation="top"
                    src={item.image}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                      filter: isImageLoaded ? "none" : "blur(10px)",
                      transition: "filter 0.5s ease-out",
                    }}
                    onLoad={() =>
                      setLoadedImages((prev) => ({
                        ...prev,
                        [item._id]: true,
                      }))
                    }
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
            );
          })
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
