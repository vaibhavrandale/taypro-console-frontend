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
        serviceItemData: {
          ...state.serviceItemData,
          [action.name]: action.value,
        },
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

const NewServiceItem = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    serviceItemData: {
      item_name: "",
      item_code: "",
      item_image: "",
      item_description: "",
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
    if (state.serviceItemData.item_name === "") {
      toast.error("Item Name is required!");
    }
    try {
      const data = await axios.post(
        "/api/v1/service-items",
        state.serviceItemData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      console.log(data);
      toast.success("Service Item Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/master-admin/inventories`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error Adding Service Item",
      });

      toast.error(error.response.data.error || "Error Adding Service Item");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Service Item</h2>

      <form>
        <div className="mb-3">
          <label className="form-label">Item Name</label>

          <input
            type="text"
            className="form-control"
            name="item_name"
            value={state.serviceItemData.item_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Item Code</label>

          <input
            type="text"
            className="form-control"
            name="item_code"
            value={state.serviceItemData.item_code}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Item Description</label>

          <input
            type="text"
            className="form-control"
            name="item_description"
            value={state.serviceItemData.item_description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Item Image</label>

          <input
            type="text"
            className="form-control"
            name="item_image"
            value={state.serviceItemData.item_image}
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
            "Add Service Item"
          )}
        </Link>
      </form>
    </div>
  );
};
export default NewServiceItem;
