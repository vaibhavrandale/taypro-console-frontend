import React, { useEffect, useReducer, useState } from "react";
import {
  CForm,
  CFormSelect,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  //   CCardHeader,
  CRow,
  CCol,
} from "@coreui/react";
// import { lora_configuration, robots } from "../../../data"; // Import lora config
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
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
        // lora_configuration: action.payload,
        lora_configuration: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
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
        //  robots: action.payload
        robots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
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

    // ✅ New cases for handling Lora selection loading
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
      error,
      robots,
      lora_configuration,
      loadingloraconfig,
      loadingaddRobots,
      selectedLora,
      loadingFields,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    lora_configuration: [],
    loadingRobots: false,
    loadingaddRobots: false,
    loadingloraconfig: false,
    loadingFields: false, // New state
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
  const [pageInput, setPageInput] = useState("");

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
          // payload: result.data.data

          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
        // console.log(result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: "Failed to fetch robots",
        });
        toast.error("Failed to fetch robots");
      }
    };
    const fetchloraconfigurations = async () => {
      dispatch({ type: "FETCH_LORACONFIG_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/loraconfigurations/get-loraconfigurations`,
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
        // console.log(result.data.data);
        dispatch({
          type: "FETCH_LORACONFIG_SUCCESS",
          // payload: result.data.data,
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
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

  const navigate = useNavigate();
  // Get only available lora_no (not already in robots array)
  const assignedLoraNos = robots.map((robot) => robot.lora_no);
  const availableLoraConfig = lora_configuration.filter(
    (lora) => !assignedLoraNos.includes(lora.serial) // `serial` as unique lora_no
  );
  // console.log(availableLoraConfig);

  // // Handle Lora selection
  // const handleLoraChange = (e) => {
  //   console.log("clicked");

  //   const selectedLoraNo = e.target.value;
  //   const selectedLora = lora_configuration.find(
  //     (lora) => lora.serial.toString() === selectedLoraNo
  //   );
  //   console.log(selectedLora);

  //   if (selectedLora) {
  //     setFormData({
  //       lora_no: selectedLora.serial,
  //       robot_no: selectedLora.robot_no,
  //       deveui: selectedLora.formatted_deveui,
  //       site_id: selectedLora.site_id,
  //     });
  //   }
  // };

  const handleLoraChange = (e) => {
    dispatch({ type: "SELECT_LORA_REQUEST" });

    const selectedLoraNo = e.target.value;
    const selectedLora = lora_configuration.find(
      (lora) => lora.serial.toString() === selectedLoraNo
    );

    if (selectedLora) {
      setFormData({
        lora_no: selectedLora.serial,
        robot_no: selectedLora.robot_no,
        deveui: selectedLora.formatted_deveui,
        site_id: selectedLora.site_id,
      });

      dispatch({ type: "SELECT_LORA_SUCCESS", payload: selectedLora });
    } else {
      dispatch({ type: "SELECT_LORA_FAIL" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lora_no) {
      toast.error("Please select a valid LoRa No.");
      return;
    }

    const newRobot = {
      ...formData,
      robot_type: "Automatic", // Newly added robots start as inactive
      block: "Block-1",
    };

    try {
      dispatch({ type: "ADD_ROBOTS_REQUEST" });
      const response = await axios.post("/api/v1/robots", newRobot, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      if (response.status === 201) {
        toast.success(`Robot ${formData.robot_no} added successfully!`);

        // Update robots state with new data
        dispatch({
          type: "ADD_ROBOTS_SUCCESS",
          payload: [...robots, response.data.data], // Append new robot to state
        });
        navigate("/master-admin/robots");
        // Reset form fields
        setFormData({
          lora_no: "",
          robot_no: "",
          formatted_deveui: "",
          site_id: "",
        });
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

  // console.log(robots);

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
                <label>Lora No</label>
                <CFormSelect
                  name="serial"
                  value={formData.serial}
                  onChange={handleLoraChange}
                >
                  <option value="">Select Lora No</option>
                  {availableLoraConfig.map((lora) => (
                    <option key={lora.serial} value={lora.serial}>
                      {lora.serial}
                    </option>
                  ))}
                </CFormSelect>
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
