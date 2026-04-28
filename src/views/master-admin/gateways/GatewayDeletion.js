import axios from "axios";
import toast from "react-hot-toast";

// ✅ Delete Gateway from LNS server
export const deleteGatewayFromLns = async (gateway_id, reason) => {
  if (!reason || reason.trim() === "") {
    toast.error("Reason is required.");
    return;
  }

  try {
    const res = await axios.delete(
      `/api/v1/gateways/delete-lns/${gateway_id}`,
      {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
        data: { reason },
      },
    );

    toast.success(
      res.data.message || `Gateway ${gateway_id} deleted from LNS.`,
    );
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting from LNS.");
  }
};

// ✅ Delete Gateway from Database
export const deleteGatewayFromDatabase = async (gateway_id, reason) => {
  if (!reason || reason.trim() === "") {
    toast.error("Reason is required.");
    return;
  }

  try {
    const res = await axios.delete(
      `/api/v1/gateways/delete/${gateway_id}`, // ✅ corrected endpoint
      {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
        data: { reason },
      },
    );

    toast.success(
      res.data.message || `Gateway ${gateway_id} deleted from Database.`,
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error deleting from Database.",
    );
  }
};
