import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { CChartBar, CChartDoughnut } from "@coreui/react-chartjs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SiteSelect from "../../../components/SiteSelect";

const useAdminRoute = () => {
  const role = useSelector((s) => s.userInfo)?.role;
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  if (role === "Master User") return "master-user";
  if (role === "Service User") return "service-user";
  if (role === "Project User") return "project-user";
  return "master-admin";
};

const monthStart = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
};

const MaterialConsumption = () => {
  const adminroute = useAdminRoute();
  const [siteId, setSiteId] = useState("");
  const [startDate, setStartDate] = useState(monthStart);
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) {
      toast.error("Select start and end date");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/v1/faulty-inventory/material-consumption`,
        {
          start_date: startDate,
          end_date: endDate,
          site_id: siteId || "all",
        },
        { withCredentials: true },
      );
      setData(res.data.data || null);
    } catch (err) {
      setData(null);
      toast.error(
        err.response?.data?.message || "Failed to fetch consumption",
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, siteId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const byItem = useMemo(() => {
    const map = {};
    for (const row of data?.summary || []) {
      const key = row.item_name || "Unknown";
      map[key] = (map[key] || 0) + Number(row.quantity || 0);
    }
    return Object.entries(map)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [data]);

  const bySite = useMemo(() => {
    const map = {};
    for (const row of data?.summary || []) {
      const key = row.site_id || "Unknown";
      map[key] = (map[key] || 0) + Number(row.quantity || 0);
    }
    return Object.entries(map)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [data]);

  const exportExcel = () => {
    if (!data?.lines?.length && !data?.summary?.length) {
      toast.error("No data to export");
      return;
    }

    const summaryRows = (data.summary || []).map((r, i) => ({
      SR: i + 1,
      Site: r.site_id,
      Item: r.item_name,
      Code: r.item_code,
      Quantity: r.quantity,
      Entries: r.entries,
    }));

    const lineRows = (data.lines || []).map((r, i) => ({
      SR: i + 1,
      Date: r.consumed_at
        ? new Date(r.consumed_at).toLocaleString("en-GB")
        : "",
      Site: r.site_id,
      Ticket: r.ticket_id,
      Robot: r.robot_no || "",
      Item: r.item_name,
      Code: r.item_code || "",
      Quantity: r.quantity,
      By: r.consumed_by?.name || "",
      Source: r.source || "",
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(summaryRows),
      "Summary",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(lineRows),
      "Line Items",
    );
    XLSX.writeFile(
      wb,
      `material_consumption_${startDate}_to_${endDate}.xlsx`,
    );
  };

  const backfill = async () => {
    try {
      const res = await axios.post(
        `/api/v1/faulty-inventory/material-consumption/backfill`,
        {},
        { withCredentials: true },
      );
      toast.success(
        `Backfill done — inserted ${res.data.data?.inserted || 0}, skipped ${res.data.data?.skipped || 0}`,
      );
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Backfill failed");
    }
  };

  const chartColors = [
    "#38bdf8",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#fb923c",
    "#2dd4bf",
    "#e879f9",
  ];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h4 className="mb-0">Material Consumption</h4>
          <p className="small text-medium-emphasis mb-0">
            Parts consumed on service tickets — graph, table, and export
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={`/${adminroute}/inventory-hub`}
          >
            Inventory Hub
          </Link>
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={`/${adminroute}/faulty-inventory`}
          >
            Faulty Inventory
          </Link>
        </div>
      </div>

      <CCard className="mb-3">
        <CCardBody className="py-3">
          <CRow className="g-2 align-items-end">
            <CCol md={3} xs={12}>
              <label className="form-label small mb-1">Site</label>
              <SiteSelect
                value={siteId}
                onChange={setSiteId}
                width="100%"
                placeholder="Search site…"
              />
            </CCol>
            <CCol md={2} xs={6}>
              <label className="form-label small mb-1">From</label>
              <CFormInput
                type="date"
                size="sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={2} xs={6}>
              <label className="form-label small mb-1">To</label>
              <CFormInput
                type="date"
                size="sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
            <CCol md={5} xs={12} className="d-flex gap-2 flex-wrap">
              <CButton color="primary" size="sm" onClick={fetchData}>
                Load
              </CButton>
              <CButton color="success" size="sm" onClick={exportExcel}>
                Export Excel
              </CButton>
              <CButton
                color="secondary"
                size="sm"
                variant="outline"
                onClick={backfill}
              >
                Backfill from tickets
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {loading ? (
        <LoadingSpinner />
      ) : !data ? (
        <div className="text-medium-emphasis">No data loaded.</div>
      ) : (
        <>
          <CRow className="g-3 mb-3">
            <CCol xs={6} md={3}>
              <CCard className="text-center">
                <CCardBody className="py-2">
                  <div className="small text-medium-emphasis">Total qty</div>
                  <div className="fs-5 fw-semibold">
                    {data.totals?.quantity || 0}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6} md={3}>
              <CCard className="text-center">
                <CCardBody className="py-2">
                  <div className="small text-medium-emphasis">Entries</div>
                  <div className="fs-5 fw-semibold">
                    {data.totals?.entries || 0}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6} md={3}>
              <CCard className="text-center">
                <CCardBody className="py-2">
                  <div className="small text-medium-emphasis">Items</div>
                  <div className="fs-5 fw-semibold">{byItem.length}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6} md={3}>
              <CCard className="text-center">
                <CCardBody className="py-2">
                  <div className="small text-medium-emphasis">Sites</div>
                  <div className="fs-5 fw-semibold">{bySite.length}</div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow className="g-3 mb-3">
            <CCol xs={12} lg={7}>
              <CCard className="h-100">
                <CCardHeader>
                  <strong>Consumption by item</strong>
                </CCardHeader>
                <CCardBody>
                  {byItem.length ? (
                    <div style={{ height: 320, position: "relative" }}>
                      <CChartBar
                        style={{ height: "100%" }}
                        data={{
                          labels: byItem.slice(0, 12).map((r) => r.name),
                          datasets: [
                            {
                              label: "Qty consumed",
                              backgroundColor: "#38bdf8",
                              data: byItem.slice(0, 12).map((r) => r.quantity),
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: {
                              ticks: { display: false },
                              grid: { display: false },
                            },
                            y: { beginAtZero: true },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-medium-emphasis text-center py-4">
                      No chart data
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} lg={5}>
              <CCard className="h-100">
                <CCardHeader>
                  <strong>Consumption by site</strong>
                </CCardHeader>
                <CCardBody>
                  {bySite.length ? (
                    <div style={{ height: 320, position: "relative" }}>
                      <CChartDoughnut
                        style={{ height: "100%" }}
                        data={{
                          labels: bySite.map((r) => r.name),
                          datasets: [
                            {
                              backgroundColor: bySite.map(
                                (_, i) => chartColors[i % chartColors.length],
                              ),
                              data: bySite.map((r) => r.quantity),
                              borderWidth: 0,
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                          cutout: "45%",
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: true },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-medium-emphasis text-center py-4">
                      No chart data
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CCard className="mb-3">
            <CCardHeader>
              <strong>Summary by site / item</strong>
            </CCardHeader>
            <CCardBody>
              <CTable
                bordered
                hover
                responsive
                className="mb-0 align-middle text-center"
              >
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">
                      Site
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-start">
                      Item
                    </CTableHeaderCell>
                    <CTableHeaderCell>Code</CTableHeaderCell>
                    <CTableHeaderCell>Qty</CTableHeaderCell>
                    <CTableHeaderCell>Entries</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.summary?.length ? (
                    data.summary.map((row, i) => (
                      <CTableRow key={`${row.site_id}-${row.item_id}-${i}`}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell className="text-start">
                          {row.site_id}
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          {row.item_name}
                        </CTableDataCell>
                        <CTableDataCell>{row.item_code}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="warning">{row.quantity}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{row.entries}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6}>
                        No consumption in this range.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          <CCard className="mb-3">
            <CCardHeader>
              <strong>Line items (max 500)</strong>
            </CCardHeader>
            <CCardBody>
              <CTable
                bordered
                hover
                responsive
                className="mb-0 align-middle text-center"
              >
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Ticket</CTableHeaderCell>
                    <CTableHeaderCell>Robot</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">
                      Item
                    </CTableHeaderCell>
                    <CTableHeaderCell>Qty</CTableHeaderCell>
                    <CTableHeaderCell>By</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.lines?.length ? (
                    data.lines.map((row, i) => (
                      <CTableRow key={row._id || i}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>
                          {row.consumed_at
                            ? new Date(row.consumed_at).toLocaleString("en-GB")
                            : "—"}
                        </CTableDataCell>
                        <CTableDataCell>{row.site_id}</CTableDataCell>
                        <CTableDataCell>{row.ticket_id}</CTableDataCell>
                        <CTableDataCell>{row.robot_no || "—"}</CTableDataCell>
                        <CTableDataCell className="text-start">
                          {row.item_name}
                          {row.item_code ? ` (${row.item_code})` : ""}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="warning">{row.quantity}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {row.consumed_by?.name || "—"}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={8}>No line items.</CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  );
};

export default MaterialConsumption;
