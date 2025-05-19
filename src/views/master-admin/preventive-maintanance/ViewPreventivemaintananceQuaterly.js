import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import TayproLogo from "../../../assets/brand/logoforwhitebg.png";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CAvatar,
  CFormSelect,
  CFormInput,
  CButton,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PM_REQUEST":
      return {
        ...state,
        pmloading: true,
        error: "",
        preventivemaintanance: [],
      };
    case "FETCH_PM_SUCCESS":
      return {
        ...state,
        pmloading: false,
        preventivemaintanance: action.payload,
      };
    case "FETCH_PM_FAIL":
      return { ...state, pmloading: false, error: action.payload };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };
    default:
      return state;
  }
};
const ViewPreventivemaintananceQuaterly = () => {
  const [{ preventivemaintanance, pmloading, loadingSites, sites }, dispatch] =
    useReducer(reducer, {
      preventivemaintanance: [],
      loadingSites: false,
      sites: [],
      pmloading: true,
      error: "",
    });
  const authtoken = useSelector((state) => state.authtoken);

  const [site_id, setSiteId] = useState("all");

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response.data.error,
        });
        toast.error("Failed to fetch sites");
      }
    };

    const fetchPreventivemaintenances = async () => {
      dispatch({ type: "FETCH_PM_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/preventivemaintenances/sites-with-date/${startDate}/${endDate}/${site_id}`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_PM_SUCCESS",
          payload: result.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_PM_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
        toast.error(error.response.data.error || error.response.data.message);
        dispatch({
          type: "FETCH_PM_SUCCESS",
          payload: [],
        });
      }
    };
    fetchSites();
    fetchPreventivemaintenances();
  }, [authtoken, endDate, site_id, startDate]);

  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };

  const exportToExcel = () => {
    const table = document.querySelector("table");
    if (!table) {
      console.error("Table not found!");
      return;
    }
    if (preventivemaintanance.length === 0) {
      toast.error("No data found to export");
      return;
    }

    // Convert table to worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table, { raw: true });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Preventive Maintenance");

    // Write to file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(
      data,
      `${site_id}_${startDate}_${endDate}_Site_Preventive_Maintenance.xlsx`
    );
  };

  return (
    <div>
      <CRow>
        <CCol>
          <h2>Preventive Maintenance Records</h2>
          {pmloading ? (
            <CSpinner />
          ) : (
            <>
              <form>
                <CRow className="my-3">
                  {/* Inputs aligned to the left */}
                  <CCol md={7} xs={12} className="d-flex flex-wrap gap-2">
                    <CCol md={4} xs={12}>
                      <div className="m-1">
                        <CFormSelect
                          name="site_id"
                          value={site_id}
                          onChange={handleSiteNameChange}
                        >
                          <option value="all">All Data</option>
                          {loadingSites ? (
                            <LoadingSpinner />
                          ) : (
                            sites?.length > 0 &&
                            sites.map((item) => (
                              <option key={item.site_id} value={item.site_id}>
                                {item.site_id}
                              </option>
                            ))
                          )}
                        </CFormSelect>
                      </div>
                    </CCol>
                    <CCol md={3} xs={12} className="m-1">
                      <CFormInput
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </CCol>
                    <CCol md={3} xs={12} className="m-1">
                      <CFormInput
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </CCol>
                  </CCol>

                  <CCol
                    md={5}
                    xs={12}
                    className="d-flex justify-content-md-end justify-content-center align-items-center mt-2 mt-md-0"
                  >
                    <CButton color="primary" size="sm" onClick={exportToExcel}>
                      Export
                    </CButton>
                  </CCol>
                </CRow>
              </form>
              <div className="table-responsive">
                <CTable bordered hover>
                  <CTableHead>
                    {/* Top Row - Branding & Title */}
                    <CTableRow className="bg-dark text-white">
                      <CTableHeaderCell colSpan={1} className="text-center">
                        <CAvatar
                          src={TayproLogo}
                          alt="Taypro Logo"
                          className="sidebar-brand-full logo"
                          style={{
                            height: "70px",
                            width: "200px",
                            objectFit: "contain",
                          }}
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={2} className="text-center">
                        <h3>Preventive Maintenance Checklist - Quarterly</h3>
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={1}>
                        Doc. No. : TPL-12
                      </CTableHeaderCell>

                      <CTableHeaderCell colSpan={1}>
                        Rev. No.: 1
                      </CTableHeaderCell>

                      <CTableHeaderCell>Revised By</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        Abhay Singh
                      </CTableHeaderCell>
                      <CTableHeaderCell>Start Date</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        {preventivemaintanance.start_date}
                      </CTableHeaderCell>
                      <CTableHeaderCell>End Date</CTableHeaderCell>
                      <CTableHeaderCell colSpan={2} className="fw-bold">
                        {preventivemaintanance.end_date}
                      </CTableHeaderCell>
                    </CTableRow>

                    {/* Meta Information Row */}
                    <CTableRow className="bg-light">
                      <CTableHeaderCell>Site Id</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        {preventivemaintanance.site_id}
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={1}>Client</CTableHeaderCell>
                      <CTableHeaderCell colSpan={1} className="fw-bold">
                        {preventivemaintanance.site_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell colSpan={2} className="fw-bold">
                        {preventivemaintanance.site_location}
                      </CTableHeaderCell>

                      <CTableHeaderCell>Tech. Name</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        {preventivemaintanance.technician_present?.join(", ")}
                      </CTableHeaderCell>

                      <CTableHeaderCell>Robot Type</CTableHeaderCell>
                      <CTableHeaderCell colSpan={2} className="fw-bold">
                        Automatic
                      </CTableHeaderCell>
                    </CTableRow>

                    {/* Main Table Header */}
                    <CTableRow className="text-center ">
                      <CTableHeaderCell style={{ maxWidth: "100px" }}>
                        Sr. No
                      </CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Robot Type</CTableHeaderCell>
                      <CTableHeaderCell>Created Date</CTableHeaderCell>

                      <CTableHeaderCell>
                        Physical Condition - TransPipe
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        Physical Condition - Channel
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        Oiling Needed (Bearing)
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        Oiling Needed (Motors)
                      </CTableHeaderCell>
                      <CTableHeaderCell>MF Clothes Alignment</CTableHeaderCell>
                      <CTableHeaderCell>Wheels Alignment</CTableHeaderCell>
                      <CTableHeaderCell>Are Wheels Loose?</CTableHeaderCell>
                      <CTableHeaderCell>Are Nut-Bolts Loose?</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {pmloading ? (
                      <LoadingSpinner />
                    ) : preventivemaintanance.data?.length > 0 ? (
                      preventivemaintanance.data.map((client, index) =>
                        client.robots.map((record, idx) => (
                          <CTableRow key={idx} className="text-center">
                            <CTableDataCell>{idx + 1}</CTableDataCell>
                            <CTableDataCell>{record.robot_no}</CTableDataCell>
                            <CTableDataCell>{record.robot_type}</CTableDataCell>
                            <CTableDataCell>
                              {record.createdAt
                                ? record.createdAt.slice(0, 10)
                                : "NA"}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.physical_condition_of_transPipe_condition}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.physical_condition_of_channel_condition}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.oiling_need_for_bearing_condition}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.oiling_need_for_motors_condition}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.mf_clothes_alignment}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.wheels_alignment}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.is_wheels_loose ? "Yes" : "No"}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.is_nutbolt_loose ? "Yes" : "No"}
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      )
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={15} className="text-start">
                          <span className="badge bg-danger">No Data Found</span>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default ViewPreventivemaintananceQuaterly;
