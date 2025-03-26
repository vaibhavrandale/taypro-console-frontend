import axios from "axios";
import React, { useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        inventoryData: { ...state.inventoryData, [action.name]: action.value },
      };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

const NewInventory = () => {
  //   const { site_id, block, robot_no } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    inventoryData: {
      item_name: "",
      item_code: "",
      item_id: "",
      site_id: "",
      quantity: "",
      threshold: "",
    },
    loading: false,
    success: false,
  });

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    if (state.inventoryData.site_id === "") {
      toast.error("Site Id is required");
    }
    try {
      const data = await axios.post(
        "/api/v1/service-inventory",
        state.inventoryData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      console.log(data);
      toast.success("Inventory Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/master-admin/inventories`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error Adding Inventory",
      });

      toast.error(error.response.data.error || "Error Adding Inventory");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Service Inventory</h2>

      <form>
        <div className="mb-3">
          <label className="form-label">Item Name</label>

          <input
            type="text"
            className="form-control"
            name="item_name"
            value={state.inventoryData.item_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Item Id</label>

          <input
            type="text"
            className="form-control"
            name="item_id"
            value={state.inventoryData.item_id}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Item Code</label>

          <input
            type="text"
            className="form-control"
            name="item_code"
            value={state.inventoryData.item_code}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Site Id</label>

          <input
            type="text"
            className="form-control"
            name="site_id"
            value={state.inventoryData.site_id}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>

          <input
            type="text"
            className="form-control"
            name="quantity"
            value={state.inventoryData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Threshold</label>

          <input
            type="text"
            className="form-control"
            name="threshold"
            value={state.inventoryData.threshold}
            onChange={handleChange}
          />
        </div>

        <Link onClick={handleSubmit} className="btn btn-warning btn-sm">
          {state.loading ? (
            <>
              Adding..
              <LoadingSpinner />
            </>
          ) : (
            "Add Inventory"
          )}
        </Link>
      </form>
    </div>
  );
};
export default NewInventory;
