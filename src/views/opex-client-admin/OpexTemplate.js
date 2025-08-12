import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CRow,
  CCol,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CImage,
  CFormSelect,
} from "@coreui/react";

import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import LastActivity from "../../components/LastActivity";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_OPEX_REQUEST":
      return { ...state, loadingOpex: true, error: "" };
    case "FETCH_OPEX_SUCCESS":
      return {
        ...state,
        loadingOpex: false,
        opexData: action.payload,
      };
    case "FETCH_OPEX_FAIL":
      return { ...state, loadingOpex: false, error: action.payload };
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, errorSIteIds: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, errorSiteIds: action.payload };
    default:
      return state;
  }
};

const OpexTemplate = () => {
  const [
    { opexData, loadingOpex, error, loadingSiteIds, siteIds, errorSiteIds },
    dispatch,
  ] = useReducer(reducer, {
    opexData: {},
    loadingOpex: true,
    error: "",
    loadingSiteIds: true,
    siteIds: [],
    errorSiteIds: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [opexActivity, setOpexActivity] = useState([]);
  const userInfo = useSelector((state) => state.userInfo);
  const [site_id, setSiteid] = useState(
    userInfo.assigned_sites[0]?.site_id || "abc"
  );

  let adminroute = "";
  if (userInfo.role === "Opex Client Admin") {
    adminroute = "opex-client-admin";
  } else if (userInfo.role === "Opex Site Technician") {
    adminroute = "opex-site-technician";
  }

  useEffect(() => {
    if (
      userInfo.role === "Opex Site Technician" &&
      userInfo.is_master_opex_site_technician
    ) {
      const fetchOpexData = async () => {
        if (!site_id) return; // Prevent call if site_id is still not set

        dispatch({ type: "FETCH_OPEX_REQUEST" });
        try {
          const result = await axios.get(`/api/v1/opex/site/${site_id}`, {
            headers: { Authorization: `Bearer ${authtoken}` },
          });

          dispatch({
            type: "FETCH_OPEX_SUCCESS",
            payload: result.data.data,
          });

          setOpexActivity(result.data.data.cycles.cycle_last_activity);
        } catch (error) {
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Something went wrong";
          dispatch({ type: "FETCH_OPEX_FAIL", payload: message });
          toast.error(message);
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
            payload:
              error.response?.data?.error || error.response?.data?.message,
          });
        }
      };
      fetchOpexData();
      fetchSiteIds();
    }
  }, [authtoken, site_id, userInfo]);

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;

    const selectedSite = siteIds.find(
      (site) => site.site_id === selectedSiteName
    );

    if (selectedSite) {
      setSiteid(selectedSite.site_id);

      dispatch({
        type: "SELECT_SITENAME_SUCCESS",
        payload: selectedSite.site_id,
      });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  if (
    userInfo &&
    userInfo.role === "Opex Site Technician" &&
    !userInfo.is_master_opex_site_technician
  ) {
    return (
      <CCard className="mb-4">
        <CCardHeader>You dont have access to view this data</CCardHeader>
      </CCard>
    );
  }

  return (
    <div className="">
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          {loadingSiteIds ? (
            <LoadingSpinner />
          ) : errorSiteIds ? (
            <CBadge color="warning" className="">
              {errorSiteIds === "Site not found"
                ? "Please contact Admin to view Data"
                : errorSiteIds}
            </CBadge>
          ) : (
            <CFormSelect
              value={site_id}
              onChange={handleSiteNameChange}
              className="form-select"
              aria-label="Select Site"
            >
              <option value="" disabled>
                Select Site
              </option>
              {siteIds.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.site_id}
                </option>
              ))}
            </CFormSelect>
          )}
        </CCol>
      </CRow>

      {loadingOpex ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center">
          <CBadge color="danger" className="p-2">
            {error}
          </CBadge>
        </div>
      ) : (
        <>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex w-100 align-items-center justify-content-between">
                {/* Left: Client Logo */}

                {/* Center: Title */}
                <div className="flex-grow-1 text-center">
                  <h5 className="mb-0">Site Information</h5>
                </div>
              </div>
            </CCardHeader>

            <CCardBody>
              <CRow>
                <CCol md={4}>
                  <div className="d-flex align-items-between mb-3">
                    <div
                      style={{ minWidth: "60px", background: "#DBD9D9" }}
                      className="m-1"
                    >
                      {opexData.client.logo && (
                        <CImage
                          src={opexData.client.logo}
                          width={90}
                          height={60}
                          className="me-2"
                          style={{ objectFit: "contain" }}
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="text-danger mb-0">
                        {opexData.client.client_name}
                      </h6>
                      <CBadge color="success">{opexData.site.site_type}</CBadge>
                    </div>
                  </div>
                  <p className="mb-1">Site : {opexData.site.siteName}</p>
                  <p className="mb-1">Location : {opexData.site.location}</p>
                </CCol>
                <CCol md={4}>
                  <h6 className="text-success">Modules Information</h6>
                  <p className="mb-1">
                    Total Modules :{" "}
                    <span className="">{opexData.total_modules}</span>
                  </p>
                  <p className="mb-1">
                    Cycle Frequency :{" "}
                    <CBadge color="success">{opexData.cycle_frequency}</CBadge>
                  </p>
                  <p className="mb-1">
                    Daily Target : {opexData.modules_cleaned_per_day}
                  </p>
                </CCol>
                <CCol md={4}>
                  <h6 className="text-success">Resources</h6>
                  <p className="mb-1">Robots : {opexData.total_robots}</p>
                  {userInfo.role !== "Opex Site Technician" && (
                    <p className="mb-1">Manpower : {opexData.total_manpower}</p>
                  )}
                  <p className="mb-1">Trolleys : {opexData.total_trolley}</p>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Blocks Configuration Card */}

          {userInfo.role !== "Opex Site Technician" &&
            opexData &&
            opexData.blocks_data.length > 0 && (
              <CCard className="mb-4">
                <CCardHeader>
                  <h5 className="mb-0">Blocks Configuration</h5>
                </CCardHeader>
                <CCardBody>
                  <CTable bordered hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Block No</CTableHeaderCell>
                        <CTableHeaderCell>Robots</CTableHeaderCell>
                        <CTableHeaderCell>Manpower</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {opexData.blocks_data.map((block, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{block.block_no}</CTableDataCell>
                          <CTableDataCell>{block.no_of_robots}</CTableDataCell>
                          <CTableDataCell>
                            {block.no_of_manpower}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            )}

          {/* Cycles Information Card */}
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex w-100 align-items-center justify-content-between">
                {/* Left: Total cycles badge */}
                <div
                  className="d-flex align-items-center"
                  style={{ minWidth: "100px" }}
                ></div>

                {/* Center: Heading */}
                <div className="flex-grow-1 text-center">
                  <h5 className="mb-0">Cycles Information</h5>
                </div>

                {/* Right: Create Cycle button (if role is allowed) */}
              </div>
            </CCardHeader>

            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead color="primary">
                  <CTableRow>
                    <CTableHeaderCell>Cycle</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Modules Planned</CTableHeaderCell>
                    <CTableHeaderCell>Modules cleaned</CTableHeaderCell>
                    <CTableHeaderCell>Modules Remaining</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loadingOpex ? (
                    <LoadingSpinner />
                  ) : opexData.cycles.length > 0 ? (
                    opexData.cycles.map((cycle, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>Cycle {index + 1}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.start_date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.end_date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </CTableDataCell>
                        <CTableDataCell>{cycle.modules_planned}</CTableDataCell>
                        <CTableDataCell>{cycle.modules_cleaned}</CTableDataCell>
                        <CTableDataCell>
                          {cycle.modules_remaining}
                        </CTableDataCell>
                        <CTableDataCell>
                          {cycle.modules_cleaned === cycle.modules_planned ? (
                            <CBadge color="success">Completed</CBadge>
                          ) : (
                            <CBadge color="warning">In Progress</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link
                            className="btn btn-primary btn-sm"
                            // to={`/${adminroute}/opexdata/${site_id}/${opexData._id}/cycle/${cycle._id}`}
                            to={`/${adminroute}/my-opex-data/${site_id}/${opexData._id}/cycle/${cycle._id}`}
                          >
                            Manage
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={8}>
                        No cycles found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <LastActivity lastactivity={opexActivity} />
        </>
      )}
    </div>
  );
};
export default OpexTemplate;
