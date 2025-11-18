import React, { useEffect, useReducer, useState } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormSelect,
} from "@coreui/react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_LORACONFIG_REQUEST":
      return { ...state, loadingloraconfig: true, error: "" };
    case "FETCH_LORACONFIG_SUCCESS":
      return {
        ...state,
        loadingloraconfig: false,
        lora_configuration: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_LORACONFIG_FAIL":
      return { ...state, loadingloraconfig: false, error: action.payload };

    case "FETCH_MDS_REQUEST":
      return { ...state, loadingMds: true, error: "" };
    case "FETCH_MDS_SUCCESS":
      return {
        ...state,
        loadingMds: false,
        mdsDevices: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_MDS_FAIL":
      return { ...state, loadingMds: false, error: action.payload };

    case "ADD_MDS_AUTO_REQUEST":
      return { ...state, loadingAddMdsAuto: true, error: "" };
    case "ADD_MDS_AUTO_SUCCESS":
      return { ...state, loadingAddMdsAuto: false, mdsDevices: action.payload };
    case "ADD_MDS_AUTO_FAIL":
      return { ...state, loadingAddMdsAuto: false, error: action.payload };

    case "ADD_MDS_MANUAL_REQUEST":
      return { ...state, loadingAddMdsManual: true, error: "" };
    case "ADD_MDS_MANUAL_SUCCESS":
      return {
        ...state,
        loadingAddMdsManual: false,
        mdsDevices: action.payload,
      };
    case "ADD_MDS_MANUAL_FAIL":
      return { ...state, loadingAddMdsManual: false, error: action.payload };

    case "SELECT_LORA_REQUEST":
      return { ...state, loadingFields: true };
    case "SELECT_LORA_SUCCESS":
      return { ...state, loadingFields: false, selectedLora: action.payload };
    case "SELECT_LORA_FAIL":
      return { ...state, loadingFields: false };

    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSites: false, error: action.payload };

    default:
      return state;
  }
};

