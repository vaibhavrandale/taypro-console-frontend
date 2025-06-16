import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import PaginateInput from "../../../components/PaginateInput";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_GATEWAY_REQUEST":
      return { ...state, loadingGateways: true, error: "" };

    case "FETCH_GATEWAY_SUCCESS":
      return {
        ...state,
        loadingGateways: false,
        gateways: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };

    case "FETCH_GATEWAY_FAIL":
      return { ...state, loadingGateways: false, error: action.payload };

    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, error: "" };

    case "FETCH_ROBOT_SUCCESS":
      return {
        ...state,
        loadingRobot: false,
        robot: action.payload.data,
      };

    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, error: action.payload };

    default:
      return state;
  }
};

const Gateways = () => {
  const [
    {
      gateways,
      robot,
      loadingGateways,
      loadingRobot,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    gateways: [],
    robot: {},
    loadingGateways: false,
    loadingRobot: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    loadingSiteIds: false,
    loadingFields: false,
    siteIds: [],
  });
  const authtoken = useSelector((state) => state.authtoken);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpendloading, setModalOpendloadingg] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchGateways = async () => {
      dispatch({ type: "FETCH_GATEWAY_REQUEST" });

      try {
        const data = {
          pg: page,
          limit: limit,
        };

        const result = await axios.post(`/api/v1/gateways/get-gateways`, data, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        let total = Math.ceil(
          Number(result.data.data.total) / Number(result.data.data.limit)
        );

        let next = result.data.data.hasNextPage;
        let prev = result.data.data.hasPrevPage;

        dispatch({
          type: "FETCH_GATEWAY_SUCCESS",
          payload: {
            data: result.data.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_GATEWAY_FAIL",
          payload: error.response?.data?.error || "Failed to fetch DPR by Date",
        });
        toast.error(
          error.response?.data?.error || "Failed to fetch DPR by Date"
        );
      }
    };

    fetchGateways();
  }, [authtoken, limit, page]);

  const Gateways = gateways.filter(
    (gateway) =>
      gateway.gateway_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateway.gateway_name_in_lns_server
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      gateway.gateway_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchRobotByGateway = async (gateway) => {
    setModalOpendloadingg(true);
    dispatch({ type: "FETCH_ROBOT_REQUEST" });

    try {
      const data = await axios.get(
        `/api/v1/robots/get-robot-using-robot-no/${gateway.gateway_robot_no}`,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: data.data });
      setModalOpendloadingg(false);
    } catch (error) {
      dispatch({
        type: "FETCH_ROBOT_FAIL",
        payload: error.response.data.error,
      });
      toast.error(error.response?.data?.error);
      setModalOpendloadingg(false);
    }
  };

  // Function to handle modal open
  const openModal = async (gateway) => {
    setSelectedGateway(gateway);
    if (gateway.gateway_type === "Outdoor" && gateway.gateway_robot_no !== "") {
      await fetchRobotByGateway(gateway); // Fetch robot only when modal opens
    }
    setModalVisible(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedGateway(null);
  };
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gateways</h2>
        <Link
          to={`/${adminroute}/all-site-gateways/create-new-gateway`}
          className="btn btn-warning btn-sm"
        >
          Add
        </Link>
      </div>

      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search by gateway name,type ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>
      {/* Table displaying all gateways */}
      <CTable bordered hover responsive className="bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Gateway Name</CTableHeaderCell>
            <CTableHeaderCell>Gateway ID</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Latitude</CTableHeaderCell>
            <CTableHeaderCell>Longitude</CTableHeaderCell>
            <CTableHeaderCell>Gateway Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        {loading ? (
          <CTableBody>
            <CTableRow className="text-center">
              <CTableDataCell colSpan={7}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        ) : (
          <CTableBody>
            {loadingGateways ? (
              <CTableRow className="text-center">
                <CTableHeaderCell colSpan={7}>
                  <LoadingSpinner />
                </CTableHeaderCell>
              </CTableRow>
            ) : Gateways.length === 0 ? (
              <CTableRow className="text-center">
                <CTableHeaderCell colSpan={7}>
                  No Gateways Found
                </CTableHeaderCell>
              </CTableRow>
            ) : (
              Gateways.map((gateway, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{gateway.gateway_id}</CTableDataCell>
                  <CTableDataCell>{gateway.gateway_name}</CTableDataCell>
                  <CTableDataCell>
                    {gateway.gateway_type.toUpperCase()}
                  </CTableDataCell>
                  <CTableDataCell>
                    {gateway.gateway_lattitude
                      ? gateway.gateway_lattitude
                      : "N/A"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {gateway.gateway_longitude
                      ? gateway.gateway_longitude
                      : "N/A"}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "160px" }}>
                    {gateway.gateway_status ? (
                      <CBadge color="success">Online</CBadge>
                    ) : (
                      <CBadge color="danger">Offline</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "180px" }}>
                    <Link
                      className="btn btn-sm btn-info text-decoration-none p-1 m-1"
                      onClick={() => openModal(gateway)}
                    >
                      View Details
                    </Link>
                    <Link
                      className="btn btn-sm btn-success text-decoration-none p-1 m-1"
                      to={`/${adminroute}/all-site-gateways/assign-gateway/${gateway._id}`}
                    >
                      Assign Lora
                    </Link>
                    <Link
                      to={`/${adminroute}/all-site-gateways/update-gateway/${gateway._id}`}
                      className="btn btn-secondary p-1  text-decoration-none  btn-sm  m-1"
                    >
                      Update
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        )}
      </CTable>
      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit} // New prop
      />
      <CModal
        visible={modalVisible}
        onClose={closeModal}
        size="xl"
        backdrop="static"
        scrollable
      >
        {modalOpendloading ? (
          <LoadingSpinner />
        ) : (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle>
                Gateway{" "}
                <CBadge color="success">
                  {selectedGateway?.gateway_name}-{selectedGateway?.gateway_id}
                </CBadge>{" "}
                Details
              </CModalTitle>
              <button
                type="button"
                className=" border-0 ms-auto py-0 px-1"
                onClick={closeModal}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>
            <CModalBody>
              {selectedGateway && (
                <div>
                  {/* Gateway Information Table */}
                  <h5 className="mb-3">Gateway Information</h5>
                  <CTable striped bordered responsive className="bg-important">
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell>Gateway ID in Lns</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedGateway.gateway_id_in_lns_server}
                        </CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell>Gateway Status</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedGateway.gateway_status ? (
                            <CBadge color="success" className="p-2">
                              Online
                            </CBadge>
                          ) : (
                            <CBadge color="danger" className="p-2">
                              Offline
                            </CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>
                          Gateway Name in LNS Server
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {selectedGateway.gateway_name_in_lns_server}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Longitude,Latitude</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedGateway.gateway_longitude === "" ||
                          selectedGateway.gateway_lattitude === "" ? (
                            "N/A"
                          ) : (
                            <>
                              {selectedGateway.gateway_longitude}&nbsp;,&nbsp;
                              {selectedGateway.gateway_lattitude}&nbsp;{" "}
                              <Link
                                target="blank"
                                to={`https://www.google.com/maps/search/?api=1&query=${selectedGateway.gateway_longitude},${selectedGateway.gateway_lattitude}`}
                              >
                                view on map
                              </Link>
                            </>
                          )}
                        </CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell>SIM Number</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedGateway.gateway_simnumber
                            ? selectedGateway.gateway_simnumber
                            : "N/A"}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Robot Number</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedGateway.gateway_robot_no
                            ? selectedGateway.gateway_robot_no
                            : "N/A"}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>LoRa Number</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedGateway.gateway_lora_no
                            ? selectedGateway.gateway_lora_no
                            : "N/A"}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Last Online Update</CTableHeaderCell>
                        <CTableDataCell>
                          {new Date(
                            selectedGateway.last_uplink
                          ).toLocaleString()}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>

                  {/* Finding the connected robot */}
                  <h5 className="mt-4 mb-3">Connected Robot/Lora</h5>
                  {loadingRobot ? (
                    <LoadingSpinner />
                  ) : robot.robot_no === selectedGateway.gateway_robot_no ? (
                    <CTable
                      striped
                      bordered
                      hover
                      responsive
                      className="bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Site ID</CTableHeaderCell>
                          <CTableHeaderCell>LoRa Serial No</CTableHeaderCell>
                          <CTableHeaderCell>Battery %</CTableHeaderCell>
                          <CTableHeaderCell>Last Seen</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell>{robot.robot_no}</CTableDataCell>
                          <CTableDataCell>
                            {robot.lora_state === 1 ? (
                              <span className="badge bg-success">online</span>
                            ) : (
                              <span className="badge bg-danger">offline</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{robot.site_id}</CTableDataCell>
                          <CTableDataCell>
                            {robot.lora_no}&nbsp;&nbsp;({robot.deveui})
                          </CTableDataCell>
                          <CTableDataCell>
                            {robot.battery_voltage}&nbsp;%
                          </CTableDataCell>
                          <CTableDataCell>
                            {robot.last_uplink === "" || null ? (
                              <CBadge>Lora is not Activaed Yet</CBadge>
                            ) : (
                              new Date(robot.last_uplink).toLocaleString()
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  ) : (
                    <p className="text-muted">No connected robot found.</p>
                  )}

                  <LastActivity lastactivity={selectedGateway.last_activity} />
                </div>
              )}
            </CModalBody>
          </>
        )}
      </CModal>
    </div>
  );
};

export default Gateways;
