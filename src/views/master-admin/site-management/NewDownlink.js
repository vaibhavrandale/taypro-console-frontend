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
        downlinkData: { ...state.downlinkData, [action.name]: action.value },
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

const NewDownlink = () => {
  const { site_id, block, robot_no } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    downlinkData: {
      downlink: "",
      decodedString: "",
      hexadecimal: "",
      uplink: "",
      additionalInfo: "",
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
    if (state.downlinkData.downlink === "") {
      toast.error("downlink is required");
    }
    try {
      await axios.post("/api/v1/downlinks", state.downlinkData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      toast.success("Downlink added successfully");
      dispatch({ type: "SUBMIT_SUCCESS" });
      navigate(
        `/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}`,
      );
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.message || error.response.data.error,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Downlink</h2>

      <form>
        <div className="mb-3">
          <label className="form-label">Downlink</label>

          <input
            type="text"
            className="form-control"
            name="downlink"
            value={state.downlinkData.downlink}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Decoded String</label>

          <input
            type="text"
            className="form-control"
            name="decodedString"
            value={state.downlinkData.decodedString}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hexadecimal</label>

          <input
            type="text"
            className="form-control"
            name="hexadecimal"
            value={state.downlinkData.hexadecimal}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Uplink</label>

          <input
            type="text"
            className="form-control"
            name="uplink"
            value={state.downlinkData.uplink}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Additional Info</label>

          <input
            type="text"
            className="form-control"
            name="additionalInfo"
            value={state.downlinkData.additionalInfo}
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
            "Add"
          )}
        </Link>
      </form>
    </div>
  );
};
export default NewDownlink;
