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

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

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

const InActiveRobots = () => {
  const [
    {
      robots,
      totalPages,
      hasNextPage,
      hasPrevPage,
      updateloading,
      loadingRobots,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],

    loadingaddRobots: false,
    updateloading: false,
    loadingRobots: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [formData, setFormData] = useState({
    robot_no: "",
    deveui: "",
    lora_no: "",
    old_lora_no: "",
    new_lora_no: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.post(`/api/v1/robots/inactive`, pagination, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",

          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    fetchRobots();
  }, [authtoken, limit, page]);

  // Filter active robots

  // Filter robots based on search term
  const filteredRobots = robots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.lora_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal with selected robot data
  const openModal = (robot) => {
    setSelectedRobot(robot);
    setFormData({
      robot_no: robot.robot_no || "",
      deveui: robot.deveui || "",
      lora_no: robot.lora_no || "",
      old_lora_no: robot.old_lora_no || "",
      new_lora_no: "",
    });
    setModalVisible(true);
  };

  // Handle input change
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

      await axios.put(
        `/api/v1/robots/activate-and-add-in-lns`,
        filteredFormData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${filteredFormData.robot_no}  updated successfully!`);
      navigate("/master-admin/replace-lora/active-robots"); // Redirect after update
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

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>All InActive Robots</h2>
        <Link
          className="btn btn-sm btn-danger text-white"
          to="/master-admin/replace-lora/active-robots"
        >
          Active Robots
        </Link>
      </div>
      <CRow className="justify-content-end">
        <CCol md={4} lg={4}>
          {/* Search Input */}
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Deveui, or Lora No"
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
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Deveui</CTableHeaderCell>
            <CTableHeaderCell>Current Lora No</CTableHeaderCell>
            <CTableHeaderCell>Old Lora No</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingRobots ? (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-start">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredRobots.length > 0 ? (
            filteredRobots.map((robot, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.deveui}</CTableDataCell>
                <CTableDataCell>{robot.lora_no}</CTableDataCell>
                <CTableDataCell>{robot.old_lora_no}</CTableDataCell>
                <CTableDataCell>
                  {robot.activate ? (
                    <CBadge color="success">Active</CBadge>
                  ) : (
                    <CBadge color="danger">In Active</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="secondary"
                    className="text-white"
                    size="sm"
                    onClick={() => openModal(robot)}
                  >
                    activate
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center py-4">
                No Inactive Robots Found
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
        handleLimitChange={setLimit} // New prop
      />
      {/* Update Modal */}
      <CModal
        backdrop="static"
        size="xl"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Activate Robot -
            <span className="badge bg-success">{formData.robot_no}</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRobot && (
            <div>
              <CFormInput
                type="text"
                name="robot_no"
                value={formData.robot_no}
                label="Robot No"
                onChange={handleChange}
                className="mb-3"
                readOnly
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

export default InActiveRobots;
