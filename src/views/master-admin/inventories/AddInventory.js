import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CRow,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        inventoryData: { ...state.inventoryData, [action.name]: action.value },
      };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case "SELECT_SITE_REQUEST":
      return { ...state, loadingFields: true };
    case "SELECT_SITE_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedSite: action.payload,
      };
    case "SELECT_SITE_FAIL":
      return { ...state, loadingFields: false };
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
    default:
      return state;
  }
};

//to create a new inventory
const NewInventory = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    inventoryData: {
      quantity: "",
      threshold: "",
    },
    loading: false,
    success: false,
    loadingFields: false,
    loadingSites: false,
    loadingSiteIds: false,
    siteIds: [],
    sites: [],
    error: "",
  });

  const [formData, setFormData] = useState({
    item_name: "",
    item_id: "",
    item_code: "",
  });

  const [siteName, setSiteName] = useState({
    site_id: "",
  });

  const userInfo = useSelector((state) => state.userInfo);
  // console.log(Robotdata[0].last_uplink);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/service-items`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response.data.error || "Error fetching sites");
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
    fetchSites();
    fetchSiteIds();
  }, [authtoken]);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleSiteChange = (e) => {
    dispatch({ type: "SELECT_SITE_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = state.sites.find(
      (site) => site.item_name.toString() === selectedSiteName
    );

    if (selectedSite) {
      setFormData({
        item_name: selectedSite.item_name,
        item_id: selectedSite._id,
        item_code: selectedSite.item_code,
      });

      dispatch({ type: "SELECT_SITE_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITE_FAIL" });
    }
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = state.siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName
    );

    if (selectedSite) {
      setSiteName({
        site_id: selectedSite.site_id,
      });

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    if (!formData.item_name) {
      toast.error("Please select a valid Site Name");
      return;
    }

    const newData = {
      ...formData,
      ...siteName,
      ...state.inventoryData,
    };
    try {
      await axios.post("/api/v1/service-inventory", newData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Inventory Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });
      setFormData({
        item_name: "",
        item_id: "",
        item_code: "",
      });
      navigate(`/${adminroute}/inventories`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error Adding Inventory",
      });

      toast.error(error.response.data.error || "Error Adding Inventory");
    }
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          <h2>Add Service Inventory</h2>
        </CCardHeader>
        <CCardBody className="">
          <CForm className="space-y-4">
            <CRow className="mb-3">
              <CCol md="4">
                <div className="mb-3">
                  <label className="form-label">
                    Item Name {state.loadingSites && <LoadingSpinner />}{" "}
                  </label>

                  <CFormSelect
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleSiteChange}
                  >
                    <option value="">Select Item Name </option>
                    {state.sites?.length > 0 &&
                      state.sites.map((item) => (
                        <option key={item.item_name} value={item.item_name}>
                          {item.item_name}
                        </option>
                      ))}
                  </CFormSelect>
                </div>
              </CCol>
              {state.loadingFields ? (
                <LoadingSpinner />
              ) : (
                <>
                  {formData.item_id && (
                    <CCol>
                      <div className="mb-3">
                        <label className="form-label">Item Id</label>

                        <input
                          type="text"
                          className="form-control"
                          name="item_id"
                          disabled
                          value={formData.item_id}
                          readOnly
                        />
                      </div>
                    </CCol>
                  )}
                  {formData.item_code && (
                    <CCol>
                      <div className="mb-3">
                        <label className="form-label">Item Code</label>

                        <input
                          type="text"
                          className="form-control"
                          name="item_code"
                          value={formData.item_code}
                          readOnly
                          disabled
                        />
                      </div>
                    </CCol>
                  )}
                </>
              )}
            </CRow>
            <CRow>
              <CCol>
                <div className="mb-3">
                  <label className="form-label">
                    Site Id
                    {state.loadingSiteIds && <LoadingSpinner />}
                  </label>
                  <CFormSelect
                    name="site_id"
                    value={siteName.site_id}
                    onChange={handleSiteNameChange}
                  >
                    <option value="">Select Site Name</option>
                    {state.siteIds?.length > 0 &&
                      state.siteIds.map((item) => (
                        <option key={item.site_id} value={item.site_id}>
                          {item.site_id}
                        </option>
                      ))}
                  </CFormSelect>
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <label className="form-label">Quantity</label>

                  <input
                    type="text"
                    className="form-control"
                    name="quantity"
                    value={state.inventoryData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <label className="form-label">Threshold</label>

                  <input
                    type="text"
                    className="form-control"
                    name="threshold"
                    value={state.inventoryData.threshold}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-3"></CRow>

            <CButton
              onClick={handleSubmit}
              className="btn btn-warning btn-sm"
              disabled={state.loading}
            >
              {state.loading ? (
                <>
                  Adding..
                  <LoadingSpinner />
                </>
              ) : (
                "Add Inventory"
              )}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};
export default NewInventory;
