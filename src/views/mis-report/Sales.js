import React, { useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import LastActivity from "../../components/LastActivity";
import SalesModal from "./SalesModal";
import axios from "axios";
import toast from "react-hot-toast";
function reducer(state, action) {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, loading: true, success: null, error: null };
    case "REQUEST_SUCCESS":
      return { ...state, loading: false, success: action.payload, error: null };
    case "REQUEST_ERROR":
      return { ...state, loading: false, error: action.payload, success: null };

    default:
      return state;
  }
}
export default function Sales({
  data,
  last_activity,
  createdAt,
  updatedAt,
  _id,
  authtoken,
  refreshReports,
}) {
  const [{ loading, success, error }, dispatch] = useReducer(reducer, {
    loading: false,
    success: null,
    error: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [salesData, setSalesData] = useState(data);

  const handleSave = async (updatedData) => {
    dispatch({ type: "REQUEST_START" });

    try {
      // 🔥 Exclude non-updatable fields like last_activity
      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([key]) => !["last_activity"].includes(key)
        )
      );

      // Format updates for backend
      const updates = Object.entries(filteredData)
        .filter(([key, val]) => val && typeof val === "object")
        .map(([field, val]) => ({
          field,
          data: {
            current_month: Number(val.current_month) || 0,
            fy_td: Number(val.fy_td) || 0,
            Remarks: val.Remarks || null,
          },
        }));

      ["achievements", "issues", "action_plan"].forEach((f) => {
        if (filteredData[f]) updates.push({ field: f, data: filteredData[f] });
      });

      const payload = {
        department: "Sales",
        updates,
        is_filled: updatedData.is_filled ?? false,
      };

      const response = await axios.put(
        `/api/v1/mis-report-router/${_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      setSalesData(updatedData);
      dispatch({ type: "REQUEST_SUCCESS", payload: response.data.message });
      toast.success(response.data.message);
      setModalVisible(false);
      // 🔥 Refresh parent data after update
      if (refreshReports) refreshReports();
    } catch (err) {
      dispatch({
        type: "REQUEST_ERROR",
        payload: err.response?.data?.message || err.response?.data?.error,
      });
      toast.error(err.response?.data?.message || err.response?.data?.error);
    }
  };

  const metrics = [
    { key: "leads_generated", Remarks: data.Remarks, label: "Leads Generated" },
    { key: "quotations_sent", Remarks: data.Remarks, label: "Quotations Sent" },
    {
      key: "purchase_orders_received",
      Remarks: data.Remarks,
      label: "POs Received",
    },
    { key: "booking_amount", Remarks: data.Remarks, label: "Booking Amount" },
    {
      key: "new_customer_orders",
      Remarks: data.Remarks,
      label: "New Customer Orders",
    },
    {
      key: "existing_customer_orders",
      Remarks: data.Remarks,
      label: "Existing Customer Orders",
    },
    {
      key: "average_order_value",
      Remarks: data.Remarks,
      label: "Average Order Value",
    },
    { key: "conversion_rate", Remarks: data.Remarks, label: "Conversion Rate" },
    {
      key: "marketing_expenses",
      Remarks: data.Remarks,
      label: "Marketing Expenses",
    },
    {
      key: "total_sales_executives",
      Remarks: data.Remarks,
      label: "Sales Executives",
    },
    {
      key: "total_sales_managers",
      Remarks: data.Remarks,
      label: "Sales Managers",
    },
    { key: "total_poc_given", Remarks: data.Remarks, label: "POC Given" },
    { key: "ongoing_poc", Remarks: data.Remarks, label: "Ongoing POC" },
    { key: "pending_poc", Remarks: data.Remarks, label: "Pending POC" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <CCard className="my-2 rounded-3xl shadow-xl bg-gray-950 border border-gray-800 text-gray-100">
        {/* Header */}
        <CCardHeader className=" d-flex justify-content-between align-items-center">
          <div>
            Sales Department -{" "}
            <span className="text-success">
              {new Date(createdAt).toLocaleDateString("en-GB", {
                month: "long", // 👉 gives full month name
                year: "numeric",
              })}
            </span>
            <span className="text-success">
              {data.is_filled
                ? ` | Filled on: ${new Date(
                    data.is_filled_at
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`
                : " | Not yet filled"}
            </span>
          </div>
          <CButton
            onClick={() => setModalVisible(true)}
            color="success"
            size="sm"
          >
            Edit Sales
          </CButton>
        </CCardHeader>

        {/* Existing Sales UI here — use `salesData` instead of `data` */}

        <SalesModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          data={salesData}
          onSave={handleSave}
          loading={loading}
          success={success}
          error={error}
        />
        {/* Body */}
        <CCardBody className="p-6">
          {/* Metrics */}
          <CRow className="gy-4">
            {metrics.map((m) => (
              <CCol key={m.key} xs={12} sm={5} md={3}>
                <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 hover:border-indigo-500/40 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 font-semibold">
                      {m.label}
                    </span>
                    <TrendingUp size={18} className="text-indigo-400" />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    {" "}
                    <div className="text-2xl font-bold text-amber-400">
                      C. month: {data[m.key]?.current_month ?? 0}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      FYTD:{" "}
                      <span className="text-gray-200 font-semibold">
                        {data[m.key]?.fy_td ?? 0}
                      </span>
                    </div>
                  </div>
                  {data[m.key]?.Remarks && (
                    <div className="text-justify pt-2">
                      <span className="text-success">Remarks: </span>{" "}
                      <span className=""> {data[m.key]?.Remarks}</span>
                    </div>
                  )}
                </div>
              </CCol>
            ))}
          </CRow>
          <LastActivity lastactivity={data.last_activity} />
        </CCardBody>
      </CCard>
    </motion.div>
  );
}
