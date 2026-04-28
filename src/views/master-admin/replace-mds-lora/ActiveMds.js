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
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

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

const ActiveMds = () => {
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
    _id: "",
    mds_no: "",
    deveui: "",
    current_lora_no: "",
    new_lora_no: "",
  });

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    const pagination = { pg: page, limit };
    const fetchMdsDevices = async () => {
      dispatch({ type: "FETCH_MDS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/mds-device/active`,
          pagination,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        const total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
        );
        dispatch({
          type: "FETCH_MDS_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: result.data.hasNextPage,
            hasPrevPage: result.data.hasPrevPage,
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

  // Filter MDS devices based on search term
  const filteredMds = mdsDevices.filter(
    (mds) =>
      mds.mds_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mds.deveui?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mds.lora_no?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Open modal
  const openModal = (mds) => {
    setSelectedMds(mds);
    setFormData({
      _id: mds._id,
      current_lora_no: mds.lora_no,
      mds_no: mds.mds_no,
      deveui: mds.deveui,
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
        last_activity,
        last_uplink,
        manufactured_date,
        ...filteredFormData
      } = formData;

      await axios.put(
        `/api/v1/mds-device/delete-from-lns-and-deactivate`,
        filteredFormData,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${filteredFormData.mds_no} deactivated successfully!`);
      navigate("/master-admin/replace-lora/in-active-mdss"); // Redirect after update
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.error);
    }
    setModalVisible(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages)
      handlePageChange(pageNumber);
  };

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
        <h2>Active MDS Devices</h2>
        <Link
          className="btn btn-sm btn-danger text-white"
          to={`/${adminroute}/replace-mds-lora/in-active-mdss`}
        >
          Inactive MDS Devices
        </Link>
      </div>

      <CRow className="justify-content-end">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by MDS No, Deveui, or Lora No"
            className="mb-3"
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
            ) && <CTableHeaderCell>Action</CTableHeaderCell>}{" "}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingMds ? (
            <CTableRow>
              <CTableDataCell colSpan={7}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredMds.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={7}>
                No active MDS Devices Found
              </CTableDataCell>
            </CTableRow>
          ) : (
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
                <CTableDataCell>
                  <CButton
                    color="primary"
                    className="text-white"
                    size="sm"
                    onClick={() => openModal(mds)}
                  >
                    Deactivate
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
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
        handlePageInputChange={(e) => setPageInput(e.target.value)}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit}
      />

      {selectedMds && (
        <CModal
          backdrop="static"
          size="lg"
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader closeButton={false}>
            <CModalTitle>
              Deactivate MDS -{" "}
              <span className="badge bg-success">{selectedMds.mds_no}</span>
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

          <form onSubmit={handleUpdate}>
            <CModalBody>
              <CFormInput
                type="text"
                name="_id"
                value={selectedMds._id}
                label="MDS ID"
                readOnly
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="mds_no"
                value={selectedMds.mds_no}
                label="MDS No"
                readOnly
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="deveui"
                value={selectedMds.deveui}
                label="Deveui"
                readOnly
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="current_lora_no"
                value={selectedMds.lora_no}
                label="Current Lora No"
                readOnly
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="new_lora_no"
                value={formData.new_lora_no}
                label="New Lora No"
                onChange={handleChange}
                className="mb-3"
              />
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                size="sm"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </CButton>
              <CButton color="primary" size="sm" type="submit">
                {updateloading ? (
                  <>
                    Deactivating...
                    <LoadingSpinner />
                  </>
                ) : (
                  "Deactivate"
                )}
              </CButton>
            </CModalFooter>
          </form>
        </CModal>
      )}
    </div>
  );
};

export default ActiveMds;
