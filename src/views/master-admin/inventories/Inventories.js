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
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CImage,
  CBadge,
  // CFormSelect,
} from "@coreui/react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
// import InventoryOverview from "./InventoryOverview";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import image from "./tool.png";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import SiteSelect from "../../../components/SiteSelect";
const InventoryTab = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "item" ? "item" : "inventory";

  return (
    <div>
      <CTabs activeItemKey={tab} key={tab}>
        <CTabList variant="tabs">
          {/* <CTab itemKey="inventoryOverview">Inventory Overview</CTab> */}
          <CTab itemKey="inventory">Service Inventory</CTab>
          <CTab itemKey="item">Service Item</CTab>
        </CTabList>
        <CTabContent>
          {/* <CTabPanel className="p-3" itemKey="inventoryOverview">
            <InventoryOverview />
          </CTabPanel> */}
          <CTabPanel className="p-3" itemKey="inventory">
            <Inventories />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey="item">
            <ServiceItems />
          </CTabPanel>
        </CTabContent>
      </CTabs>
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
      };
    case "FETCH_SERVICEITEM_FAIL":
      return { ...state, loadingServiceItems: false, error: action.payload };
    // case "FETCH_SITES_REQUEST":
    //   return { ...state, loadingSites: true, siteError: "" };
    // case "FETCH_SITES_SUCCESS":
    //   return { ...state, loadingSites: false, sites: action.payload };
    // case "FETCH_SITES_FAIL":
    //   return { ...state, loadingSites: false, siteError: action.payload };
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
      // sites,
      // loadingSites,
      // siteError,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    inventories: [],
    // sites: [],
    // loadingSites: true,
    // siteError: "",
    loading: true,
    loadingInventories: true,
    error: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [siteId, setSiteId] = useState("all");

  const [formData, setFormData] = useState({
    item_name: "",
    item_code: "",
    item_id: "",
    site_id: "",
    quantity: "",
    threshold: "",
  });

  useEffect(() => {
    const fetchInventories = async () => {
      dispatch({ type: "FETCH_INVENTORY_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/service-inventory/get-inventory`,
          {},
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_INVENTORY_SUCCESS",
          payload: {
            data: result.data.data,
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

    // const fetchSites = async () => {
    //   dispatch({ type: "FETCH_SITES_REQUEST" });
    //   try {
    //     const result = await axios.get(`/api/v1/sites`, {
    //       // headers: { Authorization: `Bearer ${authtoken}` },
    //       withCredentials: true,
    //     });
    //     dispatch({
    //       type: "FETCH_SITES_SUCCESS",
    //       payload: result.data.data,
    //     });
    //   } catch (error) {
    //     dispatch({
    //       type: "FETCH_SITES_FAIL",
    //       payload: error.response.data.error,
    //     });
    //     toast.error("Failed to fetch sites");
    //   }
    // };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchInventories();
    }
    // fetchSites();
  }, [successDelete]);
  const filteredInventories = inventories.filter((inventory) => {
    // Apply site filter first
    if (siteId !== "all" && inventory.site_id !== siteId) {
      return false;
    }

    // Then apply search term filter
    if (searchTerm) {
      return (
        inventory.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inventory.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inventory.item_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });
  // Open modal and load inventory data
  const openModal = (inventory) => {
    setSelectedInventory(inventory);
    setFormData(inventory);
    setModalVisible(true);
  };

  const deleteInventory = async (inventory) => {
    if (inventory.is_delete) {
      toast.error("This Service Inventory Item is already deleted.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete Inventory item - ${inventory.item_name}`,
      )
    ) {
      try {
        await axios.delete(`/api/v1/service-inventory/${inventory._id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        toast.success("Service Inventory deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const exportToExcel = () => {
    if (filteredInventories.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    // Convert JSON to sheet
    const worksheet = XLSX.utils.json_to_sheet(
      filteredInventories.map((item, index) => ({
        "#": index + 1,
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        "Site Id": item.site_id,
        Quantity: item.quantity,
        Threshold: item.threshold,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service Inventories");

    // Trigger download
    XLSX.writeFile(workbook, "Service Inventory.xlsx");
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
      <h2 className="text-center mt-4">Service Inventory List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-secondary m-1"
          to={`/${adminroute}/inventories/add-inventory`}
        >
          Add Inventory
        </Link>
        <button
          type="button"
          className="btn btn-sm btn-primary m-1"
          onClick={exportToExcel}
        >
          Export
        </button>
      </div>
      {/* Search Input */}
      <CRow className="mb-3  justify-content-between align-items-center">
        <CCol md={4}>
          {/* <CFormSelect
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            disabled={loadingSites}
          >
            <option value="all">All Sites</option>
            {sites.map((site) => (
              <option key={site._id} value={site.site_id}>
                {site.site_id}
              </option>
            ))}
          </CFormSelect> */}
          <SiteSelect value={siteId} onChange={setSiteId} />
        </CCol>
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

                <CTableDataCell>{inventory.threshold}</CTableDataCell>
                <CTableDataCell>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary m-1"
                    onClick={() => openModal(inventory)}
                  >
                    View
                  </button>

                  <Link
                    className="btn btn-sm btn-warning m-1"
                    to={`/${adminroute}/inventories/update-inventory/${inventory._id}`}
                  >
                    Update
                  </Link>

                  {!["Master User", "Project User", "Service User"].includes(
                    userInfo?.role,
                  ) && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger m-1 text-white"
                      onClick={() => deleteInventory(inventory)}
                    >
                      Delete
                    </button>
                  )}
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

const ServiceItems = () => {
  const [
    {
      error,
      serviceItems,
      loadingServiceItems,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    serviceItems: [],
    loading: true,
    loadingServiceItems: true,
    error: "",
  });
  // const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);

  // const [selectedSite, setSelectedSite] = useState('');
  const [formData, setFormData] = useState({
    item_name: "",
    item_code: "",
    item_image: "",
    item_description: "",
  });

  useEffect(() => {
    const fetchServiceItems = async () => {
      dispatch({ type: "FETCH_SERVICEITEM_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/service-items/get-service-items`,
          {},
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_SERVICEITEM_SUCCESS",
          payload: {
            data: result.data.data,
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchServiceItems();
    }
  }, [successDelete]);

  // Filter robots based on search term
  const filteredInventories = serviceItems.filter(
    (serviceItem) =>
      serviceItem.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceItem.item_code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Open modal and load items data
  const openModal = (serviceItem) => {
    setSelectedServiceItem(serviceItem);
    setFormData(serviceItem);
    setModalVisible(true);
  };

  const deleteServiceItem = async (serviceItem) => {
    if (serviceItem.is_delete) {
      toast.error("This Service Item is already deleted.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete Service item - ${serviceItem.item_name}`,
      )
    ) {
      try {
        await axios.delete(`/api/v1/service-items/${serviceItem._id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        toast.success("Service Item deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const exportToExcel = () => {
    if (filteredInventories.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    // Convert JSON to sheet
    const worksheet = XLSX.utils.json_to_sheet(
      filteredInventories.map((item, index) => ({
        "#": index + 1,
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        "Item Description": item.item_description,
        "Item Image": "View Image",
      })),
    );

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // to get the column for which hyperlink is to be set
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 });

      // check if the item has image url
      const imageUrl = filteredInventories[row - 1]?.item_image;
      if (worksheet[cellAddress] && imageUrl) {
        worksheet[cellAddress].l = {
          Target: imageUrl,
          Tooltip: "Click to view image",
        };
      }
    }

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service Items");

    // Trigger download
    XLSX.writeFile(workbook, "Service_Item.xlsx");
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
      <h2 className="text-center mt-4">Service Item List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-secondary m-1"
          to={`/${adminroute}/inventories/add-service-item`}
        >
          Add Item
        </Link>
        <button
          type="button"
          className="btn btn-sm btn-primary m-1"
          onClick={exportToExcel}
        >
          Export
        </button>
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
              <CTableRow
                key={index}
                className={serviceItem.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{serviceItem.item_name}</CTableDataCell>
                <CTableDataCell>{serviceItem.item_code}</CTableDataCell>
                <CTableDataCell>
                  {serviceItem.item_image ? (
                    <CImage
                      fluid
                      src={serviceItem.item_image}
                      alt="Service item"
                      className="img-thumbnail border-0"
                      width="100"
                      height="50"
                    />
                  ) : (
                    <CImage
                      fluid
                      src={image}
                      alt="Service item"
                      className="img-thumbnail border-0"
                      width="100"
                      height="50"
                    />
                  )}
                </CTableDataCell>
                <CTableDataCell>{serviceItem.item_description}</CTableDataCell>
                <CTableDataCell>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary m-1"
                    onClick={() => openModal(serviceItem)}
                  >
                    View
                  </button>

                  {/* Hide Update button for Master User, Project User, Service User */}
                  {!["Master User", "Project User", "Service User"].includes(
                    userInfo?.role,
                  ) && (
                    <Link
                      className="btn btn-sm btn-warning m-1"
                      to={`/${adminroute}/inventories/update-service-item/${serviceItem._id}`}
                    >
                      Update
                    </Link>
                  )}

                  {/* Hide Delete button for Master User, Project User, Service User */}
                  {!["Master User", "Project User", "Service User"].includes(
                    userInfo?.role,
                  ) && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger m-1 text-white"
                      onClick={() => deleteServiceItem(serviceItem)}
                    >
                      Delete
                    </button>
                  )}
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

      {/* view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Service Item Data :&nbsp;
            <span className="badge bg-success">{formData.item_name}</span>{" "}
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
          {selectedServiceItem && (
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
                          {key === "item_image" ? (
                            <CImage
                              fluid
                              src={String(value)}
                              alt={key}
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span className=" fw-medium">{String(value)}</span>
                          )}
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
