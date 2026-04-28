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
  CModalFooter,
  CButton,
  CFormLabel,
} from "@coreui/react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import PaginateInput from "../../../components/PaginateInput";

import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import {
  deleteGatewayFromDatabase,
  deleteGatewayFromLns,
} from "./GatewayDeletion";
import GatewayModel from "../../../components/GatewayModel";

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
  // const authtoken = useSelector((state) => state.authtoken);
  const [selectedGateway, setSelectedGateway] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Add these states with your other state declarations
  const [showGatewayDeleteModal, setShowGatewayDeleteModal] = useState(false);
  const [gatewayDeleteType, setGatewayDeleteType] = useState(""); // 'lns' or 'db'
  const [gatewayDeleteReason, setGatewayDeleteReason] = useState("");
  const [isGatewayDeleting, setIsGatewayDeleting] = useState(false);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [viewGateway, setViewGateway] = useState(null);

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
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
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        let total = Math.ceil(
          Number(result.data.data.total) / Number(result.data.data.limit),
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
          error.response?.data?.error || "Failed to fetch DPR by Date",
        );
      }
    };

    fetchGateways();
  }, [limit, page]);

  const Gateways = gateways.filter(
    (gateway) =>
      gateway.gateway_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateway.gateway_name_in_lns_server
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      gateway.gateway_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateway.gateway_id_in_lns_server
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

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

  const openGatewayModal = (gateway) => {
    setViewGateway(gateway);
    setShowGatewayModal(true);
  };

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gateways</h2>
        {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role,
        ) && (
          <Link
            to={`/${adminroute}/all-site-gateways/create-new-gateway`}
            className="btn btn-warning btn-sm"
          >
            Add
          </Link>
        )}
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
            <CTableHeaderCell>Gateway Status</CTableHeaderCell>
            <CTableHeaderCell>Gateway ID in Console</CTableHeaderCell>
            <CTableHeaderCell>Gateway EUI</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Latitude</CTableHeaderCell>
            <CTableHeaderCell>Longitude</CTableHeaderCell>

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
                <CTableHeaderCell colSpan={8}>
                  <LoadingSpinner />
                </CTableHeaderCell>
              </CTableRow>
            ) : Gateways.length === 0 ? (
              <CTableRow className="text-center">
                <CTableHeaderCell colSpan={8}>
                  No Gateways Found
                </CTableHeaderCell>
              </CTableRow>
            ) : (
              Gateways.map((gateway, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{gateway.gateway_id}</CTableDataCell>
                  <CTableDataCell style={{ minWidth: "160px" }}>
                    {gateway.gateway_status ? (
                      <CBadge color="success">Online</CBadge>
                    ) : (
                      <CBadge color="danger">Offline</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {gateway.gateway_id_in_lns_server}
                  </CTableDataCell>
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

                  <CTableDataCell
                    style={{
                      minWidth: [
                        "Master User",
                        "Project User",
                        "Service User",
                      ].includes(userInfo?.role)
                        ? "120px"
                        : "380px",
                    }}
                    className={
                      ["Master User", "Project User", "Service User"].includes(
                        userInfo?.role,
                      )
                        ? "d-flex justify-content-center"
                        : ""
                    }
                  >
                    <CButton
                      className="btn btn-sm btn-info p-1 m-1"
                      onClick={() => openGatewayModal(gateway)}
                    >
                      View Modal
                    </CButton>

                    {/* View Button */}
                    <Link
                      className="btn btn-sm btn-info text-decoration-none p-1 m-1"
                      to={`/${adminroute}/all-site-gateways/view-gateway/${gateway._id}`}
                    >
                      View
                    </Link>

                    {/* Show other buttons only if user is not in restricted roles */}
                    {!["Master User", "Project User", "Service User"].includes(
                      userInfo?.role,
                    ) && (
                      <>
                        <Link
                          className="btn btn-sm btn-success text-decoration-none p-1 m-1"
                          to={`/${adminroute}/all-site-gateways/assign-gateway/${gateway._id}`}
                        >
                          Assign Lora
                        </Link>

                        <Link
                          to={`/${adminroute}/all-site-gateways/update-gateway/${gateway._id}`}
                          className="btn btn-secondary p-1 text-decoration-none btn-sm m-1"
                        >
                          Update
                        </Link>

                        <button
                          className="btn btn-sm btn-danger p-1 m-1"
                          onClick={() => {
                            setSelectedGateway(gateway);
                            setGatewayDeleteType("lns");
                            setShowGatewayDeleteModal(true);
                          }}
                        >
                          Delete- LNS
                        </button>

                        <button
                          className="btn btn-sm btn-outline-warning p-1 m-1"
                          onClick={() => {
                            setSelectedGateway(gateway);
                            setGatewayDeleteType("db");
                            setShowGatewayDeleteModal(true);
                          }}
                        >
                          Delete- DB
                        </button>
                      </>
                    )}
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

      {/* delete gateway */}

      <CModal
        size="sm"
        visible={showGatewayDeleteModal}
        onClose={() => !isGatewayDeleting && setShowGatewayDeleteModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Delete Gateway - {selectedGateway?.gateway_id}
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() =>
              !isGatewayDeleting && setShowGatewayDeleteModal(false)
            }
            style={{ background: "none" }}
            disabled={isGatewayDeleting}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          {isGatewayDeleting ? (
            <div className="text-center">
              <LoadingSpinner />
              <p>Deleting gateway, please wait...</p>
            </div>
          ) : (
            <>
              <p>
                Are you sure you want to delete this gateway from{" "}
                <strong>
                  {gatewayDeleteType === "lns" ? "LNS" : "Database"}
                </strong>
                ?
              </p>
              <CFormLabel>Reason for Deletion</CFormLabel>
              <CFormInput
                type="text"
                placeholder="Enter reason..."
                value={gatewayDeleteReason}
                onChange={(e) => setGatewayDeleteReason(e.target.value)}
                disabled={isGatewayDeleting}
              />
            </>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => {
              setShowGatewayDeleteModal(false);
              setGatewayDeleteReason("");
            }}
            disabled={isGatewayDeleting}
          >
            Cancel
          </CButton>

          <CButton
            color="danger"
            size="sm"
            onClick={async () => {
              if (!gatewayDeleteReason.trim()) {
                toast.error("Reason is required.");
                return;
              }

              setIsGatewayDeleting(true);
              try {
                if (gatewayDeleteType === "lns") {
                  await deleteGatewayFromLns(
                    selectedGateway.gateway_id,

                    gatewayDeleteReason,
                  );
                } else {
                  await deleteGatewayFromDatabase(
                    selectedGateway.gateway_id,

                    gatewayDeleteReason,
                  );
                }
              } catch (error) {
                toast.error("Delete operation failed");
              } finally {
                setIsGatewayDeleting(false);
                setShowGatewayDeleteModal(false);
                setGatewayDeleteReason("");
              }
            }}
            disabled={isGatewayDeleting}
          >
            {isGatewayDeleting ? (
              <LoadingSpinner size="sm" />
            ) : (
              "Confirm Delete"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {showGatewayModal && (
        <GatewayModel
          gateway={viewGateway}
          visible={showGatewayModal}
          onClose={() => {
            setShowGatewayModal(false);
            setViewGateway(null);
          }}
        />
      )}
    </div>
  );
};

export default Gateways;
