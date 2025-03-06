import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UpdateDownlink = () => {
  const { site_id, block, robot_no, id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);

  const navigate = useNavigate();

  const [downlinkData, setDownlinkData] = useState({});

  useEffect(() => {
    const fetchDownlink = async () => {
      try {
        const { data } = await axios.get(`/api/v1/downlinks/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        setDownlinkData(data.data);
      } catch (error) {
        toast.error("Failed to fetch downlink details");
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
    e.preventDefault();
    try {
      const { createdAt, _id, last_activity, ...filteredFormData } =
        downlinkData;

      await axios.put(`/api/v1/downlinks/${id}`, filteredFormData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      toast.success("Downlink updated successfully");

      navigate(
        `/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}`
      );
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Downlink</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Downlink</label>

          <input
            type="text"
            className="form-control"
            name="downlink"
            value={downlinkData.downlink}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Decoded String</label>

          <input
            type="text"
            className="form-control"
            name="decodedString"
            value={downlinkData.decodedString}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hexadecimal</label>

          <input
            type="text"
            className="form-control"
            name="hexadecimal"
            value={downlinkData.hexadecimal}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Uplink</label>

          <input
            type="text"
            className="form-control"
            name="uplink"
            value={downlinkData.uplink}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Additional Info</label>

          <input
            type="text"
            className="form-control"
            name="additionalInfo"
            value={downlinkData.additionalInfo}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-warning">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateDownlink;
