import React, { useEffect, useReducer, useState } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
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

    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "ADD_ROBOTS_REQUEST":
      return { ...state, loadingaddRobots: true, error: "" };
    case "ADD_ROBOTS_SUCCESS":
      return { ...state, loadingaddRobots: false, robots: action.payload };
    case "ADD_ROBOTS_FAIL":
      return { ...state, loadingaddRobots: false, error: action.payload };

    case "SELECT_LORA_REQUEST":
      return { ...state, loadingFields: true };
    case "SELECT_LORA_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedLora: action.payload,
      };
    case "SELECT_LORA_FAIL":
      return { ...state, loadingFields: false };

    default:
      return state;
  }
};

const AddRobotUsingLoraNo = () => {
  const [
    {
      loadingRobots,
      robots,
      lora_configuration,
      loadingaddRobots,
      loadingFields,
      loadingloraconfig,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    lora_configuration: [],
    loadingRobots: false,
    loadingaddRobots: false,
    loadingloraconfig: false,
    loadingFields: false,
    selectedLora: null,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [formData, setFormData] = useState({
    lora_no: "",
    robot_no: "",
    deveui: "",
    site_id: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/robots/get-robots`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
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
          payload: {
            data: result.data.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_LORACONFIG_FAIL",
          payload: "Failed to fetch loraconfigurations",
        });
        toast.error("Failed to fetch loraconfigurations");
      }
    };

    fetchloraconfigurations();
    fetchRobots();
  }, [authtoken, limit, page]);

  // Get only available lora_no (not already in robots array)
  const assignedLoraNos = robots.map((robot) => robot.lora_no);
  const availableLoraConfig = lora_configuration.filter(
    (lora) => !assignedLoraNos.includes(lora.serial)
  );

  // Filter available lora config based on search term
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
      robot_no: lora.robot_no,
      deveui: lora.formatted_deveui,
      site_id: lora.site_id,
    });

    setSearchTerm(lora.serial.toString());
    setShowDropdown(false);

    dispatch({ type: "SELECT_LORA_SUCCESS", payload: lora });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lora_no) {
      toast.error("Please select a valid LoRa No.");
      return;
    }

    const newRobot = {
      ...formData,
      robot_type: "Automatic",
      block: "Block-1",
    };

    try {
      dispatch({ type: "ADD_ROBOTS_REQUEST" });
      const response = await axios.post("/api/v1/robots", newRobot, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      if (response.status === 201) {
        toast.success(`Robot ${formData.robot_no} added successfully!`);

        dispatch({
          type: "ADD_ROBOTS_SUCCESS",
          payload: [...robots, response.data.data],
        });

        setFormData({
          lora_no: "",
          robot_no: "",
          formatted_deveui: "",
          site_id: "",
        });
        setSearchTerm("");
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error) {
      toast.error(error.response.data.error);
      dispatch({
        type: "ADD_ROBOTS_FAIL",
        payload: "Failed to Add robot",
      });
    }
  };

  return (
    <CCard className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Add Robot</h4>
        <Link
          className="btn btn-sm btn-secondary m-1"
          to="/master-admin/activate-robots"
        >
          Activate Robots
        </Link>
      </div>
      <CCardBody className="">
        {loadingRobots && loadingRobots ? (
          <LoadingSpinner />
        ) : (
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={4}>
                <label>Lora No {loadingloraconfig && <LoadingSpinner />}</label>
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
                            className=" p-2 hover-highlight"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => handleLoraSelect(lora)}
                          >
                            {lora.serial}- {lora.robot_no}
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
                  {formData.robot_no && (
                    <CCol md={3}>
                      <label>Robot No</label>
                      <CFormInput
                        type="text"
                        name="robot_no"
                        disabled
                        value={formData.robot_no}
                        readOnly
                      />
                    </CCol>
                  )}

                  {formData.deveui && (
                    <CCol md={3}>
                      <label>Deveui</label>
                      <CFormInput
                        type="text"
                        name="deveui"
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
                        name="site_id"
                        disabled
                        value={formData.site_id}
                        readOnly
                      />
                    </CCol>
                  )}
                </CRow>

                <CRow className="mb-3"></CRow>

                <CButton type="submit" size="sm" color="primary">
                  {loadingaddRobots ? (
                    <>
                      Adding..
                      <LoadingSpinner />
                    </>
                  ) : (
                    "Add Robot"
                  )}
                </CButton>
              </>
            )}
          </CForm>
        )}
      </CCardBody>
    </CCard>
  );
};

export default AddRobotUsingLoraNo;