const AddMdsUsingLoraNo = () => {
  const [state, dispatch] = useReducer(reducer, {
    mdsDevices: [],
    lora_configuration: [],
    loadingMds: false,
    loadingAddMdsAuto: false,
    loadingAddMdsManual: false,
    loadingloraconfig: false,
    loadingFields: false,
    selectedLora: null,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    sites: [],
    loadingSites: false,
  });

  const {
    mdsDevices,
    lora_configuration,
    loadingMds,
    loadingAddMdsAuto,
    loadingAddMdsManual,
    loadingloraconfig,
    loadingFields,
    sites,
  } = state;

  const [formData, setFormData] = useState({
    lora_no: "",
    mds_no: "",
    deveui: "",
    site_id: "",
  });

  const [manualMdsData, setManualMdsData] = useState({
    mds_no: "",
    block: "Block-1",
    deveui: "",
    site_id: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(10);

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response?.data?.error || "Error fetching sites");
      }
    };

    const fetchMdsDevices = async () => {
      dispatch({ type: "FETCH_MDS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/mds-device/getAll-mds`,
          { pg: page, limit },
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );
        dispatch({
          type: "FETCH_MDS_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: Math.ceil(result.data.total / result.data.limit),
            hasNextPage: result.data.hasNextPage,
            hasPrevPage: result.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_MDS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    const fetchloraconfigurations = async () => {
      dispatch({ type: "FETCH_LORACONFIG_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/loraconfigurations/fetch-all-loras`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_LORACONFIG_SUCCESS",
          payload: { data: result.data.data },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_LORACONFIG_FAIL",
          payload: "Failed to fetch loraconfigurations",
        });
        toast.error("Failed to fetch loraconfigurations");
      }
    };

    fetchSiteIds();
    fetchloraconfigurations();
    fetchMdsDevices();
  }, [authtoken, limit, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lora_no) return toast.error("Please select a valid LoRa No.");
    dispatch({ type: "ADD_MDS_AUTO_REQUEST" });
    try {
      const response = await axios.post(
        "/api/v1/mds-device/create-mds-using-lora",
        { ...formData, block: "Block-1" },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      toast.success(`MDS ${formData.mds_no} added successfully!`);
      dispatch({
        type: "ADD_MDS_AUTO_SUCCESS",
        payload: [...mdsDevices, response.data.data],
      });
      setFormData({ lora_no: "", mds_no: "", deveui: "", site_id: "" });
      setSearchTerm("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to Add MDS");
      dispatch({ type: "ADD_MDS_AUTO_FAIL", payload: "Failed to Add MDS" });
    }
  };

  const addMdsUsingManualData = async (e) => {
    e.preventDefault();
    if (
      !manualMdsData.mds_no ||
      !manualMdsData.deveui ||
      !manualMdsData.site_id
    ) {
      return toast.error(
        "Please fill all required fields (MDS ID, Deveui, Site)"
      );
    }
    dispatch({ type: "ADD_MDS_MANUAL_REQUEST" });
    try {
      const response = await axios.post(
        "/api/v1/mds-device/create-mds-using-manual-data",
        manualMdsData,
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      toast.success(`MDS ${manualMdsData.mds_no} added successfully!`);
      dispatch({
        type: "ADD_MDS_MANUAL_SUCCESS",
        payload: [...mdsDevices, response.data.data],
      });
      setManualMdsData({
        mds_no: "",
        block: "Block-1",
        deveui: "",
        site_id: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add MDS manually");
      dispatch({
        type: "ADD_MDS_MANUAL_FAIL",
        payload: error.response?.data?.error,
      });
    }
  };

  const assignedLoraNos = mdsDevices.map((mds) => mds.lora_no);
  const availableLoraConfig = lora_configuration.filter(
    (lora) => !assignedLoraNos.includes(lora.serial)
  );
  const filteredLoraConfig = availableLoraConfig.filter((lora) =>
    lora.serial.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleLoraSelect = (lora) => {
    dispatch({ type: "SELECT_LORA_REQUEST" });
    setFormData({
      lora_no: lora.serial,
      mds_no: lora.robot_no,
      deveui: lora.formatted_deveui,
      site_id: lora.site_id,
    });
    setSearchTerm(lora.serial.toString());
    setShowDropdown(false);
    dispatch({ type: "SELECT_LORA_SUCCESS", payload: lora });
  };

  return (
    <>
      <CCard className="p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Add MDS</h4>
          <Link
            className="btn btn-sm btn-secondary m-1"
            to="/master-admin/activate-mds"
          >
            Activate MDS
          </Link>
        </div>
        <CCardBody className="p-4 mb-4">
          {loadingMds ? (
            <LoadingSpinner />
          ) : (
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={4}>
                  <label>
                    Lora No {loadingloraconfig && <LoadingSpinner />}
                  </label>
                  <div style={{ position: "relative" }}>
                    <CFormInput
                      type="text"
                      placeholder="Search Lora No..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && searchTerm && (
                      <div
                        className="bg-important"
                        style={{
                          position: "absolute",
                          width: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                          zIndex: 1000,
                          border: "1px solid #fff",
                          borderRadius: "4px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {filteredLoraConfig.length === 0 ? (
                          <div className="p-2 text-muted">
                            No matching Lora found
                          </div>
                        ) : (
                          filteredLoraConfig.map((lora) => (
                            <div
                              key={lora.serial}
                              className="p-2 hover-highlight"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleLoraSelect(lora)}
                            >
                              {lora.serial} - {lora.robot_no}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </CCol>
              </CRow>
              {loadingFields ? (
                <LoadingSpinner />
              ) : (
                <>
                  <CRow>
                    {formData.mds_no && (
                      <CCol md={3}>
                        <label>MDS ID</label>
                        <CFormInput
                          type="text"
                          disabled
                          value={formData.mds_no}
                          readOnly
                        />
                      </CCol>
                    )}
                    {formData.deveui && (
                      <CCol md={3}>
                        <label>Deveui</label>
                        <CFormInput
                          type="text"
                          disabled
                          value={formData.deveui}
                          readOnly
                        />
                      </CCol>
                    )}
                    {formData.site_id && (
                      <CCol md={3}>
                        <label>Site ID</label>
                        <CFormInput
                          type="text"
                          disabled
                          value={formData.site_id}
                          readOnly
                        />
                      </CCol>
                    )}
                  </CRow>
                  <CRow className="mb-3"></CRow>
                  <CButton type="submit" size="sm" color="primary">
                    {loadingAddMdsAuto ? (
                      <>
                        Adding..
                        <LoadingSpinner />
                      </>
                    ) : (
                      "Add MDS"
                    )}
                  </CButton>
                </>
              )}
            </CForm>
          )}
        </CCardBody>
      </CCard>

      <CCard className="p-3 mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Add MDS Using Manual Data</h4>
        </div>
        <CCardBody>
          {loadingMds ? (
            <LoadingSpinner />
          ) : (
            <CForm onSubmit={addMdsUsingManualData}>
              <CRow>
                <CCol md={3}>
                  <label>MDS ID</label>
                  <CFormInput
                    type="text"
                    value={manualMdsData.mds_no}
                    onChange={(e) =>
                      setManualMdsData({
                        ...manualMdsData,
                        mds_no: e.target.value,
                      })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label>Block</label>
                  <CFormInput
                    type="text"
                    value={manualMdsData.block}
                    onChange={(e) =>
                      setManualMdsData({
                        ...manualMdsData,
                        block: e.target.value,
                      })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label>Deveui</label>
                  <CFormInput
                    type="text"
                    value={manualMdsData.deveui}
                    onChange={(e) =>
                      setManualMdsData({
                        ...manualMdsData,
                        deveui: e.target.value,
                      })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label>Site ID</label>
                  <CFormSelect
                    value={manualMdsData.site_id}
                    onChange={(e) =>
                      setManualMdsData({
                        ...manualMdsData,
                        site_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Site</option>
                    {sites.map((item) => (
                      <option key={item.site_id} value={item.site_id}>
                        {item.site_id}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CButton type="submit" size="sm" color="primary" className="mt-3">
                {loadingAddMdsManual ? (
                  <>
                    Adding..
                    <LoadingSpinner />
                  </>
                ) : (
                  "Add MDS Manually"
                )}
              </CButton>
            </CForm>
          )}
        </CCardBody>
      </CCard>
    </>
  );
};

export default AddMdsUsingLoraNo;
