import axios from "axios";
import toast from "react-hot-toast";

/**
 * 🔹 Delete MDS Device from LNS Server
 */
export const deleteMdsFromLns = async (mds_no, deveui, reason) => {
  if (!reason || reason.trim() === "") {
    toast.error("Please provide a reason for deletion.");
    return false;
  }

  try {
    const response = await axios.delete(
      `/api/v1/mds-device/delete-from-lns/${deveui}`,
      {
        headers: {
          // Authorization: `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: { reason, mds_no },
      },
    );

    toast.success(
      response.data?.message ||
        `✅ MDS ${mds_no} deleted from LNS successfully.`,
    );
    return true;
  } catch (error) {
    console.error("Error deleting MDS from LNS:", error);
    toast.error(
      error.response?.data?.message ||
        `❌ Failed to delete MDS ${mds_no} from LNS.`,
    );
    return false;
  }
};

/**
 * 🔹 Delete MDS Device from Database
 */
export const deleteMdsFromDatabase = async (mds_no, reason) => {
  if (!reason || reason.trim() === "") {
    toast.error("Please provide a reason for deletion.");
    return false;
  }

  try {
    const response = await axios.delete(
      `/api/v1/mds-device/delete-mds/${mds_no}`,
      {
        headers: {
          // Authorization: `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: { reason },
      },
    );

    toast.success(
      response.data?.message ||
        `✅ MDS ${mds_no} deleted from Database successfully.`,
    );
    return true;
  } catch (error) {
    console.error("Error deleting MDS from Database:", error);
    toast.error(
      error.response?.data?.message ||
        `❌ Failed to delete MDS ${mds_no} from Database.`,
    );
    return false;
  }
};
