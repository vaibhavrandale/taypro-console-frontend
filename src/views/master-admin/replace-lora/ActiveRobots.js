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

const ActiveRobots = () => {
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
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);

  const [formData, setFormData] = useState({
    _id: "",
    robot_no: "",
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

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.post(`/api/v1/robots/active`, pagination, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
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
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchRobots();
  }, [limit, page]);

  // Filter robots based on search term
  const filteredRobots = robots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.lora_no
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Open modal with selected robot data
  const openModal = (robot) => {
    setSelectedRobot(robot);
    setFormData({
      _id: robot._id,
      current_lora_no: robot.lora_no,
      robot_no: robot.robot_no,
      deveui: robot.deveui,
    });
    setModalVisible(true);
  };
  //lora_no, old_lora_no

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update (currently logs updated data)
  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    console.log("formData updated:", formData);
    try {
      const {
        createdAt,
        last_activity,
        last_uplink,
        manufactured_date,
        ...filteredFormData
      } = formData;

      await axios.put(
        `/api/v1/robots/deactivate-and-delete-from-lns`,
        filteredFormData,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${filteredFormData.robot_no}  updated successfully!`);
      navigate("/master-admin/replace-lora/in-active-robots"); // Redirect after update
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.message || error.message,
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
        <h2>Active Robots</h2>
        <Link
          className="btn btn-sm btn-danger text-white"
          to={`/${adminroute}/replace-lora/in-active-robots`}
        >
          In Active Robots
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
            {!["Master User", "Project User", "Service User"].includes(
              userInfo?.role,
            ) && <CTableHeaderCell>Action</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingRobots ? (
            <CTableRow>
              <CTableDataCell
                colSpan={
                  ["Master User", "Project User", "Service User"].includes(
                    userInfo?.role,
                  )
                    ? 6
                    : 7
                }
              >
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredRobots.length === 0 ? (
            <CTableRow>
              <CTableDataCell
                colSpan={
                  ["Master User", "Project User", "Service User"].includes(
                    userInfo?.role,
                  )
                    ? 6
                    : 7
                }
              >
                No active Robots Found
              </CTableDataCell>
            </CTableRow>
          ) : (
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
                {!["Master User", "Project User", "Service User"].includes(
                  userInfo?.role,
                ) && (
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      className="text-white"
                      size="sm"
                      onClick={() => openModal(robot)}
                    >
                      Deactivate
                    </CButton>
                  </CTableDataCell>
                )}
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
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit} // New prop
      />
      {/* Update Modal */}
      {selectedRobot && (
        <CModal
          backdrop="static"
          size="lg"
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader closeButton={false}>
            <CModalTitle>
              Deactivate Robot -{" "}
              <span className="badge bg-success">{selectedRobot.robot_no}</span>
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
              <div>
                <CFormInput
                  type="text"
                  name="_id"
                  value={selectedRobot._id}
                  label="Robot id"
                  onChange={handleChange}
                  className="mb-3"
                  readOnly
                />
                <CFormInput
                  type="text"
                  name="robot_no"
                  value={selectedRobot.robot_no}
                  label="Robot No"
                  onChange={handleChange}
                  className="mb-3"
                  readOnly
                />
                <CFormInput
                  type="text"
                  name="deveui"
                  value={selectedRobot.deveui}
                  label="Deveui"
                  readOnly
                  onChange={handleChange}
                  className="mb-3"
                />
                <CFormInput
                  type="text"
                  name="current_lora_no"
                  readOnly
                  value={selectedRobot.lora_no}
                  label="Current Lora No"
                  onChange={handleChange}
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
              </div>
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

export default ActiveRobots;
