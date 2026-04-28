import axios from "axios";
import toast from "react-hot-toast";

// 🔹 Delete from LNS server
export const deleteRobotFromLns = async (robot_no, deveui, reason) => {
  try {
    const res = await axios.delete(`/api/v1/robots/delete-lns/${deveui}`, {
      // headers: { Authorization: `Bearer ${authtoken}` },
      withCredentials: true,
      data: { reason, robot_no },
    });

    toast.success(res.data.message || `Robot ${robot_no} deleted from LNS.`);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting from LNS.");
    return false;
  }
};

// 🔹 Delete from Database
export const deleteRobotFromDatabase = async (robot_no, reason) => {
  try {
    const res = await axios.delete(`/api/v1/robots/delete/${robot_no}`, {
      // headers: { Authorization: `Bearer ${authtoken}` },
      withCredentials: true,
      data: { reason },
    });

    toast.success(
      res.data.message || `Robot ${robot_no} deleted from Database.`,
    );
    return true;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error deleting from Database.",
    );
    return false;
  }
};
