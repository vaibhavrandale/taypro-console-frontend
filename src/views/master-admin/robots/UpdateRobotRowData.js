import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import LastActivity from "../../../components/LastActivity";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, fetchrobotsLoading: true, robotsError: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        fetchrobotsLoading: false,
        robots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ROBOTS_FAIL":
      return {
        ...state,
        fetchrobotsLoading: false,
        robotsError: action.payload,
      };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, updateRobotLoding: true, updateRobotError: "" };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        updateRobotLoding: false,
      };
    case "UPDATE_FAIL":
      return {
        ...state,
        updateRobotLoding: false,
        updateRobotError: action.payload,
      };

    default:
      return state;
  }
};
const UpdateRobotRowData = () => {
  const [
    {
      robots,
      fetchrobotsLoading,
      robotsError,
      sites,
      loadingSites,
      sitesError,
      totalPages,
      hasNextPage,
      hasPrevPage,
      updateRobotLoding,
      updateRobotError,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    fetchrobotsLoading: false,
    robotsError: "",
    loadingSites: false,
    sites: [],
    sitesError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    updateRobotLoding: false,
    updateRobotError: "",
  });
  const [site_id, setSiteId] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [visible, setVisible] = useState(false);
  const [lastActivityVisible, setLastActivityVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [formData, setFormData] = useState({ row_number: "", row_length: "" });
  const fetchRobots = async () => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    dispatch({ type: "FETCH_ROBOTS_REQUEST" });
    try {
      const result = await axios.post(
        `/api/v1/robots/site/${site_id}`,
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
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };
  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response.data.error,
        });
        toast.error("Failed to fetch sites");
      }
    };

    fetchRobots();
    fetchSites();
  }, [limit, page, site_id]);

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

  const handleUpdateClick = (robot) => {
    setSelectedRobot(robot);
    setFormData({
      row_number: robot.row_number || 0,
      row_length: robot.row_length || 0,
    });
    setVisible(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const response = await axios.put(
        `/api/v1/robots/update-row-data/${selectedRobot._id}`,
        {
          row_number: formData.row_number,
          row_length: formData.row_length,
        },
        {
          // headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(response.data.message);

      // Refresh table data after update
      setVisible(false);
      // ✅ Refresh table data
      await fetchRobots();
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const handleViewlastActivity = (robot) => {
    setSelectedRobot(robot);
    setLastActivityVisible(true);
  };

  return (
    <div>
      {" "}
      <CRow>
        <CCol md={4}>
          {loadingSites ? (
            <LoadingSpinner />
          ) : sitesError ? (
            <CAlert color="danger">{sitesError}</CAlert>
          ) : (
            <CFormSelect
              id="siteSelect"
              label="Select Site"
              value={site_id}
              onChange={(e) => {
                setSiteId(e.target.value);
              }}
            >
              <option value="">Select a site</option>
              {sites?.map((site, index) => (
                <option key={index} value={site.site_id}>
                  {site.site_id}
                </option>
              ))}
            </CFormSelect>
          )}
        </CCol>
      </CRow>
      <CTable bordered hover responsive className="text-center shadow-sm mt-3">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>Row Number</CTableHeaderCell>
            <CTableHeaderCell>Row length</CTableHeaderCell>
            {userInfo?.role === "Master Admin" && (
              <CTableHeaderCell>Last Activity</CTableHeaderCell>
            )}
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {fetchrobotsLoading ? (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : robotsError ? (
            <CTableRow>
              <CTableDataCell
                colSpan="7"
                className="text-center text-danger fw-bold"
              >
                {robotsError}
              </CTableDataCell>
            </CTableRow>
          ) : robots.length > 0 ? (
            robots.map((robot, index) => (
              <CTableRow key={robot.deveui}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>{robot.row_number}</CTableDataCell>
                <CTableDataCell>{robot.row_length}</CTableDataCell>
                {userInfo?.role === "Master Admin" && (
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={() => handleViewlastActivity(robot)}
                    >
                      View Last Activity
                    </CButton>
                  </CTableDataCell>
                )}
                <CTableDataCell>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => handleUpdateClick(robot)}
                  >
                    Update
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center">
                No robots found.
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
      {/* --- Update Modal --- */}
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Update Robot Row Info</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleUpdateSubmit}>
            <CFormInput
              label="Row Number"
              type="number"
              value={formData.row_number}
              onChange={(e) =>
                setFormData({ ...formData, row_number: e.target.value })
              }
              required
            />
            <CFormInput
              label="Row Length (in meters)"
              type="number"
              className="mt-3"
              value={formData.row_length}
              onChange={(e) =>
                setFormData({ ...formData, row_length: e.target.value })
              }
              required
            />
            <CModalFooter className="mt-2">
              <CButton color="warning" type="submit" size="sm">
                {updateRobotLoding ? (
                  <>
                    Updating..
                    <LoadingSpinner />
                  </>
                ) : (
                  "Update"
                )}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
      {/* --- Last Activity Modal --- */}
      {selectedRobot && (
        <CModal
          visible={lastActivityVisible}
          onClose={() => setLastActivityVisible(false)}
          backdrop="static"
          size="xl"
        >
          <CModalHeader closeButton={false}>
            <CModalTitle>{selectedRobot.robot_no}</CModalTitle>
            <button
              type="button"
              className=" border-0 ms-auto py-0 px-1"
              onClick={() => setLastActivityVisible(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>
          <CModalBody>
            <LastActivity lastactivity={selectedRobot.last_activity} />
          </CModalBody>
        </CModal>
      )}
    </div>
  );
};

export default UpdateRobotRowData;
