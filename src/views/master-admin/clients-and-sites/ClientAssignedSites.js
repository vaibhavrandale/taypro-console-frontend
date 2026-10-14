import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CBadge,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import LastActivity from "../../../components/LastActivity";

const dayText = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) : "—";

const STATUS_LABEL = {
  in_warranty: "In warranty",
  out_of_warranty: "Out of warranty",
  in_amc: "In AMC",
  out_of_amc: "AMC expired",
  ground: "Ground",
  rooftop: "Rooftop",
};

const toActivity = (item) => {
  if (item?.details) return item;
  const next = item?.next || {};
  const previous = item?.previous || {};
  const details =
    Object.keys(next)
      .map((key) => `${key}: "${previous[key] ?? ""}" to "${next[key]}"`)
      .join(", ") || item?.reason || "Updated";
  return { ...item, details };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        sites: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_FORM":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };

    case "SET_ADD_MODAL":
      return {
        ...state,
        addModalVisible: action.payload,
        formData: action.payload
          ? state.formData
          : {
              siteName: "",
              location: "",
              site_id: "",
              site_type: "",
              client_id: "",
            }, // Reset form when closing
      };

    case "ADD_SITE_START":
      return { ...state, adding: true };
    case "ADD_SITE_SUCCESS":
      return {
        ...state,
        adding: false,
        addModalVisible: false,
      };
    case "ADD_SITE_ERROR":
      return { ...state, adding: false };

    case "SET_SELECTED_SITE":
      return { ...state, selectedSite: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false };
    default:
      return state;
  }
};

