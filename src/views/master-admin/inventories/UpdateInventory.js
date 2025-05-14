import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormLabel,
  CRow,
} from "@coreui/react";

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, inventory: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    default:
      return state;
  }
};

const UpdateInventory = () => {
  const [{ loading, error, updating }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    updating: false,
  });

  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  const navigate = useNavigate();

  const [inventoryData, setInventoryData] = useState({
    item_name: "",
    item_code: "",
    item_id: "",
    site_id: "",
    quantity: "",
    threshold: "",
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/v1/service-inventory/get-one/${id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
        setInventoryData(data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchInventory();
  }, [id, authtoken]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setInventoryData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix: Prevent default form submission

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const {
        createdAt,
        _id,
        item_id,
        updatedAt,
        last_activity,
        ...filteredFormData
      } = inventoryData;

      await axios.put(`/api/v1/service-inventory/${id}`, filteredFormData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Inventory Updated Successfully!");

      navigate(`/${adminroute}/inventories`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: "Update failed" });
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          Update Inventory -{" "}
          <b className="badge bg-success">{inventoryData.site_id}</b>
        </CCardHeader>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : (
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_name"
                      value={inventoryData.item_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Item Id</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_id"
                      value={inventoryData.item_id || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Item Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_code"
                      value={inventoryData.item_code || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Site Id</label>
                    <input
                      type="text"
                      className="form-control"
                      name="site_id"
                      value={inventoryData.site_id || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="text"
                      className="form-control"
                      name="quantity"
                      value={inventoryData.quantity || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Threshold</label>
                    <input
                      type="text"
                      className="form-control"
                      name="threshold"
                      value={inventoryData.threshold || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormLabel>
                    Delete Inventory :<span className="text-muted ms-2"></span>
                  </CFormLabel>{" "}
                  {/* <br /> */}
                  <CFormCheck
                    id="is_delete"
                    name="is_delete"
                    checked={inventoryData.is_delete || false}
                    onChange={handleChange}
                  />{" "}
                </CCol>
              </CRow>
              <button
                type="submit"
                className="btn btn-warning btn-sm"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </form>
          </CCardBody>
        )}
      </CCard>
    </div>
  );
};

export default UpdateInventory;
