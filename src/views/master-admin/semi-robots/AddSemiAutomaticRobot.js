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
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSites: false, error: action.payload };

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
    sites: [],
    loadingSites: false,
    error: "",
  });

  const { robots, loadingAddRobotManual, loadingSites, sites } = state;

  const [manualRRobotData, setManualRobotData] = useState({
    robot_no: "",
    block: "Block-1",
    deveui: "",
    robot_type: "Semi-Automatic",
    site_id: "",
  });

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
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchSiteIds();
  }, [authtoken]);

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
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );

      toast.success(`Robot ${manualRRobotData.robot_no} added successfully!`);

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
                  <CFormSelect
                    value={manualRRobotData.site_id}
                    onChange={(e) =>
                      setManualRobotData({
                        ...manualRRobotData,
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
