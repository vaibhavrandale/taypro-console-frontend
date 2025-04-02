import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
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
  CInputGroup,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CSpinner,
  CBadge,
  CFormLabel,
  CInputGroupText,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
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

    default:
      return state;
  }
};

const ClientAssignedSites = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
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
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchClientSites = async () => {
      try {
        dispatch({ type: "FETCH_START" });
        const response = await axios.post(
          `${API_BASE_URL}/sites/get-sites/${id}`,
          { pg: page, limit: limit },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit)
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

        // dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (error) {
        // console.log(error.response.data.message);

        dispatch({
          type: "FETCH_ERROR",
          payload: error.response?.data?.error || error.response.data.message,
        });
        toast.error(error.response?.data?.error || error.response.data.message);
      }
    };
    fetchClientSites();
  }, [authtoken, id, limit, page]);

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
      console.log(id);

      dispatch({ type: "ADD_SITE_START" });
      const response = await axios.post(`${API_BASE_URL}/sites`, filderedData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      // dispatch({ type: "ADD_SITE", payload: response.data.data });
      dispatch({ type: "ADD_SITE_SUCCESS", payload: response.data.data });

      console.log(response.data.data);
      // fetchClientSites();
      dispatch({ type: "SET_ADD_MODAL", payload: false });
      toast.success("Site added successfully!");
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);

      dispatch({ type: "ADD_SITE_ERROR", payload: error.response.data.error });
    }
  };

  // Handle updating site
  const handleUpdate = async (site) => {
    dispatch({ type: "SET_SELECTED_SITE", payload: site });
    try {
      dispatch({ type: "UPDATE_SITE_START" });
      const response = await axios.put(
        `${API_BASE_URL}/sites/${state.selectedSite._id}`,
        state.formData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      console.log(response);

      dispatch({ type: "UPDATE_SITE_SUCCESS", payload: response.data.data });
      dispatch({ type: "SET_MODAL", payload: false });
      toast.success("Site updated successfully!");
    } catch (error) {
      dispatch({ type: "UPDATE_SITE_ERROR", error: error.response.data.error });
      toast.error(error.response.data.error);
    }
  };

  // Handle delete site
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/sites/${state.formData.site_type}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "DELETE_SITE", payload: state.formData.site_id });
      dispatch({ type: "SET_DELETE_MODAL", payload: false });
      toast.success("Site deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete site.");
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.log(uniqueSitenames);
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
              <CButton
                color="primary"
                size="sm"
                onClick={() =>
                  dispatch({ type: "SET_ADD_MODAL", payload: true })
                }
              >
                Add New Site
              </CButton>
            </div>

            <>
              <CTable striped hover responsive className="mt-3">
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Site ID</CTableHeaderCell>
                    <CTableHeaderCell>Site Name</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {state.loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        <LoadingSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : state.error ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        {state.error}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    state.sites.map((site, index) => (
                      <CTableRow key={site.site_id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{site.site_id}</CTableDataCell>
                        <CTableDataCell>{site.siteName}</CTableDataCell>
                        <CTableDataCell>{site.location}</CTableDataCell>
                        <CTableDataCell>{site.site_type}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="warning"
                            className="m-1"
                            size="sm"
                            onClick={() =>
                              dispatch({
                                type: "SET_SELECTED_SITE",
                                payload: site,
                              })
                            }
                          >
                            Edit
                          </CButton>{" "}
                          <CButton
                            color="danger"
                            size="sm"
                            className="m-1"
                            onClick={() => {
                              dispatch({
                                type: "SET_DELETE_MODAL",
                                payload: true,
                              });
                              dispatch({
                                type: "UPDATE_FORM",
                                field: "_id",
                                value: site._id,
                              });
                            }}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
              {/* <PaginateInput
                page={page}
                totalPages={state.totalPages}
                hasPrevPage={state.hasPrevPage}
                hasNextPage={state.hasNextPage}
                pageInput={pageInput}
                handlePageChange={handlePageChange}
                handlePageInputChange={handlePageInputChange}
                handlePageInputSubmit={handlePageInputSubmit}
              /> */}
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
                handleLimitChange={setLimit} // New prop
              />
            </>
          </div>
        </CCol>
      </CRow>

      {/* Add Site Modal */}
      <CModal
        visible={state.addModalVisible}
        onClose={() => dispatch({ type: "SET_ADD_MODAL", payload: false })}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Add New Site : {id}</CModalTitle>
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
              className="mt-3"
            />

            <CFormInput
              type="text"
              label="site_type"
              name="site_type"
              placeholder="site_type"
              value={state.formData.site_type}
              onChange={handleChange}
              className="mt-3"
            />
            <CFormInput
              type="text"
              label="client_id"
              name="client_id"
              placeholder="client_id"
              value={id}
              onChange={handleChange}
              className="mt-3"
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

      {/* Edit Site Modal */}
      <CModal
        visible={state.modalVisible}
        onClose={() => dispatch({ type: "SET_MODAL", payload: false })}
      >
        <CModalHeader>
          <CModalTitle>Edit Site</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* <CForm>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Site Name"
                name="siteName"
                value={state.formData.siteName}
                onChange={handleChange}
              />
              <CFormInput
                placeholder="Site Id"
                name="site_id"
                type="hidden"
                value={state.formData.site_id}
                onChange={handleChange}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Site Type"
                name="site_type"
                value={state.formData.site_type}
                onChange={handleChange}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Location"
                name="location"
                value={state.formData.location}
                onChange={handleChange}
              />
            </CInputGroup>
          </CForm> */}
          <CForm>
            <CInputGroup className="mb-3">
              <CInputGroupText>Site Name</CInputGroupText>
              <CFormInput
                placeholder="Site Name"
                name="siteName"
                value={state.formData.siteName}
                onChange={handleChange}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText>Site Type</CInputGroupText>
              <CFormInput
                placeholder="Site Type"
                name="site_type"
                value={state.formData.site_type}
                onChange={handleChange}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText>Location</CInputGroupText>
              <CFormInput
                placeholder="Location"
                name="location"
                value={state.formData.location}
                onChange={handleChange}
              />
            </CInputGroup>

            {/* Hidden input for site_id */}
            <CFormInput
              name="site_id"
              type="hidden"
              value={state.formData.site_id}
              onChange={handleChange}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => dispatch({ type: "SET_MODAL", payload: false })}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={() => handleUpdate(state.formData)}
            disabled={state.updating}
          >
            {state.updating ? (
              <>
                Updating...
                <LoadingSpinner />
              </>
            ) : (
              "Update Site"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={state.deleteModal}
        onClose={() => dispatch({ type: "SET_DELETE_MODAL", payload: false })}
      >
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this site ?</p>
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
            onClick={() => handleDelete(state.formData._id)}
            disabled={state.deleting}
          >
            {state.deleting ? (
              <>
                Deleting...
                <LoadingSpinner />
              </>
            ) : (
              "Delete"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};
export default ClientAssignedSites;
