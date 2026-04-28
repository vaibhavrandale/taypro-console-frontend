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
        inactiverobots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, fetchingRobots: false, error: action.payload };

    case "ACTIVATE_ROBOTS_REQUEST":
      return { ...state, loadingActivateRobots: true, error: "" };
    case "ACTIVATE_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingActivateRobots: false,
        inactiverobots: state.inactiverobots.filter(
          (robot) =>
            !action.payload.some(
              (activated) => activated.deveui === robot.deveui,
            ),
        ),
        activatedRobots: [...state.activatedRobots, ...action.payload],
      };
    case "ACTIVATE_ROBOTS_FAIL":
      return { ...state, loadingActivateRobots: false, error: action.payload };

    default:
      return state;
  }
};

const ActivateRobots = () => {
  const [
    {
      loadingActivateRobots,
      fetchingRobots,
      error,
      inactiverobots,
      activatedRobots,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    inactiverobots: [],
    activatedRobots: [],
    loadingActivateRobots: false,
    fetchingRobots: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [selectedRobots, setSelectedRobots] = useState([]);
  // const authtoken = useSelector((state) => state.authtoken);
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.post(`/api/v1/robots/inactive`, pagination, {
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

  // ✅ Handle Checkbox Selection
  const handleCheckboxChange = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.deveui === robot.deveui)
        ? prev.filter((r) => r.deveui !== robot.deveui)
        : [...prev, robot],
    );
  };

  // ✅ Activate Selected Robots
  const activateSelectedRobots = async () => {
    if (selectedRobots.length === 0) {
      toast.error("Please select at least one robot to activate.");
      return;
    }

    dispatch({ type: "ACTIVATE_ROBOTS_REQUEST" });

    try {
      await axios.put(
        "/api/v1/robots/activate",
        { deveuiArray: selectedRobots.map((robot) => robot.deveui) },
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );

      dispatch({ type: "ACTIVATE_ROBOTS_SUCCESS", payload: selectedRobots });
      toast.success("Selected robots activated successfully.");
      setSelectedRobots([]); // Clear selection after activation
    } catch (error) {
      dispatch({
        type: "ACTIVATE_ROBOTS_FAIL",
        payload: "Failed to activate robots",
      });
      toast.error("Failed to activate robots");
    }
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

  const AllActivate = () => {
    if (inactiverobots.length === 0) {
      toast.error("No robots to activate.");
      return;
    }
    setSelectedRobots(inactiverobots);
  };
  return (
    <div className="p-2">
      <h4>Activate Robots</h4>

      <CCardBody>
        <div className="d-flex justify-content-end align-items-center">
          <Link
            className="btn btn-sm btn-secondary m-1"
            to="/master-admin/robots"
          >
            All Robots
          </Link>
          <CButton
            color="success"
            size="sm"
            onClick={activateSelectedRobots}
            disabled={loadingActivateRobots}
          >
            {loadingActivateRobots ? (
              <>
                Activating..
                <LoadingSpinner />
              </>
            ) : (
              "Activate Selected"
            )}
          </CButton>
        </div>

        {/* ✅ Display Activated Robots */}
        {activatedRobots.length > 0 && (
          <div className="mt-3">
            <h5>Activated Robots 🔽</h5>
            {activatedRobots.map((robot, index) => (
              <p key={index}>
                {index + 1}] Robot No:{" "}
                <span className="text-success">{robot.robot_no}</span>
              </p>
            ))}
          </div>
        )}

        <CTable
          bordered
          hover
          responsive
          className="text-center shadow-sm mt-3"
        >
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>
                <CFormCheck onChange={() => AllActivate()} />
              </CTableHeaderCell>
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
            ) : inactiverobots.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center">
                  No inactive robots found.
                </CTableDataCell>
              </CTableRow>
            ) : (
              inactiverobots.map((robot, index) => (
                <CTableRow key={robot.deveui}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedRobots.some(
                        (r) => r.deveui === robot.deveui,
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

export default ActivateRobots;
