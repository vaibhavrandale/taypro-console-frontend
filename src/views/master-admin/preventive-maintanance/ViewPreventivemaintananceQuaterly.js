import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import TayproLogo from "../../../assets/brand/logoforwhitebg.png";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  CContainer,
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
      return { ...state, pmloading: true, error: "" };
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
  const [
    {
      error,
      preventivemaintanance,
      pmloading,
      loadingSites,
      sites,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
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
  console.log(new Date().toISOString().split("T")[0]);

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
        console.log(result.data.data);
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
          `/api/v1/preventivemaintenances/${startDate}/${endDate}/${site_id}`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        // console.log(result.data.data);

        dispatch({
          type: "FETCH_PM_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_PM_FAIL",
          payload: error.response.data.error,
        });
        toast.error(error.response.data.error);
      }
    };
    fetchSites();
    fetchPreventivemaintenances();
  }, [authtoken, endDate, site_id, startDate]);

  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };

  // const exportToExcel = () => {
  //   // Get the table element by ID or reference
  //   const table = document.querySelector("table"); // Assuming your table is rendered in <table>

  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.table_to_sheet(table); // Converts the full table as it appears

  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Preventive Maintenance");
  //   XLSX.writeFile(workbook, "Preventive_Maintenance.xlsx");
  // };

  // const exportToExcel = () => {
  //   const table = document.querySelector("table"); // Select the table
  //   if (!table) {
  //     console.error("Table not found!");
  //     return;
  //   }

  //   const workbook = XLSX.utils.book_new(); // Create a new workbook
  //   const worksheet = XLSX.utils.table_to_sheet(table); // Convert table to sheet

  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Preventive Maintenance");

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const data = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  //   });

  //   saveAs(data, "Preventive_Maintenance.xlsx");
  // };

  const exportToExcel = () => {
    const table = document.querySelector("table");
    if (!table) {
      console.error("Table not found!");
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

    saveAs(data, "Preventive_Maintenance.xlsx");
  };
  const exportToPDF = () => {
    const doc = new jsPDF("landscape");
    doc.text("Preventive Maintenance Report", 14, 10);

    const table = document.querySelector("table");

    autoTable(doc, { html: table, startY: 20 }); // Ensure autoTable is used this way

    doc.save("Preventive_Maintenance.pdf");
  };

  return (
    <div>
      <CRow>
        <CCol>
          <h2>Preventive Maintenance Records</h2>
          {pmloading ? (
            <CSpinner />
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <form>
                <CRow className="my-3">
                  <CCol md={3}>
                    <div className="m-1">
                      {/* <label className="form-label">Site Id</label> */}
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
                  <CCol md={3} className="m-1">
                    <CFormInput
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </CCol>
                  <CCol md={3} className="m-1">
                    <CFormInput
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </CCol>
                  <CRow className="mb-3">
                    <CCol>
                      <CButton color="primary" onClick={exportToExcel}>
                        Export to Excel
                      </CButton>
                    </CCol>
                    <CCol>
                      <CButton color="danger" onClick={exportToPDF}>
                        Export to PDF
                      </CButton>
                    </CCol>
                  </CRow>
                </CRow>
              </form>
              <div className="table-responsive">
                <CTable bordered hover>
                  {/* <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>
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
                      <CTableHeaderCell colSpan={10} className="text-center">
                        <h4>Preventive Maintenance Checklist Quarterly</h4>
                      </CTableHeaderCell>

                      <CTableHeaderCell colSpan={1} className="text-start">
                        <CTableRow>
                          <CTableHeaderCell>Doc No</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>Revision No</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>Revised By</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>
                            <CTableHeaderCell>Site Location</CTableHeaderCell>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={1} className="text-center">
                        <CTableRow>
                          <CTableHeaderCell>TPL-12</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>1</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>Abhay Singh</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>
                            <CTableHeaderCell>Agar Malwa</CTableHeaderCell>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHeaderCell>

                      <CTableHeaderCell className="text-center">
                        <CTableRow>
                          <CTableHeaderCell>Tech. name</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell> Start Date</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell> End Date</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>
                            <CTableHeaderCell>Robot Type</CTableHeaderCell>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-start">
                        <CTableRow>
                          <CTableHeaderCell>Vaibhav Randale</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>24/05/2025</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell> 24/05/2025</CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>
                            <CTableHeaderCell>Automatic</CTableHeaderCell>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell colSpan={1}></CTableHeaderCell>
                      <CTableHeaderCell colSpan={5} className="">
                        Client Name
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={10} className="text-start">
                        Site location
                      </CTableHeaderCell>
                    </CTableRow>
                    <CTableRow className="text-center">
                      <CTableHeaderCell colSpan={1}>Sr</CTableHeaderCell>

                      <CTableHeaderCell style={{ minWidth: "120px" }}>
                        Robot No
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "130px" }}>
                        Robot Type
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        Site Name
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        Site Location
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Physical Condition - TransPipe
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Physical Condition - Channel
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Oiling Needed (Bearing)
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Oiling Needed (Motors)
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        MF Clothes Alignment
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Wheels Alignment
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Is Wheels Loose
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Is Nut-Bolt Loose
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        Start Date
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "230px" }}>
                        End Date
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead> */}
                  <CTableHead>
                    {/* Top Row - Branding & Title */}
                    <CTableRow className="bg-dark text-white">
                      <CTableHeaderCell colSpan={2} className="text-center">
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
                      <CTableHeaderCell colSpan={7} className="text-center">
                        <h3>Preventive Maintenance Checklist - Quarterly</h3>
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={1}>Doc. No.</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        TPL-12
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={1}>Rev. No.</CTableHeaderCell>
                      <CTableHeaderCell colSpan={1}>1</CTableHeaderCell>
                      <CTableHeaderCell>Revised By</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        Abhay Singh
                      </CTableHeaderCell>
                    </CTableRow>

                    {/* Meta Information Row */}
                    <CTableRow className="bg-light">
                      <CTableHeaderCell>Site Id</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        avaada_agar
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={1}>Client</CTableHeaderCell>
                      <CTableHeaderCell colSpan={1} className="fw-bold">
                        Avaada Pvt.ltd
                      </CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell colSpan={2} className="fw-bold">
                        Agar Malwa ,gerg ,wejfweiu,ogjoweru
                      </CTableHeaderCell>

                      <CTableHeaderCell>Tech. Name</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        Vaibhav Randale
                      </CTableHeaderCell>
                      <CTableHeaderCell>Start Date</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        24/05/2025
                      </CTableHeaderCell>
                      <CTableHeaderCell>End Date</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        24/05/2025
                      </CTableHeaderCell>
                      <CTableHeaderCell>Robot Type</CTableHeaderCell>
                      <CTableHeaderCell className="fw-bold">
                        Automatic
                      </CTableHeaderCell>
                    </CTableRow>

                    {/* Main Table Header */}
                    <CTableRow className="text-center bg-primary text-white">
                      <CTableHeaderCell>Sr. No</CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Robot Type</CTableHeaderCell>
                      <CTableHeaderCell>Site Name</CTableHeaderCell>
                      <CTableHeaderCell>Site Location</CTableHeaderCell>
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
                      <CTableHeaderCell>Start Date</CTableHeaderCell>
                      <CTableHeaderCell>End Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {pmloading ? (
                      <LoadingSpinner />
                    ) : preventivemaintanance?.length > 0 ? (
                      preventivemaintanance.map((client, index) =>
                        client.robots.map((record, idx) => (
                          <CTableRow key={idx} className="text-center">
                            <CTableDataCell>{idx + 1}</CTableDataCell>
                            <CTableDataCell>{record.robot_no}</CTableDataCell>
                            <CTableDataCell>{record.robot_type}</CTableDataCell>
                            <CTableDataCell>{client.site_name}</CTableDataCell>
                            <CTableDataCell>
                              {record.site_location}
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
                            <CTableDataCell>
                              {new Date(record.start_date).toLocaleString()}
                            </CTableDataCell>
                            <CTableDataCell>
                              {new Date(record.end_date).toLocaleString()}
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
