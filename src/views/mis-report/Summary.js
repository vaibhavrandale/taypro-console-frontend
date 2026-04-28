import React, { useEffect, useReducer } from "react";
import {
  CTab,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabList,
  CTabPanel,
  CTabs,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, misreports: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const Summary = () => {
  // const authtoken = useSelector((state) => state.authtoken);
  const [{ loading, misreports, error }, dispatch] = useReducer(reducer, {
    misreports: [],
    loading: false,
    error: "",
  });
  // ---------- Fetch MIS Data ----------
  const fetchMisReports = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const result = await axios.get(`/api/v1/mis-report-router`, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      const data = result.data.data[0];
      console.log(result.data.data);

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: err.response?.data?.error || err.response?.data?.message,
      });
    }
  };
  useEffect(() => {
    fetchMisReports();
  }, []);

  const renderDepartmentTable = (deptData) => {
    if (!deptData) return <p>No data available.</p>;

    const entries = Object.entries(deptData).filter(
      ([key]) =>
        ![
          "achievements",
          "issues",
          "action_plan",
          "is_filled",
          "is_filled_at",
          "last_activity",
        ].includes(key),
    );

    return (
      <CTable bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Particulars</CTableHeaderCell>
            <CTableHeaderCell>Current Month</CTableHeaderCell>
            <CTableHeaderCell>FYTD</CTableHeaderCell>
            <CTableHeaderCell>Remarks</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {entries.map(([key, value]) => (
            <CTableRow key={key}>
              <CTableDataCell className="text-capitalize">
                {key.replace(/_/g, " ")}
              </CTableDataCell>
              <CTableDataCell>{value.current_month ?? "-"}</CTableDataCell>
              <CTableDataCell>{value.fy_td ?? "-"}</CTableDataCell>
              <CTableDataCell>{value.Remarks ?? "-"}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    );
  };
  return (
    <div className="p-3">
      {loading && <p>Loading data...</p>}
      {error && <p className="text-danger">{error}</p>}

      <CTabs defaultActiveItemKey="summary">
        <CTabList variant="enclosed" className="flex-wrap">
          <CTab itemKey="summary">Summary</CTab>
          <CTab itemKey="sales">Sales</CTab>
          <CTab itemKey="production">Production</CTab>
          <CTab itemKey="quality">Quality</CTab>
          <CTab itemKey="project">Projects</CTab>
          <CTab itemKey="service">Service</CTab>
          <CTab itemKey="supply_chain">Supply Chain & Logistics</CTab>
          <CTab itemKey="rnd">R&D & Product Development</CTab>
          <CTab itemKey="accounts">Accounts</CTab>
          <CTab itemKey="hr_admin">HR & Admin</CTab>
        </CTabList>

        <CTabContent>
          <CTabPanel className="p-3" itemKey="summary">
            <h5 className="mb-3 text-success fw-bold">Summary</h5>

            <CTable bordered hover responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Metric</CTableHeaderCell>
                  <CTableHeaderCell>Current Month</CTableHeaderCell>
                  <CTableHeaderCell>FYTD</CTableHeaderCell>
                  <CTableHeaderCell>Remarks</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                <CTableRow>
                  <CTableDataCell>Revenue from Capex</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.revenue_from_capex?.current_month ??
                      "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.revenue_from_capex?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.revenue_from_capex?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Revenue from Opex</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.revenue_from_opex?.current_month ??
                      "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.revenue_from_opex?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.revenue_from_opex?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Total Revenue</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.total_revenue?.current_month ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.total_revenue?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.total_revenue?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Gross Margin (%)</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.gross_margin?.current_month ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.gross_margin?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.gross_margin?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Net Profit / (Loss)</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.net_profit_loss?.current_month ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.net_profit_loss?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.net_profit_loss?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Total Orders Received</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.total_orders_received
                      ?.current_month ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.total_orders_received?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Summary?.total_orders_received?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Total Robots Manufactured</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Production_and_operations?.units_manufactures
                      ?.current_month ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Production_and_operations?.units_manufactures
                      ?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Production_and_operations?.units_manufactures
                      ?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Total Robots Installed</CTableDataCell>
                  <CTableDataCell>
                    {(misreports?.Projects?.total_robots_installed_capex
                      ?.current_month ?? 0) +
                      (misreports?.Projects?.total_robots_installed_opex
                        ?.current_month ?? 0)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {(misreports?.Projects?.total_robots_installed_capex
                      ?.fy_td ?? 0) +
                      (misreports?.Projects?.total_robots_installed_opex
                        ?.fy_td ?? 0)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Projects?.total_robots_installed_capex
                      ?.Remarks ??
                      misreports?.Projects?.total_robots_installed_opex
                        ?.Remarks ??
                      "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Customer Complaints</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Service?.total_service_calls_received
                      ?.current_month ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Service?.total_service_calls_received?.fy_td ??
                      "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Service?.total_service_calls_received
                      ?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>Cash Balance</CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.cash_bank_balance?.current_month ??
                      "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.cash_bank_balance?.fy_td ?? "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {misreports?.Accounts?.cash_bank_balance?.Remarks ?? "-"}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="sales">
            {renderDepartmentTable(misreports?.Sales)}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="production">
            {renderDepartmentTable(misreports?.Production_and_operations)}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="quality">
            {renderDepartmentTable(misreports?.Quality)}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="project">
            {renderDepartmentTable(misreports?.Projects)}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="service">
            {renderDepartmentTable(misreports?.Service)}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="supply_chain">
            {renderDepartmentTable(misreports?.Supply_chain_and_logistics)}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="rnd">
            {renderDepartmentTable(
              misreports?.Research_and_development_and_product_development,
            )}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="accounts">
            {renderDepartmentTable(misreports?.Accounts)}
          </CTabPanel>

          <CTabPanel className="p-3" itemKey="hr_admin">
            {renderDepartmentTable(misreports?.Hr_and_admin)}
          </CTabPanel>
        </CTabContent>
      </CTabs>
    </div>
  );
};

export default Summary;
