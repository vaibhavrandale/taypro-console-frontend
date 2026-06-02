import React, { useReducer, useState } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import SiteSelect from "../../../components/SiteSelect";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ROBOT_MANUAL_REQUEST":
      return { ...state, loadingAddRobotManual: true, error: "" };
    case "ADD_ROBOT_MANUAL_SUCCESS":
      return { ...state, loadingAddRobotManual: false, robots: action.payload };
    case "ADD_ROBOT_MANUAL_FAIL":
      return { ...state, loadingAddRobotManual: false, error: action.payload };

    default:
      return state;
  }
};

const AddSemiAutomaticRobot = () => {
  const [state, dispatch] = useReducer(reducer, {
    robots: [],
    loadingAddRobotManual: false,
    // sites: [],
    // loadingSites: false,
    // error: "",
  });

  const { robots, loadingAddRobotManual, loadingSites } = state;
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const [site_id, setSiteId] = useState("all");
  const [manualRRobotData, setManualRobotData] = useState({
    robot_no: "",
    block: "Block-1",
    deveui: "",
    robot_type: "Semi-Automatic",
    site_id: "",
  });

  const addRobotUsingManualData = async (e) => {
    e.preventDefault();

    if (!manualRRobotData.robot_no || !manualRRobotData.site_id) {
      return toast.error("Please fill all required fields (Robot No, Site)");
    }

    dispatch({ type: "ADD_ROBOT_MANUAL_REQUEST" });

    try {
      // ✅ deveui = robot_no
      const payload = {
        ...manualRRobotData,
        deveui: manualRRobotData.robot_no,
      };

      const response = await axios.post(
        "/api/v1/robots/create-semi-automatic-robot",
        payload,
        {
          //  headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );

      toast.success(`Robot ${manualRRobotData.robot_no} added successfully!`);
      // i want navigate to this link master-admin/semi-automatic-robots
      navigate(`/${adminroute}/semi-automatic-robots`);
      dispatch({
        type: "ADD_ROBOT_MANUAL_SUCCESS",
        payload: [...robots, response.data.data],
      });

      setManualRobotData({
        robot_no: "",
        block: "Block-1",
        deveui: "",
        robot_type: "Semi-Automatic",
        site_id: "",
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ROBOTS_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }
  return (
    <>
      <CCard className="p-3 mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Add Semi-Automatic Robot</h4>
        </div>

        <CCardBody>
          {loadingSites ? (
            <LoadingSpinner />
          ) : (
            <CForm onSubmit={addRobotUsingManualData}>
              <CRow>
                <CCol md={3}>
                  <label>Robot No</label>
                  <CFormInput
                    type="text"
                    value={manualRRobotData.robot_no}
                    onChange={(e) =>
                      setManualRobotData({
                        ...manualRRobotData,
                        robot_no: e.target.value,
                      })
                    }
                  />
                </CCol>

                <CCol md={3}>
                  <label>Block</label>
                  <CFormInput
                    type="text"
                    value={manualRRobotData.block}
                    onChange={(e) =>
                      setManualRobotData({
                        ...manualRRobotData,
                        block: e.target.value,
                      })
                    }
                  />
                </CCol>

                <CCol md={3}>
                  <label>Site ID</label>

                  <SiteSelect
                    value={site_id}
                    onChange={(selectedSiteId) => {
                      setSiteId(selectedSiteId);

                      setManualRobotData((prev) => ({
                        ...prev,
                        site_id: selectedSiteId,
                      }));
                    }}
                  />
                </CCol>
              </CRow>

              <CButton type="submit" size="sm" color="primary" className="mt-3">
                {loadingAddRobotManual ? (
                  <>
                    Adding..
                    <LoadingSpinner />
                  </>
                ) : (
                  "Add Semi-Automatic Robot"
                )}
              </CButton>
            </CForm>
          )}
        </CCardBody>
      </CCard>
    </>
  );
};

export default AddSemiAutomaticRobot;
