import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { GrAddCircle } from "react-icons/gr";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import Select from "react-select";
import {
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CFormTextarea,
  CAlert,
  CTableHeaderCell,
  CTableHead,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, createLoading: true, createError: "" };
    case "CREATE_SUCCESS":
      return { ...state, createLoading: false };
    case "CREATE_FAIL":
      return { ...state, createLoading: false, createError: action.payload };

    case "FETCH_SITES_REQUEST":
      return { ...state, sitesLoading: true };
    case "FETCH_SITES_SUCCESS":
      return { ...state, sites: action.payload, sitesLoading: false };
    case "FETCH_SITES_FAIL":
      return { ...state, sitesLoading: false, sitesError: action.payload };

    case "FETCH_SERVICEITEM_FETCH":
      return { ...state, serviceItemsLoading: false };
    case "FETCH_SERVICEITEM_SUCCESS":
      return {
        ...state,
        serviceItems: action.payload,
        serviceItemsLoading: false,
      };
    case "FETCH_SERVICEITEM_FAIL":
      return {
        ...state,
        serviceItemsError: action.payload,
        serviceItemsLoading: false,
      };

    default:
      return state;
  }
};

const CreateMaterialRequest = () => {
  const [
    {
      createLoading,
      createError,
      sitesLoading,
      sites,
      sitesError,
      serviceItemsLoading,
      serviceItems,
      serviceItemsError,
    },
    dispatch,
  ] = useReducer(reducer, {
    createLoading: false,
    createError: "",
    sitesLoading: false,
    sites: [],
    sitesError: "",
    serviceItemsLoading: false,
    serviceItems: [],
    inventoryError: "",
  });

  const navigate = useNavigate();
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  // ================= FORM =================
  const [formData, setFormData] = useState({
    company: "Taypro Private Limited",
    transaction_date: new Date().toISOString().split("T")[0],
    material_request_type: "Material Transfer",
    site_id: "",
    set_from_warehouse: "Stores - TAYPRO",
    set_to_warehouse: "",
    custom_request_type: "Service",
    remark: "",
  });

  // ================= ITEMS =================
  const [items, setItems] = useState([
    {
      item_code: "",
      item_name: "",
      qty: 1,
      uom: "Nos",
      warehouse: "",
    },
  ]);

  // ================= FETCH =================
  useEffect(() => {
    fetchSites();
    fetchInventories();
  }, []);

  const fetchSites = async () => {
    try {
      dispatch({ type: "FETCH_SITES_REQUEST" });

      const { data } = await axios.get(`/api/v1/sites`, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      const sitesData = data.data;

      dispatch({ type: "FETCH_SITES_SUCCESS", payload: sitesData });

      if (sitesData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          site_id: prev.site_id || sitesData[0].site_id,

          set_to_warehouse: sitesData[0].set_warehouse, // ✅ FIX ADDED
        }));
      }
    } catch (error) {
      toast.error(error.response.data.error || error.response.data.message);
      dispatch({
        type: "FETCH_SITES_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
    }
  };
  const fetchInventories = async () => {
    try {
      dispatch({ type: "FETCH_SERVICEITEM_FETCH" });
      const { data } = await axios.get(
        `/api/v1/service-items`,

        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "FETCH_SERVICEITEM_SUCCESS", payload: data.data });
    } catch (error) {
      toast.error(error.response.data.error || error.response.data.message);
      dispatch({
        type: "FETCH_SERVICEITEM_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
    }
  };

  // ================= HANDLERS =================
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "site_id") {
      const selected = sites && sites.find((s) => s.site_id === value);

      setFormData((prev) => ({
        ...prev,
        site_id: value,
        set_from_warehouse:
          selected?.default_warehouse || prev.set_from_warehouse,
        set_to_warehouse: selected?.set_warehouse, // ✅ FIX ADDED
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    if (field === "item_code") {
      const selected = serviceItems.find((i) => i.item_code === value);

      updated[index].item_code = value;
      updated[index].item_name = selected?.item_name || "";
    } else {
      updated[index][field] = value;
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item_code: "",
        item_name: "",
        qty: 1,
        uom: "Nos",
        warehouse: "",
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) {
      toast.error("At least one item required");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const errors = [];

    if (!formData.site_id) errors.push("Site");

    items.forEach((item, i) => {
      if (!item.item_code) errors.push(`Item ${i + 1}: Item Code`);
      if (!item.qty || item.qty <= 0) errors.push(`Item ${i + 1}: Qty`);
    });

    return errors;
  };

  // ================= SUBMIT =================
  //   const submitHandler = async (e) => {
  //     // if (!window.confirm(`Are you sure you want to Submit..?`)) {
  //     //   return;
  //     // }
  //     e.preventDefault();

  //     const errors = validateForm();
  //     if (errors.length) {
  //       toast.error(errors.join(", "));
  //       return;
  //     }
  //  setSubmitModalVisible(true);
  //     try {
  //       dispatch({ type: "CREATE_REQUEST" });

  //       const payload = {
  //         ...formData,
  //         docstatus: 0,
  //         doctype: "Material Request",
  //         status: "Draft",
  //         console_status: "Draft",

  //         items: items.map((item, idx) => ({
  //           item_code: item.item_code,
  //           item_name: item.item_name,
  //           qty: item.qty,
  //           uom: item.uom,
  //           warehouse: item.warehouse,
  //           docstatus: 0,
  //           doctype: "Material Request Item",
  //           idx: idx + 1,
  //         })),
  //       };

  //       const res = await axios.post("/api/v1/material-requests", payload, {
  //         // headers: { Authorization: `Bearer ${authtoken}` },
  //         withCredentials: true,
  //       });

  //       dispatch({ type: "CREATE_SUCCESS" });
  //       toast.success(res.data.message);

  //       navigate(`/${adminroute}/material-requests`);
  //     } catch (error) {
  //       dispatch({
  //         type: "CREATE_FAIL",
  //         payload: error.response?.data?.message || error.response?.data?.error,
  //       });

  //       toast.error(error.response?.data?.message || error.response?.data?.error);
  //     }
  //   };

  const submitHandler = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length) {
      toast.error(errors.join(", "));
      return;
    }

    setSubmitModalVisible(true);
  };
  const confirmSubmit = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });

      const payload = {
        ...formData,
        docstatus: 0,
        doctype: "Material Request",
        status: "Draft",
        console_status: "Draft",
        items: items.map((item, idx) => ({
          item_code: item.item_code,
          item_name: item.item_name,
          qty: item.qty,
          uom: item.uom,
          warehouse: item.warehouse,
          docstatus: 0,
          doctype: "Material Request Item",
          idx: idx + 1,
        })),
      };

      const res = await axios.post("/api/v1/material-requests", payload, {
        withCredentials: true,
      });

      dispatch({ type: "CREATE_SUCCESS" });

      toast.success(res.data.message);
      setSubmitModalVisible(false);
      navigate(`/${adminroute}/material-requests`);
    } catch (error) {
      dispatch({
        type: "CREATE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });

      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };
  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
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
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      background: "#111c44",
      border: "none",
      borderRadius: "12px",
      minHeight: "26px",
      minWidth: "300px", // <-- not minWdth
      // zIndex: 9999,
    }),

    // menu: (provided) => ({
    //   ...provided,
    //   background: "#16213e",
    //   borderRadius: "5px",
    //   overflow: "hidden",

    //   zIndex: 9999,
    // }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 999999,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 999999,
      backgroundColor: "#16213e",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0px 0px 0px 0px",
      background: "#16213e",
    }),

    option: (provided, state) => ({
      ...provided,
      background: state.isSelected
        ? "#00d4ff22"
        : state.isFocused
          ? "#1b2a52"
          : "#16213e",
      color: state.isSelected ? "#00d4ff" : "#ffffff",
      padding: 8,
      cursor: "pointer",
      transition: "0.2s",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff",
      fontWeight: 500,
    }),

    input: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#00d4ff" : "#94a3b8",
      "&:hover": {
        color: "#00d4ff",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    noOptionsMessage: (provided) => ({
      ...provided,
      color: "#94a3b8",
      padding: "0px 0px 0px 20px",
    }),
  };

  const userimage =
    "https://res.cloudinary.com/decyim6cd/image/upload/v1745395124/profile-image/p051mclk9t82laqu0mvq.webp";

  // ================= UI =================
  return (
    <div className="border p-2">
      <div className="my-2 border-bottom text-white">
        <h3 className="mb-0">New Material Request</h3>
      </div>

      <div className="">
        <CForm onSubmit={submitHandler}>
          {/* BASIC INFO */}
          <div className="mb-4">
            <div className="row">
              <div className="col-md-4">
                <label>Company</label>
                <CFormInput value={formData.company} readOnly />
              </div>
              <div className="col-md-4">
                <label>Date</label>
                <CFormInput
                  type="date"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-md-4">
                {sitesLoading ? (
                  <LoadingSpinner />
                ) : sitesError ? (
                  <CAlert>{sitesError}</CAlert>
                ) : (
                  <>
                    <label>Site</label>
                    <CFormSelect
                      name="site_id"
                      value={formData.site_id}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Site</option>
                      {sites.map((s) => (
                        <option key={s._id} value={s.site_id}>
                          {s.site_id}
                        </option>
                      ))}
                    </CFormSelect>
                  </>
                )}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4">
                <label>From Warehouse</label>
                <CFormInput
                  readOnly
                  name="set_from_warehouse"
                  value={formData.set_from_warehouse}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-md-4">
                {sitesLoading ? (
                  <LoadingSpinner />
                ) : sitesError ? (
                  <CAlert>{sitesError}</CAlert>
                ) : (
                  <>
                    <label>To Warehouse</label>
                    <CFormInput
                      readOnly
                      name="set_to_warehouse"
                      value={formData.set_to_warehouse}
                      onChange={handleFormChange}
                    />
                  </>
                )}
              </div>

              <div className="col-md-4">
                <label>Request Type</label>
                <CFormSelect
                  name="custom_request_type"
                  value={formData.custom_request_type}
                  onChange={handleFormChange}
                >
                  <option value="Service">Service</option>
                  <option value="Project">Project</option>
                </CFormSelect>
              </div>
            </div>

            <div className=" mt-3">
              <div className="col-md-12">
                {" "}
                {/* change to 4 / 6 / 8 */}
                <label>Remark</label>
                <CFormTextarea
                  name="remark"
                  value={formData.remark}
                  placeholder="Enter remark here"
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Items</h5>
              <CButton
                size="sm"
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addItem}
              >
                <GrAddCircle /> Add Item
              </CButton>
            </div>

            <div className="overflow-x-auto">
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Item Code</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "300px" }}>
                      Item Name
                    </CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {serviceItemsLoading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={4}>
                        <LoadingSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : serviceItemsError ? (
                    <CTableRow>
                      <CTableDataCell colSpan={4}>
                        {serviceItemsError}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    items.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          {/* <Select
                            className="z-4"
                            styles={customStyles}
                            placeholder="Search Item..."
                            menuPortalTarget={document.body} // ✅ renders outside overflow container
                            menuPosition="fixed" // ✅ positions relative to viewport
                            value={
                              item.item_code
                                ? {
                                    value: item.item_code,
                                    label: `${item.item_code} - ${item.item_name}`,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              handleItemChange(
                                index,
                                "item_code",
                                selected ? selected.value : "",
                              )
                            }
                            options={serviceItems?.map((serviceItem) => ({
                              value: serviceItem.item_code,
                              label: `${serviceItem.item_code} - ${serviceItem.item_name}`,
                            }))}
                          /> */}

                          <Select
                            className="z-4"
                            styles={customStyles}
                            placeholder="Search Item..."
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            formatOptionLabel={(option) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <img
                                  src={option.item_image || userimage}
                                  alt={option.label}
                                  style={{
                                    width: "56px",
                                    height: "56px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                    border: "1px solid #2a3a6e",
                                    flexShrink: 0,
                                  }}
                                  onError={(e) => {
                                    e.target.src = userimage;
                                  }}
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    lineHeight: "1.3",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#ffffff",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {option.itemName}
                                  </span>
                                  <span
                                    style={{
                                      color: "#94a3b8",
                                      fontSize: "11px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {option.itemCode}
                                  </span>
                                </div>
                              </div>
                            )}
                            value={
                              item.item_code
                                ? {
                                    value: item.item_code,
                                    itemCode: item.item_code,
                                    itemName: item.item_name,
                                    item_image: serviceItems?.find(
                                      (i) => i.item_code === item.item_code,
                                    )?.item_image,
                                    label: `${item.item_code} - ${item.item_name}`,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              handleItemChange(
                                index,
                                "item_code",
                                selected ? selected.value : "",
                              )
                            }
                            options={serviceItems?.map((serviceItem) => ({
                              value: serviceItem.item_code,
                              itemCode: serviceItem.item_code,
                              itemName: serviceItem.item_name,
                              item_image: serviceItem.item_image, // ✅ your image field from DB
                              label: `${serviceItem.item_code} - ${serviceItem.item_name}`,
                            }))}
                          />
                        </CTableDataCell>

                        <CTableDataCell>
                          <CFormInput value={item.item_name} readOnly />
                        </CTableDataCell>

                        <CTableDataCell>
                          <CFormInput
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                          />
                        </CTableDataCell>

                        <CTableDataCell>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <MdDeleteOutline />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </div>
          </div>
          {createError && <CAlert color="danger">{createError}</CAlert>}
          {/* SUBMIT */}
          <div className="text-end  my-4">
            <CButton type="submit" size="sm" disabled={createLoading}>
              {createLoading ? (
                <>
                  Submitting..
                  <LoadingSpinner />
                </>
              ) : (
                "Submit"
              )}
            </CButton>
          </div>
        </CForm>
      </div>
      <CModal
        visible={submitModalVisible}
        onClose={() => setSubmitModalVisible(false)}
        alignment="top"
        className="z-5"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Confirm Submission</CModalTitle>
        </CModalHeader>

        <CModalBody>
          Are you sure you want to submit this Material Request?
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setSubmitModalVisible(false)}
          >
            Cancel
          </CButton>

          <CButton
            color="primary"
            onClick={confirmSubmit}
            disabled={createLoading}
          >
            {createLoading ? "Submitting..." : "Submit"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CreateMaterialRequest;
