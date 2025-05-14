import {
  CBadge,
  CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PaginateInput from "../../../components/PaginateInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import { formatDistanceToNow } from "date-fns";
import CIcon from "@coreui/icons-react";
import { cilBell } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PM_REQUEST":
      return { ...state, pmloading: true, error: "" };
    case "FETCH_PM_SUCCESS":
      return {
        ...state,
        pmloading: false,
        preventivemaintanance: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_PM_FAIL":
      return { ...state, pmloading: false, error: action.payload };
    default:
      return state;
  }
};

const PreventiveMaintanancrDashboard = () => {
  const [
    {
      error,
      preventivemaintanance,
      pmloading,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    preventivemaintanance: [],
    pmloading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPm, setSelectedPm] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formData, setFormData] = useState({
    pm_id: "",
    robot_no: "",
    block: "",
    robot_type: "",
    client_name: "",
    doc_no: "",
    revision_no: "",
    revised_by: "",
    site_location: "",
    physical_condition_of_transPipe: {},
    physical_condition_of_channel: {},
    physical_condition_of_top_bottom_cover: {},
    oiling_need_for_bearing: {},
    oiling_need_for_coupling: {},
    oiling_need_for_motors: {},
    alignment: {},
    is_wheels_loose: "",
    is_nutbolt_loose: "",
    start_date: "",
    end_date: "",
    last_activity: [],
  });

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchPreventivemaintenances = async () => {
      dispatch({ type: "FETCH_PM_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/preventivemaintenances/get-preventivemaintenances`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_PM_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_PM_FAIL",
          payload: error.response.data.error,
        });
        toast.error(error.response.data.error);
      }
    };

    fetchPreventivemaintenances();
  }, [authtoken, limit, page]);

  const FilteredPreventivemaintenances = preventivemaintanance
    ? preventivemaintanance.filter(
        (robot) =>
          robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          robot.site_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

  const openModal = (robot) => {
    setSelectedPm(robot);
    setFormData(robot);
    setModalVisible(true);
  };

  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }
  return (
    <div className="p-2">
      <h2 className="text-center">All Preventive Maintenances</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-danger m-1"
          to={`/${adminroute}/preventive-maintanance-dashboard/view`}
        >
          View Sitewise
        </Link>
        <Link
          className="btn btn-sm btn-primary m-1"
          to={`/${adminroute}/preventive-maintanance-dashboard/create-pm`}
        >
          Create New
        </Link>
        <Link
          className="btn btn-sm btn-secondary m-1 d-flex justify-content-center align-items-center"
          to={`/${adminroute}/preventive-maintanance-dashboard/preventive-maintanance-notifications`}
        >
          All PM Activity
          <CIcon icon={cilBell} />
        </Link>
      </div>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Robot No or Site ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>PM ID</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Robot No
            </CTableHeaderCell>

            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Time</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "180px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {pmloading ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : FilteredPreventivemaintenances.length > 0 ? (
            FilteredPreventivemaintenances.map((pm, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{pm.pm_id}</CTableDataCell>
                <CTableDataCell>{pm.robot_no}</CTableDataCell>
                <CTableDataCell>{pm.site_id}</CTableDataCell>
                <CTableDataCell>
                  {/* {pm.createdAt} */}
                  <span>
                    {new Date(pm.createdAt).toLocaleString()}
                    {/* <span>
                        {formatDistanceToNow(new Date(pm.createdAt), {
                          addSuffix: true,
                        })}
                      </span> */}
                  </span>
                </CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="secondary"
                    size="sm"
                    onClick={() => openModal(pm)}
                  >
                    View
                  </Link>

                  <Link
                    className="btn btn-sm btn-warning m-1"
                    to={`/${adminroute}/preventive-maintanance-dashboard/update/${pm._id}`}
                  >
                    Update
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching robots found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      {/* <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
      /> */}
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
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            PM Data :&nbsp;
            <span className="badge bg-success">{formData.pm_id}</span>{" "}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPm && (
            <>
              <CTable bordered responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                {/* <CTableBody>
                  {Object.entries(formData)
                    .filter(
                      ([key]) => key !== "last_activity" && key !== "is_delete"
                    ) //
                    .map(([key, value]) => (
                      <CTableRow key={key} className="align-middle">
                        <CTableDataCell className="fw-semibold text-uppercase text-secondary">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>
                        <CTableDataCell>
                          {typeof value === "boolean" ? (
                            <CBadge
                              color={value ? "success" : "danger"}
                              shape="rounded-pill"
                            >
                              {value ? "Active" : "Inactive"}
                            </CBadge>
                          ) : (key.includes("date") || key.includes("at")) &&
                            key !== "site_location" ? (
                            <span className="">
                              <CTooltip
                                content={new Date(value).toLocaleString()}
                                placement="top"
                              >
                                <span>
                                  {formatDistanceToNow(new Date(value), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </CTooltip>
                            </span>
                          ) : (
                            <span className="text-dark fw-medium">
                              {String(value)}
                            </span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody> */}

                {/* <CTableBody>
                  {Object.entries(formData)
                    .filter(
                      ([key]) => key !== "last_activity" && key !== "is_delete"
                    )
                    .map(([key, value]) => (
                      <CTableRow key={key} className="align-middle">
                        <CTableDataCell className="fw-semibold text-uppercase text-secondary">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>
                        <CTableDataCell>
                          {typeof value === "boolean" ? (
                            <CBadge
                              color={value ? "success" : "danger"}
                              shape="rounded-pill"
                            >
                              {value ? "Active" : "Inactive"}
                            </CBadge>
                          ) : (key.includes("date") || key.includes("at")) &&
                            key !== "site_location" ? (
                            <span>
                              <CTooltip
                                content={new Date(value).toLocaleString()}
                                placement="top"
                              >
                                <span>
                                  {formatDistanceToNow(new Date(value), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </CTooltip>
                            </span>
                          ) : typeof value === "object" && value !== null ? (
                            // Handle Nested Object
                            <div className="d-flex flex-column">
                              {Object.entries(value).map(([subKey, subValue]) =>
                                subKey === "image" ? (
                                  <img
                                    key={subKey}
                                    src={subValue}
                                    alt={key}
                                    width="50"
                                    height="50"
                                  />
                                ) : (
                                  <span
                                    key={subKey}
                                    className="text-dark fw-medium"
                                  >
                                    {subKey.replace(/_/g, " ")}:{" "}
                                    {String(subValue)}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-dark fw-medium">
                              {String(value)}
                            </span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody> */}

                <CTableBody>
                  {Object.entries(formData)
                    .filter(
                      ([key]) => key !== "last_activity" && key !== "is_delete"
                    )
                    .map(([key, value]) => (
                      <CTableRow key={key} className="align-middle">
                        {/* Label Column */}
                        <CTableDataCell className="fw-semibold text-uppercase text-secondary">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>

                        {/* Value Column */}
                        <CTableDataCell>
                          {/* Boolean Fields (Active/Inactive) */}
                          {typeof value === "boolean" ? (
                            <CBadge
                              color={value ? "success" : "danger"}
                              shape="rounded-pill"
                            >
                              {value ? "Active" : "Inactive"}
                            </CBadge>
                          ) : /* Image Fields */
                          key.includes("_image") && value ? (
                            <img src={value} alt={key} width="50" height="50" />
                          ) : /* Date Fields */
                          key.includes("atedAt") && key !== "site_location" ? (
                            <CTooltip
                              content={new Date(value).toLocaleString()}
                              placement="top"
                            >
                              <span>
                                {formatDistanceToNow(new Date(value), {
                                  addSuffix: true,
                                })}
                              </span>
                            </CTooltip>
                          ) : (
                            /* Default Text Value */
                            <span className="text-dark fw-medium">
                              {String(value)}
                            </span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>

              {formData.last_activity && (
                <LastActivity lastactivity={formData.last_activity} />
              )}
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default PreventiveMaintanancrDashboard;
