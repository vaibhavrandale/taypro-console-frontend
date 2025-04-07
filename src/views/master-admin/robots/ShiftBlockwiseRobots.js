import React, { useEffect, useReducer, useState } from "react";
import {
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CCol,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, fetchingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        fetchingRobots: false,
        // shiftrobots: action.payload,
        shiftrobots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, fetchingRobots: false, error: action.payload };

    case "SHIFT_ROBOTS_REQUEST":
      return { ...state, loadingShiftRobots: true, error: "" };
    case "SHIFT_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingShiftRobots: false,
        shiftrobots: state.shiftrobots.filter(
          (robot) =>
            !action.payload.some(
              (activated) => activated.deveui === robot.deveui
            )
        ),
        shiftRobots: [...state.shiftRobots, ...action.payload],
      };
    case "SHIFT_ROBOTS_FAIL":
      return { ...state, loadingShiftRobots: false, error: action.payload };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };

    default:
      return state;
  }
};
const ShiftBlockwiseRobots = () => {
  const [
    {
      loadingShiftRobots,
      fetchingRobots,
      error,
      shiftrobots,

      totalPages,
      hasNextPage,
      hasPrevPage,
      loadingSites,
      sites,
    },
    dispatch,
  ] = useReducer(reducer, {
    shiftrobots: [],

    loadingSites: false,
    sites: [],
    loadingShiftRobots: false,
    fetchingRobots: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [selectedRobots, setSelectedRobots] = useState([]);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [site_id, setSiteId] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [targetBlock, setTargetBlock] = useState("");

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/robots/site/${site_id}`,
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
          type: "FETCH_ROBOTS_SUCCESS",
          //  payload: result.data.data
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
          payload: "Failed to fetch robots",
        });
        toast.error("Failed to fetch robots");
      }
    };
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
        // console.log(result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response.data.error,
        });
        toast.error("Failed to fetch sites");
      }
    };
    fetchSites();
    fetchRobots();
  }, [authtoken, limit, page, site_id]);

  // ✅ Handle Checkbox Selection
  const handleCheckboxChange = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.deveui === robot.deveui)
        ? prev.filter((r) => r.deveui !== robot.deveui)
        : [...prev, robot]
    );
  };

  // ✅ Activate Selected Robots
  //   const activateSelectedRobots = async () => {
  //     if (selectedRobots.length === 0) {
  //       toast.error("Please select at least one robot to activate.");
  //       return;
  //     }

  //     dispatch({ type: "ACTIVATE_ROBOTS_REQUEST" });

  //     try {
  //       const response = await axios.put(
  //         "/api/v1/robots/activate",
  //         { deveuiArray: selectedRobots.map((robot) => robot.deveui) },
  //         { headers: { Authorization: `Bearer ${authtoken}` } }
  //       );
  //       console.log(response);

  //       dispatch({ type: "ACTIVATE_ROBOTS_SUCCESS", payload: selectedRobots });
  //       toast.success("Selected robots Shifted in other block successfully.");
  //       setSelectedRobots([]); // Clear selection after activation
  //     } catch (error) {
  //       dispatch({
  //         type: "ACTIVATE_ROBOTS_FAIL",
  //         payload: error.response?.data?.message || error.response?.data?.error,
  //       });
  //       toast.error(error.response?.data?.message || error.response?.data?.error);
  //     }
  //   };

  const activateSelectedRobots = async () => {
    if (!targetBlock) {
      toast.error("Please enter a block to shift to.");
      return;
    }

    if (selectedRobots.length === 0) {
      toast.error("Please select at least one robot to shift.");
      return;
    }

    dispatch({ type: "SHIFT_ROBOTS_REQUEST" });

    try {
      const response = await axios.put(
        "/api/v1/robots/shift-robot-blockwise",
        {
          deveuiArray: selectedRobots.map((robot) => robot.deveui),
          block: targetBlock,
        },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({ type: "SHIFT_ROBOTS_SUCCESS", payload: selectedRobots });
      toast.success("Selected robots shifted to new block successfully.");
      setSelectedRobots([]);
      setShowModal(false); // Close modal
      setTargetBlock(""); // Clear input
    } catch (error) {
      dispatch({
        type: "SHIFT_ROBOTS_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.log(uniqueSitenames);
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

  //   const handleSiteNameChange = (e) => {
  //     const selectedSiteId = e.target.value;
  //     setSiteId(selectedSiteId); // Updates local state
  //   };
  return (
    <div className="p-2">
      <h4>Update Blocks of Robots</h4>

      <CCardBody>
        <div className="d-flex justify-content-end align-items-center">
          {userInfo.role === "Master Admin" && (
            <Link
              className="btn btn-sm btn-secondary m-1"
              to="/master-admin/robots"
            >
              All Robots
            </Link>
          )}

          <CButton
            color="success"
            size="sm"
            onClick={() => setShowModal(true)}
            disabled={loadingShiftRobots}
          >
            Shift Selected
          </CButton>
          {showModal && (
            <CModal
              backdrop="static"
              visible={showModal}
              onClose={() => setShowModal(false)}
            >
              <CModalHeader onClose={() => setShowModal(false)}>
                <CModalTitle>Shift Robots to Block</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormInput
                  type="text"
                  placeholder="Enter new block name"
                  value={targetBlock}
                  onChange={(e) => setTargetBlock(e.target.value)}
                />
              </CModalBody>
              <CModalFooter>
                <CButton
                  size="sm"
                  color="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </CButton>
                <CButton
                  size="sm"
                  color="success"
                  onClick={activateSelectedRobots}
                >
                  {loadingShiftRobots ? (
                    <>
                      Shifting..
                      <LoadingSpinner />
                    </>
                  ) : (
                    "Shift Now"
                  )}
                </CButton>
              </CModalFooter>
            </CModal>
          )}
        </div>

        {/* ✅ Display Activated Robots */}
        {selectedRobots.length > 0 && (
          <div className="mt-3">
            <h5>Shifted Robots 🔽</h5>
            {selectedRobots.map((robot, index) => (
              <p key={index}>
                {index + 1}] Robot No:{" "}
                <span className="text-primary">
                  {robot.robot_no} - [{robot.block}]
                </span>
              </p>
            ))}
          </div>
        )}
        <CCol md={4}>
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
        </CCol>

        <CTable
          bordered
          hover
          responsive
          className="text-center shadow-sm mt-3"
        >
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>Select</CTableHeaderCell>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Robot No</CTableHeaderCell>
              <CTableHeaderCell>Lora Serial No</CTableHeaderCell>
              <CTableHeaderCell>Deveui</CTableHeaderCell>
              <CTableHeaderCell>Site ID</CTableHeaderCell>
              <CTableHeaderCell>Block</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {fetchingRobots ? (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center fw-bold">
                  <LoadingSpinner />
                </CTableDataCell>
              </CTableRow>
            ) : error ? (
              <CTableRow>
                <CTableDataCell
                  colSpan="7"
                  className="text-center text-danger fw-bold"
                >
                  {error}
                </CTableDataCell>
              </CTableRow>
            ) : shiftrobots.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center">
                  No robots found.
                </CTableDataCell>
              </CTableRow>
            ) : (
              shiftrobots.map((robot, index) => (
                <CTableRow key={robot.deveui}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedRobots.some(
                        (r) => r.deveui === robot.deveui
                      )}
                      onChange={() => handleCheckboxChange(robot)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{robot.robot_no}</CTableDataCell>
                  <CTableDataCell>{robot.lora_no}</CTableDataCell>
                  <CTableDataCell>{robot.deveui}</CTableDataCell>
                  <CTableDataCell>{robot.site_id}</CTableDataCell>
                  <CTableDataCell>{robot.block}</CTableDataCell>
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
      </CCardBody>
    </div>
  );
};

export default ShiftBlockwiseRobots;
