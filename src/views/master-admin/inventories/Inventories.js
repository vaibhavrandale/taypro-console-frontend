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
  CCard,
  CCardBody,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import PaginateInput from "../../../components/PaginateInput";

const InventoryTab = () => {
  const [selectedTab, setSelectedTab] = useState("inventory");

  return (
    <div>
      {" "}
      {/* Increased padding */}
      {/* Toggle Cards */}
      <CRow className="my-1 text-center">
        <CCol md={4} className="my-2 p-8">
          <CCard
            className={`shadow-sm border-0 ${
              selectedTab === "inventory" ? "border-success" : "bg-dark"
            }`}
            onClick={() => setSelectedTab("inventory")}
            style={{
              cursor: "pointer",
              backgroundColor:
                selectedTab === "inventory" ? "#96db00" : "#052638",
              color: selectedTab === "inventory" ? "black" : "white",
            }}
          >
            <CCardBody>
              <h6 className="fw-bold">Service Inventory</h6>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="my-2 p-8">
          <CCard
            className={`shadow-sm border-0 ${
              selectedTab === "item" ? "border-success" : "bg-dark"
            }`}
            onClick={() => setSelectedTab("item")}
            style={{
              cursor: "pointer",
              backgroundColor: selectedTab === "item" ? "#96db00" : "#052638",
              color: selectedTab === "item" ? "black" : "white",
            }}
          >
            <CCardBody>
              <h6 className="fw-bold">Service Item</h6>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Conditional Rendering */}
      {selectedTab === "inventory" ? <Inventories /> : <ServiceItems />}
    </div>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INVENTORY_REQUEST":
      return { ...state, loadingInventories: true, error: "" };
    case "FETCH_INVENTORY_SUCCESS":
      return {
        ...state,
        loadingInventories: false,
        inventories: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_INVENTORY_FAIL":
      return { ...state, loadingInventories: false, error: action.payload };
    case "FETCH_SERVICEITEM_REQUEST":
      return { ...state, loadingServiceItems: true, error: "" };
    case "FETCH_SERVICEITEM_SUCCESS":
      return {
        ...state,
        loadingServiceItems: false,
        serviceItems: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_SERVICEITEM_FAIL":
      return { ...state, loadingServiceItems: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false };
    default:
      return state;
  }
};

const Inventories = () => {
  const [
    {
      error,
      inventories,
      loadingInventories,
      totalPages,
      hasNextPage,
      hasPrevPage,
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

  // const [selectedSite, setSelectedSite] = useState('');
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
      dispatch({ type: "FETCH_INVENTORY_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/service-inventory/get-inventory`,
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
          type: "FETCH_INVENTORY_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_INVENTORY_FAIL",
          payload: "Failed to fetch Inventories",
        });
        toast.error("Failed to fetch Inventories");
      }
    };

    fetchInventories();
  }, [authtoken, limit, page]);

  const filteredInventories = inventories.filter(
    (inventory) =>
      inventory.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.item_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal and load robot data
  const openModal = (inventory) => {
    setSelectedInventory(inventory);
    setFormData(inventory);
    setModalVisible(true);
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

  //   const deleteInventory = async (inventory) => {
  //     if (
  //       window.confirm(
  //         `Are you sure you want to delete Inventory item - ${inventory.item_name}`
  //       )
  //     ) {
  //       try {
  //         await axios.delete(`/api/v1/service-inventory/${inventory._id}`, {
  //           headers: { Authorization: `Bearer ${authtoken}` },
  //         });

  //         toast.success("Service Inventory deleted successfully");
  //         dispatch({ type: "DELETE_SUCCESS" });
  //       } catch (err) {
  //         toast.error(err.response ? err.response.data.message : err.message);
  //         dispatch({ type: "DELETE_FAIL" });
  //       }
  //     }
  //   };
  return (
    <div className="p-2">
      <h2 className="text-center mt-4">Service Inventory List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-primary m-1"
          to="/master-admin/inventories/add-inventory"
        >
          Add Inventory
        </Link>
      </div>
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
      <CTable bordered hover responsive className="text-center shadow-sm">
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
              Threshold
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
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{inventory.item_name}</CTableDataCell>
                <CTableDataCell>{inventory.item_code}</CTableDataCell>
                <CTableDataCell>{inventory.site_id}</CTableDataCell>
                <CTableDataCell>{inventory.quantity}</CTableDataCell>
                <CTableDataCell>{inventory.threshold}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="secondary"
                    size="sm"
                    onClick={() => openModal(inventory)}
                  >
                    View
                  </Link>

                  <Link
                    className="btn btn-sm btn-warning m-1"
                    to={`/master-admin/inventories/${inventory._id}`}
                  >
                    Update
                  </Link>
                  {/* <Link
                    color="danger"
                    size="sm"
                    className=" btn btn-sm btn-danger m-1 text-white"
                    onClick={() => deleteInventory(inventory)}
                  >
                    Delete
                  </Link> */}
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
      />
      {/* view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Inventory Data :&nbsp;
            <span className="badge bg-success">{formData.robot_no}</span>{" "}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedInventory && (
            <>
              <CTable bordered responsive>
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
                        <CTableDataCell className="fw-semibold text-uppercase text-secondary">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-dark fw-medium">
                            {String(value)}
                          </span>
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

const ServiceItems = () => {
  const [
    {
      error,
      serviceItems,
      loadingServiceItems,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    serviceItems: [],
    loading: true,
    loadingServiceItems: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // const [selectedSite, setSelectedSite] = useState('');
  const [formData, setFormData] = useState({
    item_name: "",
    item_code: "",
    item_image: "",
    item_description: "",
  });

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchServiceItems = async () => {
      dispatch({ type: "FETCH_SERVICEITEM_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/service-items/get-service-items`,
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
          type: "FETCH_SERVICEITEM_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SERVICEITEM_FAIL",
          payload: "Failed to fetch Service Items",
        });
        toast.error("Failed to fetch Service Items");
      }
    };

    fetchServiceItems();
  }, [authtoken, limit, page]);

  // Filter robots based on search term
  const filteredInventories = serviceItems.filter(
    (serviceItem) =>
      serviceItem.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceItem.item_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal and load items data
  const openModal = (serviceItem) => {
    setSelectedServiceItem(serviceItem);
    setFormData(serviceItem);
    setModalVisible(true);
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

  //   const deleteServiceItem = async (serviceItem) => {
  //     if (
  //       window.confirm(
  //         `Are you sure you want to delete Inventory item - ${serviceItem.item_name}`
  //       )
  //     ) {
  //       try {
  //         await axios.delete(`/api/v1/service-serviceItem/${serviceItem._id}`, {
  //           headers: { Authorization: `Bearer ${authtoken}` },
  //         });

  //         toast.success("Service Inventory deleted successfully");
  //         dispatch({ type: "DELETE_SUCCESS" });
  //       } catch (err) {
  //         toast.error(err.response ? err.response.data.message : err.message);
  //         dispatch({ type: "DELETE_FAIL" });
  //       }
  //     }
  //   };
  return (
    <div className="p-2">
      <h2 className="text-center mt-4">Service Item List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-primary m-1"
          to="/master-admin/inventories/add-service-item"
        >
          Add Items
        </Link>
      </div>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Item Name, Item Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* ServiceItems Table */}
      <CTable bordered hover responsive className="text-center shadow-sm">
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
              Image
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Description
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingServiceItems ? (
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
            filteredInventories.map((serviceItem, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{serviceItem.item_name}</CTableDataCell>
                <CTableDataCell>{serviceItem.item_code}</CTableDataCell>
                {/* <CTableDataCell>{serviceItem.item_image}</CTableDataCell> */}
                <CTableDataCell>
                  <img
                    src={serviceItem.item_image}
                    alt="Client Logo"
                    className="img-thumbnail border-0"
                    width="100"
                    height="50"
                  />
                </CTableDataCell>
                <CTableDataCell>{serviceItem.item_description}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="secondary"
                    size="sm"
                    onClick={() => openModal(serviceItem)}
                  >
                    View
                  </Link>

                  <Link
                    className="btn btn-sm btn-warning m-1"
                    // to={`/master-admin/serviceItems/${serviceItem._id}`}
                  >
                    Update
                  </Link>
                  {/* <Link
                    color="danger"
                    size="sm"
                    className=" btn btn-sm btn-danger m-1 text-white"
                    onClick={() => deleteServiceItem(serviceItem)}
                  >
                    Delete
                  </Link> */}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No Matching Service Items Found.
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
      />
      {/* view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Service Item Data :&nbsp;
            <span className="badge bg-success">{formData.robot_no}</span>{" "}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedServiceItem && (
            <>
              <CTable bordered responsive>
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
                        <CTableDataCell className="fw-semibold text-uppercase text-secondary">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-dark fw-medium">
                            {String(value)}
                          </span>
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

export default InventoryTab;
