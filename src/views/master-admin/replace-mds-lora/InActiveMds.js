import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MDS_REQUEST":
      return { ...state, loadingMds: true, error: "" };
    case "FETCH_MDS_SUCCESS":
      return {
        ...state,
        loadingMds: false,
        mdsDevices: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_MDS_FAIL":
      return { ...state, loadingMds: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, updateloading: true };
    case "UPDATE_SUCCESS":
      return { ...state, updateloading: false, success: true };
    case "UPDATE_FAIL":
      return { ...state, updateloading: false, error: action.payload };
    default:
      return state;
  }
};

const InActiveMds = () => {
  const [
    {
      mdsDevices,
      totalPages,
      hasNextPage,
      hasPrevPage,
      updateloading,
      loadingMds,
    },
    dispatch,
  ] = useReducer(reducer, {
    mdsDevices: [],
    loadingMds: false,
    updateloading: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMds, setSelectedMds] = useState(null);
  const [formData, setFormData] = useState({
    mds_no: "",
    deveui: "",
    lora_no: "",
    old_lora_no: "",
    new_lora_no: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  useEffect(() => {
    let pagination = { pg: page, limit: limit };
    const fetchMdsDevices = async () => {
      dispatch({ type: "FETCH_MDS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/mds-device/inactive`,
          pagination,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_MDS_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_MDS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchMdsDevices();
  }, [limit, page]);

  const filteredMds = mdsDevices.filter(
    (mds) =>
      mds.mds_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mds.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mds.lora_no.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openModal = (mds) => {
    setSelectedMds(mds);
    setFormData({
      mds_no: mds.mds_no || "",
      deveui: mds.deveui || "",
      lora_no: mds.lora_no || "",
      old_lora_no: mds.old_lora_no || "",
      new_lora_no: "",
    });
    setModalVisible(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      const {
        createdAt,
        _id,
        last_activity,
        last_uplink,
        manufactured_date,
        ...filteredFormData
      } = formData;

      await axios.put(`/api/v1/mds-device/activate`, filteredFormData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${filteredFormData.mds_no} activated successfully!`);
      navigate(`/${adminroute}/replace-mds-lora/active-mdss`); // Redirect after update
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.error || error.message,
      });
      toast.error(error.response?.data?.error);
    }
    setModalVisible(false);
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

  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
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
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>All Inactive MDS Devices</h2>
        {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role,
        ) && (
          <Link
            className="btn btn-sm btn-danger text-white"
            to={`/${adminroute}/replace-mds-lora/active-mdss`}
          >
            Active MDS Devices
          </Link>
        )}
      </div>

      <CRow className="justify-content-end">
        <CCol md={4} lg={4}>
          <CFormInput
            type="text"
            placeholder="Search by MDS No, Deveui, or Lora No"
            className="mb-3 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>MDS No</CTableHeaderCell>
            <CTableHeaderCell>Deveui</CTableHeaderCell>
            <CTableHeaderCell>Current Lora No</CTableHeaderCell>
            <CTableHeaderCell>Old Lora No</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            {!["Master User", "Project User", "Service User"].includes(
              userInfo?.role,
            ) && <CTableHeaderCell>Action</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {loadingMds ? (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-start">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredMds.length > 0 ? (
            filteredMds.map((mds, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{mds.mds_no}</CTableDataCell>
                <CTableDataCell>{mds.deveui}</CTableDataCell>
                <CTableDataCell>{mds.lora_no}</CTableDataCell>
                <CTableDataCell>{mds.old_lora_no}</CTableDataCell>
                <CTableDataCell>
                  {mds.activate ? (
                    <CBadge color="success">Active</CBadge>
                  ) : (
                    <CBadge color="danger">Inactive</CBadge>
                  )}
                </CTableDataCell>
                {!["Master User", "Project User", "Service User"].includes(
                  userInfo?.role,
                ) && (
                  <CTableDataCell>
                    <CButton
                      color="secondary"
                      className="text-white"
                      size="sm"
                      onClick={() => openModal(mds)}
                    >
                      Activate
                    </CButton>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center py-4">
                No Inactive MDS Devices Found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
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
        handleLimitChange={setLimit}
      />

      <CModal
        backdrop="static"
        size="xl"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Activate MDS -{" "}
            <span className="badge bg-success">{formData.mds_no}</span>
          </CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {selectedMds && (
            <div>
              <CFormInput
                type="text"
                name="mds_no"
                value={formData.mds_no}
                label="MDS No"
                readOnly
                onChange={handleChange}
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="deveui"
                value={formData.deveui}
                label="Deveui"
                readOnly
                onChange={handleChange}
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="lora_no"
                readOnly
                value={formData.lora_no}
                label="Current Lora No"
                onChange={handleChange}
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="old_lora_no"
                readOnly
                value={formData.old_lora_no}
                label="Old Lora No"
                onChange={handleChange}
                className="mb-3"
              />
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            disabled={updateloading}
            size="sm"
            onClick={handleUpdate}
          >
            {updateloading ? "Loading..." : "Activate"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default InActiveMds;
