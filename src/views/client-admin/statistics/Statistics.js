import React, { useEffect, useReducer, useState } from "react";
import { CRow, CCol, CFormSelect, CFormInput } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";
import RobotAndCleaningGraph from "./RobotAndCleaningGraph";
import RobotAndBatteryGraph from "./RobotAndBatteryGraph";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_BATTERY_REQUEST":
      return { ...state, loading: true };
    case "FETCH_ROBOTS_BATTERY_SUCCESS":
      return { ...state, batteryrobots: action.payload, loading: false };
    case "FETCH_ROBOTS_BATTERY_FAIL":
      return {
        ...state,
        loading: false,
        robotserror: action.payload,
        subscriptiondata: action.subscriptiondata,
      };

    case "FETCH_ROBOTS_CLEANING_REQUEST":
      return { ...state, loading: true };
    case "FETCH_ROBOTS_CLEANING_SUCCESS":
      return { ...state, cleaningrobots: action.payload, loading: false };
    case "FETCH_ROBOTS_CLEANING_FAIL":
      return { ...state, loading: false, cleaningError: action.payload };
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, sitesError: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        sites: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, sitesError: action.payload };
    default:
      return state;
  }
};

const Statistics = () => {
  const [
    {
      loading,
      cleaningError,
      sitesError,
      cleaningrobots,
      batteryrobots,
      loadingSiteIds,
      sites,
      robotserror,
      subscriptiondata,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaningrobots: [],
    batteryrobots: [],
    sites: [],
    loading: true,
    cleaningError: "",
    robotserror: "",
    sitesError: "",
    subscriptiondata: {},
  });

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [site_id, setSiteId] = useState("abc");
  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchBatteryRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_BATTERY_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/sitewise-battery-status/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        console.log(response.data.data);
        dispatch({
          type: "FETCH_ROBOTS_BATTERY_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_BATTERY_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
        });

        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
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
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };
    fetchBatteryRobots();
    fetchSiteIds();
  }, [authtoken, site_id]);

  useEffect(() => {
    const fetchCleaningRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_CLEANING_REQUEST" });
        const response = await axios.get(
          `/api/v1/cleaninglogs/calculated-distance/${startDate}/${endDate}/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_ROBOTS_CLEANING_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_CLEANING_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };

    fetchCleaningRobots();
  }, [authtoken, endDate, site_id, startDate]);

  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };

  const subscriptionErrors = [
    "Subscription expired. Please renew your subscription.",
    "Please subscribe to use this feature.",
    "Payment for the last invoice is pending. Please complete the payment to continue using the service.",
  ];

  return (
    <div>
      {loadingSiteIds ? (
        <LoadingSpinner />
      ) : subscriptionErrors.includes(
          sitesError || robotserror || cleaningError
        ) ? (
        <SubscriptionExpiryCard data={subscriptiondata} error={robotserror} />
      ) : (
        <>
          <CRow className="my-2">
            <CCol>
              <CFormSelect
                name="site_id"
                label="Site Id"
                value={site_id}
                onChange={handleSiteNameChange}
              >
                <option value="all">Select Site Id</option>
                {sites?.length > 0 &&
                  sites.map((item) => (
                    <option key={item.site_id} value={item.site_id}>
                      {item.site_id}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>

            <CCol md={3} xs={12} className="m-1">
              <CFormInput
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={3} xs={12} className="m-1">
              <CFormInput
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
          </CRow>
          <RobotAndBatteryGraph
            batteryrobots={batteryrobots}
            site_id={site_id}
            loading={loading}
            error={robotserror}
          />
          <RobotAndCleaningGraph
            cleaningrobots={cleaningrobots}
            site_id={site_id}
            loading={loading}
            error={cleaningError}
          />
        </>
      )}
    </div>
  );
};

export default Statistics;
