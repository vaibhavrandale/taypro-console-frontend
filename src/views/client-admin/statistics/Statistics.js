import React, { useEffect, useReducer, useState } from "react";
import { CRow, CCol, CFormSelect, CFormInput, CBadge } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import RobotAndCleaningGraph from "./RobotAndCleaningGraph";
import RobotAndBatteryGraph from "./RobotAndBatteryGraph";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_BATTERY_REQUEST":
      return { ...state, batteryLoading: true, batteryError: "" };
    case "FETCH_ROBOTS_BATTERY_SUCCESS":
      return { ...state, batteryrobots: action.payload, batteryLoading: false };
    case "FETCH_ROBOTS_BATTERY_FAIL":
      return {
        ...state,
        batteryLoading: false,
        batteryError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    case "FETCH_ROBOTS_CLEANING_REQUEST":
      return { ...state, cleaningLoading: true, cleaningError: "" };
    case "FETCH_ROBOTS_CLEANING_SUCCESS":
      return {
        ...state,
        cleaningrobots: action.payload,

        cleaningLoading: false,
      };
    case "FETCH_ROBOTS_CLEANING_FAIL":
      return {
        ...state,
        cleaningLoading: false,
        cleaningError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
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
      batteryLoading,
      loadingSiteIds,
      cleaningLoading,
      cleaningError,
      sitesError,
      cleaningrobots,
      batteryrobots,

      sites,
      batteryError,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaningrobots: [],
    batteryrobots: [],
    sites: [],
    batteryLoading: true,
    cleaningLoading: true,
    cleaningError: "",
    batteryError: "",
    sitesError: "",
    subscriptiondata: {},
    subscriptionStatus: "",
  });

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  // const [site_id, setSiteId] = useState(
  //   userInfo.assigned_sites[0].site_id || "abc"
  // );
  const [site_id, setSiteId] = useState(userInfo.assigned_sites[0].site_id);
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

        dispatch({
          type: "FETCH_ROBOTS_BATTERY_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_BATTERY_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data?.subscriptionStatus,
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
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    fetchSiteIds();
    fetchBatteryRobots();
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
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data?.subscriptionStatus,
        });
      }
    };

    fetchCleaningRobots();
  }, [authtoken, endDate, site_id, startDate]);

  // const handleSiteNameChange = (e) => {
  //   const selectedSiteId = e.target.value;
  //   setSiteId(selectedSiteId); // Updates local state
  // };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = sites.find(
      (site) => site.site_id.toString() === selectedSiteName
    );
    console.log(selectedSite);
    if (selectedSite) {
      setSiteId(selectedSite.site_id);

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  // const subscriptionErrors = [
  //   "Subscription expired. Please renew your subscription.",
  //   "Please subscribe to use this feature.",
  //   "Sites Not Found",
  //   "Payment for the last invoice is pending. Please complete the payment to continue using the service.",
  // ];

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  return (
    <div>
      {loadingSiteIds || cleaningLoading || batteryLoading ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={cleaningError || cleaningError}
        />
      ) : cleaningError || batteryError || sitesError ? (
        <CBadge color="danger">
          {cleaningError || batteryError || sitesError}
        </CBadge>
      ) : (
        <>
          <CRow className="my-2">
            <CCol md={3} className="m-1">
              {loadingSiteIds ? (
                <LoadingSpinner />
              ) : sitesError ? (
                sitesError
              ) : (
                <CFormSelect
                  label="Site ID"
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
            loading={batteryLoading}
            error={batteryError}
          />
          <RobotAndCleaningGraph
            cleaningrobots={cleaningrobots}
            site_id={site_id}
            loading={cleaningLoading}
            error={cleaningError}
          />
        </>
      )}
    </div>
  );
};

export default Statistics;
