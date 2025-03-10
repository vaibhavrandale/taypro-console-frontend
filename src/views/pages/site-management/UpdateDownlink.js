import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { CAlert } from "@coreui/react";

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, downlink: action.payload, loading: false };
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

const UpdateDownlink = () => {
  const [{ loading, error, updating }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    updating: false,
  });

  const { site_id, block, robot_no, id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [downlinkData, setDownlinkData] = useState({
    downlink: "",
    decodedString: "",
    hexadecimal: "",
    uplink: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const fetchDownlink = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/v1/downlinks/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
        setDownlinkData(data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchDownlink();
  }, [id, authtoken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDownlinkData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix: Prevent default form submission

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { createdAt, _id, last_activity, ...filteredFormData } =
        downlinkData;

      await axios.put(`/api/v1/downlinks/${id}`, filteredFormData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Downlink updated successfully");

      navigate(
        `/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}`
      );
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: "Update failed" });
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Downlink</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CAlert color="danger">{error}</CAlert>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Downlink</label>
            <input
              type="text"
              className="form-control"
              name="downlink"
              value={downlinkData.downlink || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Decoded String</label>
            <input
              type="text"
              className="form-control"
              name="decodedString"
              value={downlinkData.decodedString || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Hexadecimal</label>
            <input
              type="text"
              className="form-control"
              name="hexadecimal"
              value={downlinkData.hexadecimal || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Uplink</label>
            <input
              type="text"
              className="form-control"
              name="uplink"
              value={downlinkData.uplink || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Additional Info</label>
            <input
              type="text"
              className="form-control"
              name="additionalInfo"
              value={downlinkData.additionalInfo || ""}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning btn-sm"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateDownlink;
