// import React from "react";

// const UpdateMaterialRequest = () => {
//   return <div>UpdateMaterialRequest</div>;
// };

// export default UpdateMaterialRequest;

import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CFormCheck,
} from "@coreui/react";

import { GrAddCircle } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MATERIAL_REQUEST":
      return { ...state, materialLoading: true, error: "" };
    case "FETCH_MATERIAL_SUCCESS":
      return { ...state, material: action.payload, materialLoading: false };
    case "FETCH_MATERIAL_FAIL":
      return {
        ...state,
        materialLoading: false,
        materialError: action.payload,
      };

    case "UPDATE_REQUEST":
      return { ...state, updateloading: true };
    case "UPDATE_SUCCESS":
      return { ...state, updateloading: false };
    case "UPDATE_FAIL":
      return { ...state, updateloading: false, updateError: action.payload };

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

const UpdateMaterialRequest = () => {
  const [
    {
      materialLoading,
      material,
      materialError,
      updateloading,
      updateError,
      sitesLoading,
      sites,
      sitesError,
      inventoryLoading,
      inventories,
      inventoryError,
    },
    dispatch,
  ] = useReducer(reducer, {
    materialLoading: false,
    material: null,
    materialError: "",
    updateloading: false,
    updateError: "",
    sitesLoading: false,
    sites: [],
    sitesError: "",
    inventoryLoading: false,
    inventories: [],
    inventoryError: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  // ================= FORM =================
  const [formData, setFormData] = useState({
    company: "",
    transaction_date: "",
    material_request_type: "",
    site_id: "",
    set_from_warehouse: "",
    set_to_warehouse: "",
    custom_request_type: "",
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
    const fetchMaterial = async () => {
      try {
        dispatch({ type: "FETCH_MATERIAL_REQUEST" });

        const { data } = await axios.get(`/api/v1/material-requests/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_MATERIAL_SUCCESS", payload: data.data });

        setFormData(data.data);
        setItems(data.data.items || []);
        if (
          userInfo.role === "Site Technician" &&
          data.data.can_technician_edit === false
        ) {
          navigate(`/${adminroute}/expenses`);
          toast.error("You cannot edit this expense contact to admin");
        }
      } catch (error) {
        dispatch({
          type: "FETCH_MATERIAL_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    const fetchSites = async () => {
      try {
        dispatch({ type: "FETCH_SITES_REQUEST" });
        const { data } = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_SITES_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    const fetchInventories = async () => {
      try {
        const { data } = await axios.post(
          `/api/v1/service-inventory/get-inventory`,
          { pg: 1, limit: 100 },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );

        dispatch({
          type: "FETCH_INVENTORY_SUCCESS",
          payload: data.data,
        });
      } catch {
        toast.error("Failed to fetch inventories");
      }
    };
    fetchMaterial();
    fetchSites();
    fetchInventories();
  }, [authtoken, id, navigate]);

  // ================= HANDLERS =================
  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  // ================= UPDATE =================
  const updateHandler = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length) {
      toast.error(errors.join(", "));
      return;
    }

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      // const payload = {
      //   ...formData,
      //   items: items.map((item, idx) => ({
      //     item_code: item.item_code,
      //     item_name: item.item_name,
      //     qty: item.qty,
      //     uom: item.uom,
      //     warehouse: item.warehouse,
      //     idx: idx + 1,
      //   })),
      // };

      const { createdAt, _id, last_activity, ...cleanFormData } = formData;

      const payload = {
        ...cleanFormData,
        items: items.map((item, idx) => ({
          item_code: item.item_code,
          item_name: item.item_name,
          qty: item.qty,
          uom: item.uom,
          warehouse: item.warehouse,
          idx: idx + 1,
        })),
      };

      const { data } = await axios.put(
        `/api/v1/material-requests/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        },
      );

      dispatch({ type: "UPDATE_SUCCESS" });

      toast.success(data.message);
      navigate(`/${adminroute}/material-requests`);
    } catch (err) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: err.response?.data?.message,
      });

      toast.error(err.response?.data?.message);
    }
  };

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
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  }

  // ================= UI =================
  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          Update Material Request - <b className="badge bg-success">{id}</b>
        </CCardHeader>

        {materialLoading ? (
          <div className="text-center mt-3">
            <LoadingSpinner />
          </div>
        ) : materialError ? (
          <CAlert color="danger">{materialError}</CAlert>
        ) : (
          <CCardBody>
            <CForm onSubmit={updateHandler}>
              {/* BASIC */}
              <div className="mb-4">
                <h4 className="border-bottom pb-2">Basic Information</h4>

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
                      value={
                        formData.transaction_date
                          ? new Date(formData.transaction_date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="col-md-4">
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
                  </div>
                </div>
              </div>

              {/* ITEMS */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <h5>Items</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={addItem}
                  >
                    <GrAddCircle /> Add Item
                  </button>
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
                                handleItemChange(
                                  index,
                                  "item_code",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Select Item</option>
                              {inventories.map((inv) => (
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
              {userInfo.role === "Site Technician" ? (
                ""
              ) : (
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Enable to edit technitian
                  </label>
                  <CFormCheck
                    type="checkbox"
                    name="can_technician_edit"
                    className="form-control"
                    checked={formData.can_technician_edit || false}
                    onChange={handleFormChange}
                  />
                </div>
              )}
              {/* SUBMIT */}
              <div className="text-end">
                <CButton type="submit" disabled={updateloading}>
                  {updateloading ? (
                    <>
                      Updating... <LoadingSpinner />
                    </>
                  ) : (
                    "Update"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        )}
      </CCard>
    </div>
  );
};

export default UpdateMaterialRequest;
