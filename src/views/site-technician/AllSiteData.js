import React, { useEffect, useReducer, useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CInputGroup,
  CFormInput,
  CModalFooter,
  CButton,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ALLSITES_REQUEST":
      return { ...state, loadingAllSites: true, error: "" };
    case "FETCH_ALLSITES_SUCCESS":
      return {
        ...state,
        loadingAllSites: false,
        allSites: action.payload.data,
      };
    case "FETCH_ALLSITES_FAIL":
      return { ...state, loadingAllSites: false, error: action.payload };
    default:
      return state;
  }
};

const AllSiteData = () => {
  const [{ allSites, loadingAllSites }, dispatch] = useReducer(reducer, {
    allSites: {},
    loadingAllSites: true,
    error: "",
  });
  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchAllSites = async () => {
      dispatch({ type: "FETCH_ALLSITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites/site/all-sites-data`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_ALLSITES_SUCCESS",
          payload: {
            data: result.data.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ALLSITES_FAIL",
          payload: "Failed to fetch All Sites Data",
        });
        toast.error("Failed to fetch All Sites Data");
      }
    };
    fetchAllSites();
  }, [authtoken]);

  // ✅ Separate state for Online & Offline modals
  const [activeOnlineSite, setActiveOnlineSite] = useState(null);
  const [activeOfflineSite, setActiveOfflineSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  return loadingAllSites ? (
    <div className=" d-flex justify-content-center">
      <LoadingSpinner />
    </div>
  ) : (
    <CContainer fluid>
      <CRow className="my-1 text-center">
        <CCol md={4} className="my-2">
          <CCard className="shadow-sm border-0">
            <CCardBody>
              <h6 className="fw-bold">Total Robots</h6>
              <h4>{allSites.total_robot_count}</h4>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="my-2">
          <CCard className="shadow-sm border-0">
            <CCardBody>
              <h6 className="fw-bold text-success">Online Robots</h6>
              <h4>{allSites.total_online}</h4>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="my-2">
          <CCard className="shadow-sm border-0">
            <CCardBody>
              <h6 className="fw-bold text-danger">Offline Robots</h6>
              <h4>{allSites.total_offline}</h4>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 🔹 Site-wise Robot Stats */}
      <CRow className="mt-4">
        {allSites.sites
          ? allSites.sites.map((site, index) => (
              <CCol md={4} key={index} className="mb-3">
                <CCard className="shadow-sm border-0">
                  <CCardBody>
                    {/* Client Logo */}
                    <div className="text-center">
                      <img
                        src={site.logo}
                        alt={site.siteName}
                        style={{
                          width: "120px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* Client Name */}
                    <h6 className="text-center fw-bold mt-3">
                      {site.siteName}, {site.location}
                    </h6>

                    {/* Robot Status Table */}
                    <CTable striped responsive className="mt-2">
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell className="text-center">
                            Total
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center">
                            Online
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center">
                            Offline
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell className="text-center">
                            <CBadge color="primary">
                              {site.site_total_robots}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {/* ✅ Clickable Badge to Open Online Modal */}
                            <CBadge
                              color="success"
                              onClick={() => setActiveOnlineSite(site.site_id)}
                              style={{ cursor: "pointer" }}
                            >
                              {site.site_total_online}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {/* ✅ Clickable Badge to Open Offline Modal */}
                            <CBadge
                              color="danger"
                              onClick={() => setActiveOfflineSite(site.site_id)}
                              style={{ cursor: "pointer" }}
                            >
                              {site.site_total_offline}
                            </CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>

                {/* ✅ Online Robots Modal */}
                <CModal
                  scrollable
                  size="xl"
                  visible={activeOnlineSite === site.site_id}
                  onClose={() => setActiveOnlineSite(null)}
                >
                  <CModalHeader closeButton={false}>
                    <CModalTitle>
                      {site.siteName} - Online Robots List
                    </CModalTitle>
                    <button
                      type="button"
                      className=" border-0 ms-auto py-0 px-1"
                      onClick={() => setActiveOnlineSite(false)}
                      style={{ background: "none" }}
                    >
                      <CIcon icon={cilX} size="lg" />
                    </button>
                  </CModalHeader>
                  <CModalBody>
                    <>
                      <CRow className="justify-content-end">
                        <CCol xs={12} sm={10} md={6} lg={4}>
                          <CInputGroup className="mb-3">
                            <CFormInput
                              type="text"
                              placeholder="Search Robot..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </CInputGroup>
                        </CCol>
                      </CRow>
                      {/* <CTable responsive hover bordered>
                        <CTableHead color="secondary">
                          <CTableRow>
                            <CTableHeaderCell style={{ minWidth: "20px" }}>
                              #
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Robot No
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Deveui
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Block
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Last Status
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "170px" }}>
                              Last updateAt
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Status
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {site.robots.filter(
                            (robot) =>
                              robot.robot_no
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.deveui
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.block
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.last_status
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          ).length > 0 ? (
                            site.robots
                              .filter(
                                (robot) =>
                                  robot.lora_state === 1 &&
                                  (robot.robot_no
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                    robot.deveui
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    robot.block
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    robot.last_status
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()))
                              )
                              .map((robot, index) => (
                                <CTableRow key={robot.robot_no}>
                                  <CTableHeaderCell
                                    style={{ minWidth: "20px" }}
                                  >
                                    {index + 1}
                                  </CTableHeaderCell>
                                  <CTableDataCell>
                                    {robot.robot_no}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {robot.deveui}
                                  </CTableDataCell>
                                  <CTableDataCell>{robot.block}</CTableDataCell>
                                  <CTableDataCell>
                                    {robot.last_status}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {new Date(robot.updatedAt)
                                      .toLocaleDateString("en-GB")
                                      .replace(/\//g, "-")}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge
                                      color={
                                        robot.lora_state === 1
                                          ? "success"
                                          : "danger"
                                      }
                                    >
                                      {robot.lora_state === 1
                                        ? "Online"
                                        : "Offline"}
                                    </CBadge>
                                  </CTableDataCell>
                                </CTableRow>
                              ))
                          ) : (
                            <CTableRow>
                              <CTableDataCell
                                colSpan="7"
                                className="text-center text-muted"
                              >
                                No online robots found.
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable> */}
                      <CTable responsive hover bordered>
                        <CTableHead color="secondary">
                          <CTableRow>
                            <CTableHeaderCell style={{ minWidth: "20px" }}>
                              #
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Robot No
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Status
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Lora No
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Version
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Deveui
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Block
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Last Status
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "170px" }}>
                              Last updateAt
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {site.robots.filter(
                            (robot) =>
                              robot.robot_no
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.deveui
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.block
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.last_status
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          ).length > 0 ? (
                            site.robots
                              .filter(
                                (robot) =>
                                  robot.lora_state === 1 &&
                                  (robot.robot_no
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                    robot.deveui
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    robot.block
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    robot.last_status
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()))
                              )
                              .map((robot, index) => (
                                <CTableRow key={robot.robot_no}>
                                  <CTableHeaderCell
                                    style={{ minWidth: "20px" }}
                                  >
                                    {index + 1}
                                  </CTableHeaderCell>
                                  <CTableDataCell>
                                    {robot.robot_no}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge
                                      color={
                                        robot.lora_state === 1
                                          ? "success"
                                          : "danger"
                                      }
                                    >
                                      {robot.lora_state === 1
                                        ? "Online"
                                        : "Offline"}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {robot.lora_no}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {robot.version}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {robot.deveui}
                                  </CTableDataCell>
                                  <CTableDataCell>{robot.block}</CTableDataCell>
                                  <CTableDataCell>
                                    {robot.last_status}
                                  </CTableDataCell>

                                  <CTableDataCell style={{ minWidth: "250px" }}>
                                    {robot.last_uplink === null
                                      ? "Robot is not yet activated"
                                      : new Date(
                                          robot.last_uplink
                                        ).toLocaleString()}
                                  </CTableDataCell>
                                </CTableRow>
                              ))
                          ) : (
                            <CTableRow>
                              <CTableDataCell
                                colSpan="7"
                                className="text-center text-muted"
                              >
                                No online robots found.
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      color="secondary"
                      size="sm"
                      onClick={() => setActiveOnlineSite(null)}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

                {/* ✅ Offline Robots Modal */}
                <CModal
                  scrollable
                  size="xl"
                  visible={activeOfflineSite === site.site_id}
                  onClose={() => setActiveOfflineSite(null)}
                >
                  <CModalHeader>
                    <CModalTitle>
                      {site.siteName} - Offline Robots List
                    </CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <>
                      <CRow className="justify-content-end">
                        <CCol xs={12} sm={10} md={6} lg={4}>
                          <CInputGroup className="mb-3">
                            <CFormInput
                              type="text"
                              placeholder="Search Robot..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </CInputGroup>
                        </CCol>
                      </CRow>
                      <CTable responsive hover bordered>
                        <CTableHead color="secondary">
                          <CTableRow>
                            <CTableHeaderCell style={{ minWidth: "20px" }}>
                              #
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Robot No
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Deveui
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Block
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Last Status
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "170px" }}>
                              Last updateAt
                            </CTableHeaderCell>
                            <CTableHeaderCell style={{ minWidth: "150px" }}>
                              Status
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {site.robots.filter(
                            (robot) =>
                              robot.robot_no
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.deveui
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.block
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              robot.last_status
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          ).length > 0 ? (
                            site.robots
                              .filter(
                                (robot) =>
                                  robot.lora_state === 0 &&
                                  (robot.robot_no
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                    robot.deveui
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    robot.block
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    robot.last_status
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()))
                              )
                              .map((robot, index) => (
                                <CTableRow key={robot.robot_no}>
                                  <CTableHeaderCell
                                    style={{ minWidth: "20px" }}
                                  >
                                    {index + 1}
                                  </CTableHeaderCell>
                                  <CTableDataCell>
                                    {robot.robot_no}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {robot.deveui}
                                  </CTableDataCell>
                                  <CTableDataCell>{robot.block}</CTableDataCell>
                                  <CTableDataCell>
                                    {robot.last_status}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {robot.last_uplink === null
                                      ? "Robot is not yet activated"
                                      : new Date(
                                          robot.last_uplink
                                        ).toLocaleString()}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge
                                      color={
                                        robot.lora_state === 1
                                          ? "success"
                                          : "danger"
                                      }
                                    >
                                      {robot.lora_state === 1
                                        ? "Online"
                                        : "Offline"}
                                    </CBadge>
                                  </CTableDataCell>
                                </CTableRow>
                              ))
                          ) : (
                            <CTableRow>
                              <CTableDataCell
                                colSpan="7"
                                className="text-center text-muted"
                              >
                                No Offline robots found.
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      color="secondary"
                      size="sm"
                      onClick={() => setActiveOfflineSite(null)}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CCol>
            ))
          : []}
      </CRow>
    </CContainer>
  );
};

export default AllSiteData;
