import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CInputGroup,
  CFormInput,
  CSpinner,
} from "@coreui/react";
import { FaArrowUp } from "react-icons/fa";

import { FaCircleInfo } from "react-icons/fa6"; // Correct import from FA6
import { Link, useParams } from "react-router-dom";
import "./management.css";
import { robots } from "../../../data";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, downlink: action.payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false };

    case "NOTIFICATION_REQUEST":
      return { ...state, loading: true };

    case "NOTIFICATION_SUCCESS":
      return { ...state, notifications: action.payload, loading: false };

    case "NOTIFICATION_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const RobotOperating = () => {
  const { site_id, block, robot_no } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [siteRobots, setSiteRobots] = useState([]); // Store robots assigned to the site
  const [searchTerm, setSearchTerm] = useState("");
  const authtoken = useSelector((state) => state.authtoken);

  const [{ loading, error, downlink, successDelete }, dispatch] = useReducer(
    reducer,
    { loading: true, error: "" }
  );

  useEffect(() => {
    const getDownlinks = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get("/api/v1/downlinks", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      getDownlinks();
    }

    if (site_id) {
      // ✅ Filter robots assigned to this site

      const extractNumber = (robotNo) =>
        parseInt(robotNo.match(/\d+/g)?.join("") || "0", 10);

      const filteredRobots = robots
        .filter((robot) => robot.site_id === site_id && robot.block === block)
        .sort((a, b) => extractNumber(a.robot_no) - extractNumber(b.robot_no));

      setSiteRobots(filteredRobots); // Store robots in state
    }
  }, [block, site_id, successDelete, authtoken]);

  const deleteDownlink = async (downlink) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await axios.delete(`/api/v1/downlink/${downlink._id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        toast.success("Downlink deleted successfully");

        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);

        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const Robotdata = robots.filter(
    (robot) =>
      robot.site_id === site_id &&
      robot.block === block &&
      robot.robot_no === robot_no
  );
  console.log(Robotdata[0].robot_no);

  return (
    <div className="">
      {/* Page Header */}
      <CRow>
        <CCol>
          <h4 className="fw-bold text-center">
            <span className="text-danger">
              {site_id} - {block}
            </span>
            &nbsp;Robot's Configuration
          </h4>
        </CCol>
      </CRow>

      {/* Action Buttons */}
      <CRow className="my-2">
        <CCol>
          <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
            START ALL
          </CButton>
          <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
            STOP ALL
          </CButton>
          <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
            RETURN TO DOCK ALL
          </CButton>
          <Link
            to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/debug_logs`}
            className="btn btn-sm btn-secondary  btn-sm m-1 shadow-sm"
          >
            DEBUG LOG
          </Link>
          <Link
            to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/cleaning_logs`}
            className="btn btn-sm btn-secondary m-1 shadow-sm"
          >
            CLEANING LOG
          </Link>

          <CDropdown className="dropdown">
            <CDropdownToggle size="sm" className="shadow-sm ">
              {Robotdata[0].robot_no}
            </CDropdownToggle>

            <CDropdownMenu className="px-2 py-1 dropdown-menu">
              {siteRobots.length === 1
                ? ""
                : siteRobots.map((item, index) => (
                    <CDropdownItem
                      key={index}
                      href={`${
                        item.robot_no === robot_no ? `#` : `${item.robot_no}`
                      }`}
                      className={`dopdown-item ${
                        item.lora_state === 1 ? `online` : `offline`
                      }`}
                    >
                      {item.robot_no}
                    </CDropdownItem>
                  ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
      <CRow className="my-2">
        <CCol></CCol>
      </CRow>

      <CRow className="">
        {/* First Card */}
        <CCol md={5} className="mt-2">
          <CCard className="shadow border-0" style={{ height: "100%" }}>
            <CCardBody>
              <CTable borderless>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>
                      <b style={{ fontSize: "15px" }}>
                        {Robotdata[0].robot_no}
                      </b>
                    </CTableDataCell>
                    <CTableDataCell>
                      🔋: {Robotdata[0].battery_percentage}%
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-success">
                        {Robotdata[0].version}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell className="text-danger">
                      {Robotdata[0].deveui}
                    </CTableDataCell>
                    <CTableDataCell>Wheel Speed</CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-danger">
                        {Robotdata[0].wheel_speed}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>
                      Lora:{" "}
                      <span className="text-success">
                        {Robotdata[0].lora_no}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>Brush Speed</CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-secondary">
                        {Robotdata[0].brush_speed}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Second Card */}
        <CCol md={4} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: "100%" }}>
            <CCardBody>
              <CTable borderless>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>
                      <p
                        className={`text-${
                          Robotdata[0].lora_state === 1 ? `success` : `danger`
                        }`}
                      >
                        {Robotdata[0].lora_state === 1 ? `online` : `offline`}
                      </p>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="text-primary">
                        {Robotdata[0].last_status}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>
                      <span className="text-danger">
                        SC : {Robotdata[0].stuck_count}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="text-danger">
                        {Robotdata[0].last_update}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Third Card (Custom Downlink) */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: "100%" }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">Custom Downlink</h6>
                <FaCircleInfo
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setModalVisible(true)}
                />
              </div>
              <form className="position-relative mt-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter command"
                />
                <CButton
                  type="button"
                  className="d-flex justify-content-between align-items-center btn-sm position-absolute send-button"
                >
                  <FaArrowUp />
                </CButton>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal for Commands */}
      <CModal
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Custom Downlink</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="d-flex justify-content-between">
            <CCol xs={12} sm={10} md={6} lg={4}>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search downlink..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol
              className="d-flex justify-content-end align-items-center"
              xs={12}
              sm={10}
              md={6}
              lg={4}
            >
              <Link
                className="btn btn-sm btn-warning justify-content-end"
                size="md"
                // to="/master-admin/site-management/add-downlink"
                to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/add-downlink`}
              >
                Add Downlink
              </Link>
            </CCol>
          </CRow>
          <CTable responsive hover bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ minWidth: "70px" }}>
                  Sr No
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "180px" }}>
                  downlink Command
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "180px" }}>
                  Decoded String
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "180px" }}>
                  Hexa decimal
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "180px" }}>
                  Uplink
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "250px" }}>
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "250px" }}>
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {loading ? (
                <CTableRow className="text-center">
                  <CTableDataCell colSpan={7}>
                    <CSpinner color="primary" />
                  </CTableDataCell>
                </CTableRow>
              ) : error ? (
                <CTableRow>
                  <CTableDataCell
                    colSpan={7}
                    className="text-center text-danger"
                  >
                    {error}
                  </CTableDataCell>
                </CTableRow>
              ) : downlink.length > 0 ? (
                downlink.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>

                    <CTableDataCell>
                      <Link
                        onClick={() =>
                          toast.success("Command sent Successfully!")
                        }
                      >
                        {item.downlink}
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>{item.decodedString}</CTableDataCell>
                    <CTableDataCell>{item.hexadecimal}</CTableDataCell>
                    <CTableDataCell>{item.uplink}</CTableDataCell>
                    <CTableDataCell>{item.additionalInfo}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex">
                        <Link
                          to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/view-downlink/${item._id}`}
                          color=""
                          size="sm"
                          className="btn btn-sm btn-secondary m-1"
                        >
                          View
                        </Link>

                        <Link
                          to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/update-downlink/${item._id}`}
                          color="warning"
                          size="sm"
                          className="btn btn-sm btn-warning m-1"
                        >
                          Edit
                        </Link>

                        <CButton
                          color="danger"
                          size="sm"
                          className="m-1 text-white"
                          onClick={() => deleteDownlink(item)}
                        >
                          Delete
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell className="text-center" colSpan={7}>
                    No Data Found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow className="my-2">
        {/* First Card - Cleaning Cycle */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: "100%" }}>
            <CCardBody>
              <p>Cleaning Cycle</p>
              <CButton className="btn btn-sm btn-secondary m-1 shadow">
                START
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                STOP
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                RETURN
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Second Card - Set Wheel Speed */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: "100%" }}>
            <CCardBody>
              <p>Set Wheel Speed</p>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                LOW
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                MEDIUM
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                HIGH
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Third Card - Set Brush Speed */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: "100%" }}>
            <CCardBody>
              <p>Set Brush Speed</p>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                LOW
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                MEDIUM
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                HIGH
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Fourth Card - Text To Base64 */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: "100%" }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">Text to Base64</h6>
              </div>
              <form className="position-relative mt-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter value"
                />
                <CButton
                  type="button"
                  className="d-flex justify-content-between align-items-center btn-sm position-absolute send-button"
                >
                  <FaArrowUp />
                </CButton>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default RobotOperating;
