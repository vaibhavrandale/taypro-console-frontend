import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import PaginateInput from "../../../components/PaginateInput";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FAULTYINVENTORY_REQUEST":
      return { ...state, loadingInventories: true, error: "" };
    case "FETCH_FAULTYINVENTORY_SUCCESS":
      return {
        ...state,
        loadingInventories: false,
        inventories: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAULTYINVENTORY_FAIL":
      return { ...state, loadingInventories: false, error: action.payload };

    default:
      return state;
  }
};

const FaultyInventory = () => {
  const [
    {
      error,
      inventories,
      loadingInventories,
      totalPages,
      hasNextPage,
      hasPrevPage,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    inventories: [],
    loading: true,
    loadingInventories: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formData, setFormData] = useState({
    item_name: "",
    item_code: "",
    item_id: "",
    site_id: "",
    quantity: "",
    threshold: "",
  });

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchInventories = async () => {
      dispatch({ type: "FETCH_FAULTYINVENTORY_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/faulty-inventory`,
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
          type: "FETCH_FAULTYINVENTORY_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAULTYINVENTORY_FAIL",
          payload: "Failed to fetch Inventories",
        });
        toast.error("Failed to fetch Inventories");
      }
    };

    fetchInventories();
  }, [successDelete, authtoken, limit, page]);

  const filteredInventories = inventories.filter(
    (inventory) =>
      inventory.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.item_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal and load inventory data
  const openModal = (inventory) => {
    setSelectedInventory(inventory);
    setFormData(inventory);
    setModalVisible(true);
  };
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.item(uniqueSitenames);
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

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  return (
    <div className="p-2">
      <h2 className="text-center mt-4">Faulty Inventory List</h2>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Site Id, Item Id, Item Name, or Item Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Inventories Table */}
      <CTable
        bordered
        hover
        responsive
        className="text-center shadow-sm bg-important"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Item Name
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Item Code
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Site Id
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Quantity
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingInventories ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              {" "}
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredInventories.length > 0 ? (
            filteredInventories.map((inventory, index) => (
              <CTableRow
                key={index}
                className={inventory.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{inventory.item_name}</CTableDataCell>
                <CTableDataCell>{inventory.item_code}</CTableDataCell>
                <CTableDataCell>{inventory.site_id}</CTableDataCell>
                {inventory.quantity <= inventory.threshold ? (
                  <CTableDataCell>
                    {" "}
                    <CBadge color="danger"> {inventory.quantity}</CBadge>
                  </CTableDataCell>
                ) : (
                  <CTableDataCell>{inventory.quantity}</CTableDataCell>
                )}
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="secondary"
                    size="sm"
                    onClick={() => openModal(inventory)}
                  >
                    View
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching Inventories found.
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
      {/* view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Inventory Data :&nbsp;
            <span className="badge bg-success">{formData.site_id}</span>{" "}
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
          {selectedInventory && (
            <>
              <CTable bordered responsive className="bg-important">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Object.entries(formData)
                    .filter(([key]) => key !== "last_activity") // Exclude last_activity
                    .map(([key, value]) => (
                      <CTableRow key={key} className="align-middle">
                        <CTableDataCell className="fw-semibold text-uppercase ">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className=" fw-medium">{String(value)}</span>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>

              {formData.last_activity && (
                <LastActivity lastactivity={formData.last_activity} />
              )}
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default FaultyInventory;