const ClientAssignedSites = () => {
  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const API_BASE_URL = "/api/v1";

  const initialState = {
    sites: [],
    loading: false,
    adding: false,
    updating: false,
    deleting: false,
    error: null,
    modalVisible: false,
    addModalVisible: false,
    deleteModal: false,
    selectedSite: null,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    formData: {
      siteName: "",
      location: "",
      site_id: "",
      site_type: "",
      client_id: id,
      project_code: "",
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [pageInput, setPageInput] = useState("");
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detail, setDetail] = useState(null);
  const userInfo = useSelector((state) => state.userInfo);
  const canManage = !["Master User", "Project User", "Service User", "Service Admin"].includes(userInfo?.role);
  const canEdit = canManage || userInfo?.role === "Service Admin";
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  useEffect(() => {
    const fetchClientSites = async () => {
      try {
        dispatch({ type: "FETCH_START" });
        const response = await axios.post(
          `${API_BASE_URL}/sites/get-sites/${id}`,
          { pg: page, limit: limit },
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit),
        );
        let next = response.data.hasNextPage;
        let prev = response.data.hasPrevPage;

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ERROR",
          payload: error.response?.data?.error || error.response.data.message,
        });
        toast.error(error.response?.data?.error || error.response.data.message);
      }
    };
    fetchClientSites();
  }, [id, limit, page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FORM", field: name, value });
  };

  const handleAddSite = async () => {
    if (!state.formData.siteName || !state.formData.location) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const { id, ...filderedData } = state.formData;

      dispatch({ type: "ADD_SITE_START" });
      const response = await axios.post(`${API_BASE_URL}/sites`, filderedData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      dispatch({ type: "ADD_SITE_SUCCESS", payload: response.data.data });
      dispatch({ type: "RESET_FORM" }); // 👈 add this here

      dispatch({ type: "SET_ADD_MODAL", payload: false });
      toast.success("Site added successfully!");
    } catch (error) {
      toast.error(error.response.data.error);

      dispatch({ type: "ADD_SITE_ERROR", payload: error.response.data.error });
    }
  };

  // Handle delete site
  const handleDelete = async (site) => {
    if (site.is_delete) {
      toast.error("This site is already deleted.");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to ${
        site.is_delete ? "permanently " : ""
      }delete site - ${site.site_name}?`,
    );

    if (!confirm) return;

    try {
      dispatch({ type: "DELETE_REQUEST" });

      await axios.delete(`${API_BASE_URL}/sites/${site._id}`, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      toast.success(
        `Site ${site.is_delete ? "permanently " : ""}deleted successfully`,
      );
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

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
  return (
    <div className="mt-4">
      <CRow>
        <CCol>
          <div className="border-0 p-3 my-2">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h4>
                Assigned Sites for - <b>{id}</b>
              </h4>
              {canManage && (
                <CButton
                  color="primary"
                  size="sm"
                  onClick={() =>
                    dispatch({ type: "SET_ADD_MODAL", payload: true })
                  }
                >
                  Add New Site
                </CButton>
              )}
            </div>

            <CTable striped hover responsive className="mb-3 bg-important">
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Site ID</CTableHeaderCell>
                  <CTableHeaderCell>
                    Weather Acess For Cleaning
                  </CTableHeaderCell>
                  <CTableHeaderCell>Site Name</CTableHeaderCell>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Warranty</CTableHeaderCell>
                  <CTableHeaderCell>AMC</CTableHeaderCell>
                  <CTableHeaderCell>Site type</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {state.loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center">
                      <LoadingSpinner />
                    </CTableDataCell>
                  </CTableRow>
                ) : state.error ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center">
                      {state.error}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  state.sites.map((site, index) => (
                    <CTableRow
                      key={site.site_id}
                      className={site.is_delete ? "table-danger" : ""} // Apply the conditional class here
                    >
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>{site.site_id}</CTableDataCell>
                      <CTableDataCell>
                        {site.is_weather_cleaning_enabled ? (
                          <CBadge color="success">Enabled</CBadge>
                        ) : (
                          <CBadge color="danger">Disabled</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{site.siteName}</CTableDataCell>
                      <CTableDataCell>{site.location}</CTableDataCell>
                      <CTableDataCell>{site.site_type}</CTableDataCell>
                      <CTableDataCell>
                        {STATUS_LABEL[site.warranty_status] || "—"}
                        <div className="small text-body-secondary">{dayText(site.warranty_date)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {STATUS_LABEL[site.amc_status] || "—"}
                        <div className="small text-body-secondary">{dayText(site.amc_date)}</div>
                      </CTableDataCell>
                      <CTableDataCell>{STATUS_LABEL[site.mounting_type] || "—"}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="info" className="m-1" size="sm" onClick={() => setDetail(site)}>
                          Details
                        </CButton>
                        {canEdit && (
                          <CButton
                            color="warning"
                            className="m-1"
                            size="sm"
                            onClick={() =>
                              navigate(`/${adminroute}/clients-data-dashboard/edit-client/${site?._id}`)
                            }
                          >
                            Edit
                          </CButton>
                        )}
                        {canManage && (
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(site)}
                            disabled={site.is_delete}
                            {...(site.is_delete && { title: "This site is already deleted" })}
                          >
                            Delete
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
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
          </div>
        </CCol>
      </CRow>

      <CModal visible={Boolean(detail)} onClose={() => setDetail(null)} size="lg" scrollable>
        <CModalHeader>
          <CModalTitle>{detail?.site_id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {detail && (
            <>
              <CRow className="g-2 mb-3">
                {[
                  ["Site name", detail.siteName],
                  ["Location", detail.location],
                  ["Contract type", detail.site_type],
                  ["Client", detail.client_id],
                  ["Project code", detail.project_code],
                  ["Commissioning", dayText(detail.commissioning_date)],
                  ["Warranty", `${STATUS_LABEL[detail.warranty_status] || "Not set"} · ends ${dayText(detail.warranty_date)}`],
                  ["AMC", `${STATUS_LABEL[detail.amc_status] || "Not set"} · ends ${dayText(detail.amc_date)}`],
                  ["Cloth", detail.cloth_type || "—"],
                  ["Site type", STATUS_LABEL[detail.mounting_type] || "—"],
                ].map(([label, value]) => (
                  <CCol sm={6} key={label}>
                    <div className="small text-body-secondary">{label}</div>
                    <div>{value || "—"}</div>
                  </CCol>
                ))}
              </CRow>
              <LastActivity lastactivity={(detail.last_activity || []).map(toActivity)} />
            </>
          )}
        </CModalBody>
        <CModalFooter>
          {canEdit && detail && (
            <CButton color="warning" size="sm" onClick={() => navigate(`/${adminroute}/clients-data-dashboard/edit-client/${detail._id}`)}>
              Edit
            </CButton>
          )}
          <CButton color="secondary" size="sm" onClick={() => setDetail(null)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add Site Modal */}
      <CModal
        visible={state.addModalVisible}
        onClose={() => dispatch({ type: "SET_ADD_MODAL", payload: false })}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Add New Site : {id}</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => dispatch({ type: "SET_ADD_MODAL", payload: false })}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              label="site id"
              name="site_id"
              placeholder="Site Id"
              value={state.formData.site_id}
              onChange={handleChange}
            />
            <CFormInput
              type="text"
              label="site Name"
              name="siteName"
              placeholder="Site Name"
              value={state.formData.siteName}
              onChange={handleChange}
            />
            <CFormInput
              type="text"
              label="Location"
              name="location"
              placeholder="Location"
              value={state.formData.location}
              onChange={handleChange}
              className=""
            />
            <CFormInput
              type="text"
              label="site_type"
              name="site_type"
              placeholder="site_type"
              value={state.formData.site_type}
              onChange={handleChange}
              className=""
            />
            <CFormInput
              type="text"
              label="project_code"
              name="project_code"
              placeholder="project code"
              value={state.formData.project_code}
              onChange={handleChange}
              className=""
            />
            <CFormInput
              type="text"
              label="client_id"
              name="client_id"
              placeholder="client_id"
              value={id}
              onChange={handleChange}
              className=""
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => dispatch({ type: "SET_ADD_MODAL", payload: false })}
          >
            Cancel
          </CButton>
          <CButton
            size="sm"
            color="primary"
            onClick={handleAddSite}
            disabled={state.adding}
          >
            {state.adding ? (
              <>
                Adding...
                <LoadingSpinner />
              </>
            ) : (
              "Add"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={state.deleteModalVisible}
        onClose={() => dispatch({ type: "SET_DELETE_MODAL", payload: false })}
      >
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <p>Are you sure you want to delete this site?</p>
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              dispatch({ type: "SET_DELETE_MODAL", payload: false })
            }
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            size="sm"
            onClick={() => {
              handleDelete(); // call delete
              dispatch({ type: "SET_DELETE_MODAL", payload: false }); // close modal
            }}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};
export default ClientAssignedSites;
