import axios from "axios";
import toast from "react-hot-toast";

// 🔹 Delete from LNS server
export const deleteMdsFromLns = async (mds_id, deveui, authtoken, reason) => {
  try {
    const res = await axios.delete(
      `/api/v1/mds-device/delete-from-lns/${deveui}`,
      {
        headers: { Authorization: `Bearer ${authtoken}` },
        data: { reason, mds_id },
      }
    );

    toast.success(res.data.message || `MDS ${mds_id} deleted from LNS.`);
    return true;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error deleting MDS from LNS."
    );
    return false;
  }
};

// 🔹 Delete from Database
export const deleteMdsFromDatabase = async (mds_id, authtoken, reason) => {
  try {
    const res = await axios.delete(`/api/v1/mds-device/delete-mds/${mds_id}`, {
      headers: { Authorization: `Bearer ${authtoken}` },
      data: { reason },
    });

    toast.success(res.data.message || `MDS ${mds_id} deleted from Database.`);
    return true;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error deleting MDS from Database."
    );
    return false;
  }
};
