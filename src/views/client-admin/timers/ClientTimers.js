import React, { useState, useEffect, useReducer } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import PaginateInput from "../../../components/PaginateInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
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
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };

    case "FETCH_TIMER_REQUEST":
      return { ...state, loadingAllTimers: true, error: "" };
    case "FETCH_TIMER_SUCCESS":
      return {
        ...state,
        loadingAllTimers: false,
        timers: action.payload.data,
      };
    case "FETCH_TIMER_FAIL":
      return { ...state, loadingAllTimers: false, error: action.payload };
    default:
      return state;
  }
};

const ClientTimers = () => {
  const [state, dispatch] = useReducer(reducer, {
    timers: {},
    loadingAllTimers: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    updateLoading: false,
  });

  const [pageInput, setPageInput] = useState("");
  const [site_id, setSiteId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
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
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response.data.error || "Error fetching sites");
      }
    };

    const fetchAllTimers = async () => {
      dispatch({ type: "FETCH_TIMER_REQUEST" });
      try {
        const data = {
          pg: page,
          limit: limit,
          site_id: site_id,
        };

        const result = await axios.post(`/api/v1/robots/get-timer`, data, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_TIMER_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_TIMER_FAIL",
          payload: "Failed to fetch the Timers",
        });
        toast.error("Failed to fetch the Timers");
      }
    };
    fetchSiteIds();
    fetchAllTimers();
  }, [authtoken, limit, page, site_id]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.item(uniqueSitenames);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= state.totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= state.totalPages
    ) {
      handlePageChange(pageNumber);
    }
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = state.siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName
    );

    if (selectedSite) {
      setSiteId(selectedSite.site_id);

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
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
  } else if (userInfo?.role === "Client Technician") {
    adminroute = "client-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  return (
    <div className="p-4">
      <h2>⏳ Timers Management</h2>

      {/* 📌 Site Filter */}
      <CRow className="justify-content-start mb-3">
        <CCol md={4}>
          <CFormSelect
            name="site_id"
            value={site_id}
            onChange={handleSiteNameChange}
          >
            <option value="">All</option>
            {state.siteIds?.length > 0 &&
              state.siteIds.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))}
          </CFormSelect>
        </CCol>
      </CRow>

      {/* 📝 Timers Table */}
      <CCard className="shadow-sm">
        <CCardHeader>
          <h5 className="m-0">
            📋 Timers for &nbsp;
            <b>{site_id ? site_id : "All Sites"}</b>
          </h5>
        </CCardHeader>
        <CCardBody>
          <CTable bordered hover responsive className="bg-important">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Sr</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Block</CTableHeaderCell>
                <CTableHeaderCell>Total Robots</CTableHeaderCell>
                <CTableHeaderCell>Timer 1</CTableHeaderCell>
                <CTableHeaderCell>Date 1</CTableHeaderCell>
                <CTableHeaderCell>Timer 2</CTableHeaderCell>
                <CTableHeaderCell>Date 2</CTableHeaderCell>
                <CTableHeaderCell>Timer 3</CTableHeaderCell>
                <CTableHeaderCell>Date 3</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {state.loadingAllTimers ? (
                <CTableRow className="text-center">
                  <CTableDataCell colSpan={11}>
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : state.timers.length > 0 ? (
                state.timers.flatMap((site, siteIndex) =>
                  site.blocks.map((block, blockIndex) => (
                    <CTableRow key={`${siteIndex}-${blockIndex}`}>
                      <CTableDataCell>
                        {siteIndex * site.blocks.length + blockIndex + 1}
                      </CTableDataCell>
                      <CTableDataCell>{site.site_id}</CTableDataCell>
                      <CTableDataCell>{block.block}</CTableDataCell>
                      <CTableDataCell>
                        {block.total_robots_in_block}
                      </CTableDataCell>

                      <CTableDataCell>
                        {block.robots[0]?.timer1 === "25:00:00" ? (
                          <CBadge color="danger">Disabled</CBadge>
                        ) : (
                          block.robots[0]?.timer1
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {block.robots[0]?.timer1_date}
                      </CTableDataCell>
                      <CTableDataCell>
                        {block.robots[0]?.timer2 === "25:00:00" ? (
                          <CBadge color="danger">Disabled</CBadge>
                        ) : (
                          block.robots[0]?.timer2
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {block.robots[0]?.timer2_date}
                      </CTableDataCell>
                      <CTableDataCell>
                        {block.robots[0]?.timer3 === "25:00:00" ? (
                          <CBadge color="danger">Disabled</CBadge>
                        ) : (
                          block.robots[0]?.timer3
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {block.robots[0]?.timer3_date}
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link
                          className="btn btn-sm btn-warning m-1"
                          to={`/${adminroute}/timers/${block.block}/${site.site_id}`}
                        >
                          Update
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan="11"
                    className="text-center text-danger"
                  >
                    No blocks found for this site.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
          <PaginateInput
            page={page}
            totalPages={state.totalPages}
            hasPrevPage={state.hasPrevPage}
            hasNextPage={state.hasNextPage}
            pageInput={pageInput}
            handlePageChange={handlePageChange}
            handlePageInputChange={handlePageInputChange}
            handlePageInputSubmit={handlePageInputSubmit}
            limit={limit}
            handleLimitChange={setLimit}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ClientTimers;
