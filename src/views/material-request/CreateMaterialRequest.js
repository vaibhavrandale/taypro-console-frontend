import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { GrAddCircle } from "react-icons/gr";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
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

    case "FETCH_INVENTORY_FETCH":
      return { ...state, inventoryLoading: false };
    case "FETCH_INVENTORY_SUCCESS":
      return { ...state, inventories: action.payload, inventoryLoading: false };
    case "FETCH_INVENTORY_FAIL":
      return {
        ...state,
        inventoryError: action.payload,
        inventoryLoading: false,
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
      inventoryLoading,
      inventories,
      inventoryError,
    },
    dispatch,
  ] = useReducer(reducer, {
    createLoading: false,
    createError: "",
    sitesLoading: false,
    sites: [],
    sitesError: "",
    inventoryLoading: false,
    inventories: [],
    inventoryError: "",
  });

  const navigate = useNavigate();
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  // ================= FORM =================
  const [formData, setFormData] = useState({
    company: "Taypro Private Limited",
    transaction_date: new Date().toISOString().split("T")[0],
    material_request_type: "Material Transfer",
    site_id: "",
    set_from_warehouse: "Stores - TPL",
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
      dispatch({ type: "FETCH_INVENTORY_FETCH" });
      const { data } = await axios.post(
        `/api/v1/service-inventory/get-inventory`,
        { pg: 1, limit: 100 },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "FETCH_INVENTORY_SUCCESS", payload: data.data });
    } catch (error) {
      toast.error(error.response.data.error || error.response.data.message);
      dispatch({
        type: "FETCH_SITES_FAIL",
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
      const selected = inventories.find((i) => i.item_code === value);

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
  const submitHandler = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length) {
      toast.error(errors.join(", "));
      return;
    }

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
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "CREATE_SUCCESS" });
      toast.success(res.data.message);

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

  // ================= UI =================
  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h3 className="mb-0">New Material Request</h3>
      </div>

      <div className="card-body">
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
              <div className="col-md-6">
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

            <CTable bordered>
              <CTableBody>
                {inventoryLoading ? (
                  <CTableRow>
                    <CTableDataCell>
                      <LoadingSpinner />
                    </CTableDataCell>
                  </CTableRow>
                ) : inventoryError ? (
                  <CTableRow>
                    <CTableDataCell>{inventoryError}</CTableDataCell>
                  </CTableRow>
                ) : (
                  items.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <CFormSelect
                          value={item.item_code}
                          onChange={(e) =>
                            handleItemChange(index, "item_code", e.target.value)
                          }
                        >
                          <option value="">Select Item</option>
                          {inventories?.map((inv) => (
                            <option key={inv._id} value={inv.item_code}>
                              {inv.item_code} - {inv.item_name}
                            </option>
                          ))}
                        </CFormSelect>
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
          {createError && <CAlert color="danger">{createError}</CAlert>}
          {/* SUBMIT */}
          <div className="text-end">
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
    </div>
  );
};

export default CreateMaterialRequest;
