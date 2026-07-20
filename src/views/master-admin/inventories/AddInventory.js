import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Select from "react-select";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
} from "@coreui/react";

const selectStyles = {
  control: (provided) => ({
    ...provided,
    background: "#111c44",
    border: "none",
    borderRadius: "8px",
    minHeight: "38px",
    cursor: "pointer",
    boxShadow: "none",
  }),
  menu: (provided) => ({
    ...provided,
    background: "#16213e",
    borderRadius: "5px",
    overflow: "hidden",
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    background: "#16213e",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected
      ? "#00d4ff22"
      : state.isFocused
        ? "#1b2a52"
        : "#16213e",
    color: state.isSelected ? "#00d4ff" : "#ffffff",
    padding: 8,
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
    fontWeight: 500,
  }),
  input: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#94a3b8",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#00d4ff" : "#94a3b8",
    "&:hover": { color: "#00d4ff" },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#94a3b8",
    "&:hover": { color: "#ffffff" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "#94a3b8",
  }),
};

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
  // const authtoken = useSelector((state) => state.authtoken);
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

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/service-items`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
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
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
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
  }, []);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const itemOptions = (state.sites || []).map((item) => ({
    value: item.item_name,
    label: item.item_code
      ? `${item.item_name} (${item.item_code})`
      : item.item_name,
    item,
  }));

  const siteOptions = (state.siteIds || []).map((site) => ({
    value: site.site_id,
    label: site.site_id,
    site,
  }));

  const handleItemChange = (selected) => {
    dispatch({ type: "SELECT_SITE_REQUEST" });

    if (!selected?.item) {
      setFormData({ item_name: "", item_id: "", item_code: "" });
      dispatch({ type: "SELECT_SITE_FAIL" });
      return;
    }

    setFormData({
      item_name: selected.item.item_name,
      item_id: selected.item._id,
      item_code: selected.item.item_code,
    });
    dispatch({ type: "SELECT_SITE_SUCCESS", payload: selected.item });
  };

  const handleSiteNameChange = (selected) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    if (!selected?.site) {
      setSiteName({ site_id: "" });
      dispatch({ type: "SELECT_SITENAME_FAIL" });
      return;
    }

    setSiteName({ site_id: selected.site.site_id });
    dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selected.site });
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
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
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

                  <Select
                    name="item_name"
                    options={itemOptions}
                    value={
                      itemOptions.find((o) => o.value === formData.item_name) ||
                      null
                    }
                    onChange={handleItemChange}
                    isSearchable
                    isClearable
                    isLoading={state.loadingSites}
                    placeholder="Search item name..."
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
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
                  <Select
                    name="site_id"
                    options={siteOptions}
                    value={
                      siteOptions.find((o) => o.value === siteName.site_id) ||
                      null
                    }
                    onChange={handleSiteNameChange}
                    isSearchable
                    isClearable
                    isLoading={state.loadingSiteIds}
                    placeholder="Search site..."
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
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
