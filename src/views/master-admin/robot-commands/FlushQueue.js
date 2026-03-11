import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormSelect,
  CFormCheck,
  CButton,
  CFormInput,
  CBadge,
} from "@coreui/react";
import { useSelector } from "react-redux";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, LoadingRobots: true, robotsError: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        LoadingRobots: false,
        shiftrobots: action.payload,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, LoadingRobots: false, robotsError: action.payload };
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };
    case "SEND_FLUSH_REQUEST":
      return { ...state, loadingFlush: true, flushError: "" };
    case "SEND_FLUSH_SUCCESS":
      return { ...state, loadingFlush: false };
    case "SEND_FLUSH_FAIL":
      return { ...state, loadingFlush: false, flushError: action.payload };
    default:
      return state;
  }
};

const FlushQueue = () => {
  const [
    {
      LoadingRobots,
      shiftrobots,
      sites,
      LoadingDownlink,
      sitesError,
      robotsError,
      loadingSites,
      flushError,
    },
    dispatch,
  ] = useReducer(reducer, {
    shiftrobots: [],
    loadingSites: false,
    sites: [],
    LoadingRobots: false,
    LoadingDownlink: false,
    robotsError: "",
    sitesError: "",
    flushError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  // const userInfo = useSelector((state) => state.userInfo);
  const [site_id, setSiteId] = useState();
  const [selectedRobots, setSelectedRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectAll, setIsSelectAll] = useState(false);

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
          payload: err.response?.data?.error || err.response?.data?.message,
        });
        toast.error(err.response?.data?.error || err.response?.data?.message);
      }
    };
    fetchSites();
  }, [authtoken]);

  useEffect(() => {
    if (!site_id) return;
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const res = await axios.get(
          `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
          { headers: { Authorization: `Bearer ${authtoken}` } },
        );

        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: err.response?.data?.message || err.response?.data?.error,
        });
        toast.error(err.response?.data?.message || err.response?.data?.error);
      }
    };
    fetchRobots();
  }, [site_id, authtoken]);

  const handleCheckboxChange = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.deveui === robot.deveui)
        ? prev.filter((r) => r.deveui !== robot.deveui)
        : [...prev, robot],
    );
  };

  const handleSelectAllDeveuis = () => {
    if (!isSelectAll) {
      setSelectedRobots(filteredRobots);
    } else {
      setSelectedRobots([]);
    }
    setIsSelectAll((prev) => !prev);
  };

  const handleFlushQueue = async () => {
    if (selectedRobots.length === 0) {
      toast.error("Please select at least one robot.");
      return;
    }

    dispatch({ type: "SEND_FLUSH_REQUEST" });

    const deveuiList = selectedRobots.map((r) => r.deveui);

    try {
      const res = await axios.post(
        // "/api/v1/robots/send-downlink-in-bulk",
        "/api/v1/robots/flush-queue",
        { deveuiList },
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      dispatch({ type: "SEND_FLUSH_SUCCESS" });

      toast.success(res.data.message);
      setSelectedRobots([]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "flush failed";
      dispatch({ type: "SEND_FLUSH_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  const filteredRobots = shiftrobots.filter((robot) =>
    robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = sites.find(
      (site) => site.site_id.toString() === selectedSiteName,
    );

    if (selectedSite) {
      setSiteId(selectedSite.site_id);

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  return (
    <div className="p-2">
      <h4 className="text-center mb-4">Flush Queue of Robots</h4>

      <CCardBody>
        <CRow className="mb-3 justify-content-end align-items-center">
          <CCol md="3">
            <div className="mb-3 d-flex flex-column">
              <label className="form-label">Select Site</label>
              {loadingSites ? (
                <LoadingSpinner />
              ) : (
                <CFormSelect
                  name="site_id"
                  value={site_id}
                  onChange={handleSiteNameChange}
                >
                  <option value="">Select Site Name</option>
                  {sites?.length > 0 &&
                    sites.map((item) => (
                      <option key={item.site_id} value={item.site_id}>
                        {item.site_id}
                      </option>
                    ))}
                </CFormSelect>
              )}
            </div>
          </CCol>

          <CCol md={3}>
            <label className="form-label">Search</label>
            <CFormInput
              type="text"
              placeholder="Search by Robot No..."
              className="mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>

        <div className="d-flex justify-content-end mb-3 mt-4">
          {LoadingDownlink ? (
            <LoadingSpinner />
          ) : (
            <>
              {" "}
              <CButton
                className="btn btn-sm btn-danger m-1"
                disabled={selectedRobots.length === 0 || LoadingDownlink}
                onClick={() => handleFlushQueue()}
              >
                Flush
              </CButton>
            </>
          )}
        </div>
        {flushError && <CBadge color="danger">{flushError}</CBadge>}
        <div
          className={`d-flex justify-content-start align-items-center my-2 ${shiftrobots && shiftrobots.length === 0 ? "d-none" : ""}`}
        >
          <span className="me-2">Select All</span>
          <CFormCheck
            checked={isSelectAll}
            onChange={() => handleSelectAllDeveuis()}
            className="me-3"
            style={{}}
          />
        </div>
        {/* {selectedRobots.length > 0 && (
          <div className="mt-3">
            <h5>Flush All Queue of Selected Robots 🔽</h5>
            {selectedRobots.map((robot, index) => (
              <p key={index}>
                {index + 1} Robot No:{" "}
                <span className="text-primary">
                  {robot.robot_no} - [{robot.block}]
                </span>
              </p>
            ))}
          </div>
        )} */}

        <CRow className="g-3 mt-3">
          {LoadingRobots ? (
            <CCol className="text-center py-5">
              <LoadingSpinner />
            </CCol>
          ) : robotsError || sitesError ? (
            <CBadge color="danger" className="">
              {robotsError || sitesError}
            </CBadge>
          ) : filteredRobots.length === 0 ? (
            <CCol className="text-center py-5">No robots found</CCol>
          ) : (
            filteredRobots.map((robot) => (
              <CCol md={3} sm={4} xs={6} key={robot.deveui}>
                <CCard
                  className={`h-100 ${
                    robot.lora_state === 1 ? `bg-success` : `bg-danger`
                  }`}
                >
                  <CCardBody className="d-flex align-items-center p-2">
                    <CFormCheck
                      checked={selectedRobots.some(
                        (r) => r.deveui === robot.deveui,
                      )}
                      onChange={() => handleCheckboxChange(robot)}
                      className="me-3"
                      style={{}}
                    />
                    <div className="flex-grow-1 text-center">
                      <div>{robot.robot_no}</div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))
          )}
        </CRow>
      </CCardBody>
    </div>
  );
};

export default FlushQueue;
