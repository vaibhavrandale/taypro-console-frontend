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
    case "FETCH_MDS_REQUEST":
      return { ...state, fetchingMds: true, error: "" };
    case "FETCH_MDS_SUCCESS":
      return {
        ...state,
        fetchingMds: false,
        inactiveMds: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_MDS_FAIL":
      return { ...state, fetchingMds: false, error: action.payload };

    case "ACTIVATE_MDS_REQUEST":
      return { ...state, loadingActivateMds: true, error: "" };
    case "ACTIVATE_MDS_SUCCESS":
      return {
        ...state,
        loadingActivateMds: false,
        inactiveMds: state.inactiveMds.filter(
          (mds) =>
            !action.payload.some((activated) => activated.deveui === mds.deveui)
        ),
        activatedMds: [...state.activatedMds, ...action.payload],
      };
    case "ACTIVATE_MDS_FAIL":
      return { ...state, loadingActivateMds: false, error: action.payload };

    default:
      return state;
  }
};

const ActivateMds = () => {
  const [
    {
      loadingActivateMds,
      fetchingMds,
      error,
      inactiveMds,
      activatedMds,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    inactiveMds: [],
    activatedMds: [],
    loadingActivateMds: false,
    fetchingMds: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [selectedMds, setSelectedMds] = useState([]);
  const authtoken = useSelector((state) => state.authtoken);
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchMds = async () => {
      dispatch({ type: "FETCH_MDS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/mds-device/inactive`,
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
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    fetchMds();
  }, [authtoken, limit, page]);

  // ✅ Handle Checkbox Selection
  const handleCheckboxChange = (mds) => {
    setSelectedMds((prev) =>
      prev.some((r) => r.deveui === mds.deveui)
        ? prev.filter((r) => r.deveui !== mds.deveui)
        : [...prev, mds]
    );
  };

  // ✅ Activate Selected MDS Devices
  const activateSelectedMds = async () => {
    if (selectedMds.length === 0) {
      toast.error("Please select at least one MDS to activate.");
      return;
    }

    dispatch({ type: "ACTIVATE_MDS_REQUEST" });

    try {
      await axios.put(
        "/api/v1/mds-device/activate",
        { deveuiArray: selectedMds.map((mds) => mds.deveui) },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({ type: "ACTIVATE_MDS_SUCCESS", payload: selectedMds });
      toast.success("Selected MDS devices activated successfully.");
      setSelectedMds([]); // Clear selection after activation
    } catch (error) {
      dispatch({
        type: "ACTIVATE_MDS_FAIL",
        payload: "Failed to activate MDS devices",
      });
      toast.error("Failed to activate MDS devices");
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
    if (inactiveMds.length === 0) {
      toast.error("No MDS devices to activate.");
      return;
    }
    setSelectedMds(inactiveMds);
  };

  return (
    <div className="p-2">
      <h4>Activate MDS Devices</h4>

      <CCardBody>
        <div className="d-flex justify-content-end align-items-center">
          <Link
            className="btn btn-sm btn-secondary m-1"
            to="/master-admin/mds-devices"
          >
            All MDS
          </Link>
          <CButton
            color="success"
            size="sm"
            onClick={activateSelectedMds}
            disabled={loadingActivateMds}
          >
            {loadingActivateMds ? (
              <>
                Activating..
                <LoadingSpinner />
              </>
            ) : (
              "Activate Selected"
            )}
          </CButton>
        </div>

        {/* ✅ Display Activated MDS Devices */}
        {activatedMds.length > 0 && (
          <div className="mt-3">
            <h5>Activated MDS Devices 🔽</h5>
            {activatedMds.map((mds, index) => (
              <p key={index}>
                {index + 1}] MDS No:{" "}
                <span className="text-success">{mds.mds_no}</span>
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
              <CTableHeaderCell>MDS No</CTableHeaderCell>
              <CTableHeaderCell>Lora Serial No</CTableHeaderCell>
              <CTableHeaderCell>Deveui</CTableHeaderCell>
              <CTableHeaderCell>Site ID</CTableHeaderCell>
              <CTableHeaderCell>Block</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {fetchingMds ? (
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
            ) : inactiveMds.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center">
                  No inactive MDS devices found.
                </CTableDataCell>
              </CTableRow>
            ) : (
              inactiveMds.map((mds, index) => (
                <CTableRow key={mds.deveui}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedMds.some((r) => r.deveui === mds.deveui)}
                      onChange={() => handleCheckboxChange(mds)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{mds.mds_no}</CTableDataCell>
                  <CTableDataCell>{mds.lora_no}</CTableDataCell>
                  <CTableDataCell>{mds.deveui}</CTableDataCell>
                  <CTableDataCell>{mds.site_id}</CTableDataCell>
                  <CTableDataCell>{mds.block}</CTableDataCell>
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
          handleLimitChange={setLimit}
        />
      </CCardBody>
    </div>
  );
};

export default ActivateMds;
