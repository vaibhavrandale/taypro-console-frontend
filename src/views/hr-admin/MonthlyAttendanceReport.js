import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import PaginateInput from "../../components/PaginateInput";
import HRUserSelect from "../../components/HRUserSelect";

const API_BASE = "/api/v1/hr/attendance";

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const yearOptions = Array.from({ length: 6 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return { value: year, label: String(year) };
});

const LOCATION_LABELS = {
  office: "Office",
  factory: "Factory",
  wfh: "WFH",
};

const LOCATION_BADGE_COLORS = {
  office: "info",
  factory: "warning",
  wfh: "success",
};

const formatYmd = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthBoundaryDates = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return {
    start_date: formatYmd(start),
    end_date: formatYmd(end),
  };
};

const formatDisplayDate = (ymd) => {
  if (!ymd) return "-";
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const matchesSearch = (row, query) => {
  if (!query) return true;
  const text = query.toLowerCase();
  return [row.username, row.email, row.employee_id]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(text));
};

const StatCard = ({ label, value, hint, accent }) => (
  <CCol sm={6} xl={3}>
    <div
      className="h-100 p-3 rounded-3 border"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="text-muted small mb-1">{label}</div>
      <div className="fs-4 fw-semibold" style={{ color: accent || "#fff" }}>
        {value}
      </div>
      {hint && <div className="text-muted small mt-1">{hint}</div>}
    </div>
  </CCol>
);

const MonthlyAttendanceReport = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentMonthBounds = getMonthBoundaryDates(currentMonth, currentYear);

  const [rangeMode, setRangeMode] = useState("month");
  const [filters, setFilters] = useState({
    month: currentMonth,
    year: currentYear,
    start_date: currentMonthBounds.start_date,
    end_date: currentMonthBounds.end_date,
  });
  const [loading, setLoading] = useState(false);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [summarySearch, setSummarySearch] = useState("");
  const [summaryPage, setSummaryPage] = useState(1);
  const [summaryLimit, setSummaryLimit] = useState(20);
  const [summaryPageInput, setSummaryPageInput] = useState("");
  const [showActiveDaysOnly, setShowActiveDaysOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState("all");

  const filteredSummary = useMemo(() => {
    if (!reportData?.summary) return [];
    return reportData.summary.filter((row) => {
      const matchesLocation =
        locationFilter === "all" || row.location === locationFilter;
      return matchesLocation && matchesSearch(row, summarySearch.trim());
    });
  }, [reportData, summarySearch, locationFilter]);

  const filteredUsers = useMemo(() => {
    if (!reportData?.users) return [];
    if (locationFilter === "all") return reportData.users;
    return reportData.users.filter((user) => user.location === locationFilter);
  }, [reportData, locationFilter]);

  const summaryStats = useMemo(() => {
    if (!reportData?.summary?.length) {
      return {
        employees: 0,
        presentDays: 0,
        workingDays: 0,
        activeEmployees: 0,
      };
    }

    return filteredSummary.reduce(
      (acc, row) => ({
        employees: acc.employees + 1,
        presentDays: acc.presentDays + Number(row.total_present_days || 0),
        workingDays: acc.workingDays + Number(row.total_working_days || 0),
        activeEmployees:
          acc.activeEmployees + (Number(row.total_present_days || 0) > 0 ? 1 : 0),
      }),
      { employees: 0, presentDays: 0, workingDays: 0, activeEmployees: 0 },
    );
  }, [filteredSummary]);

  const summaryTotalPages = Math.max(
    1,
    Math.ceil(filteredSummary.length / summaryLimit),
  );

  const paginatedSummary = useMemo(() => {
    const start = (summaryPage - 1) * summaryLimit;
    return filteredSummary.slice(start, start + summaryLimit);
  }, [filteredSummary, summaryPage, summaryLimit]);

  const visibleDailyRows = useMemo(() => {
    if (!selectedUserDetail?.daily_rows) return [];
    if (!showActiveDaysOnly) return selectedUserDetail.daily_rows;
    return selectedUserDetail.daily_rows.filter(
      (row) => row.present_day === "Yes" || row.entry_count > 0,
    );
  }, [selectedUserDetail, showActiveDaysOnly]);

  const effectivePeriod = useMemo(() => {
    if (rangeMode === "month") {
      return getMonthBoundaryDates(filters.month, filters.year);
    }

    return {
      start_date: filters.start_date,
      end_date: filters.end_date,
    };
  }, [
    rangeMode,
    filters.month,
    filters.year,
    filters.start_date,
    filters.end_date,
  ]);

  const buildReportPayload = useCallback(
    (extra = {}) => {
      if (rangeMode === "custom") {
        return {
          start_date: filters.start_date,
          end_date: filters.end_date,
          ...extra,
        };
      }

      return {
        month: Number(filters.month),
        year: Number(filters.year),
        ...extra,
      };
    },
    [
      rangeMode,
      filters.month,
      filters.year,
      filters.start_date,
      filters.end_date,
    ],
  );

  const fetchUserDetail = useCallback(
    async (userId) => {
      if (!userId) {
        setSelectedUserDetail(null);
        return;
      }

      try {
        setLoadingUserDetail(true);
        const result = await axios.post(
          `${API_BASE}/reports/monthly/user`,
          buildReportPayload({ user_id: userId }),
          { withCredentials: true },
        );

        setSelectedUserDetail(result.data.data.user);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to load employee day-wise data",
        );
        setSelectedUserDetail(null);
      } finally {
        setLoadingUserDetail(false);
      }
    },
    [buildReportPayload],
  );

  useEffect(() => {
    if (!selectedUserId || !reportData) {
      setSelectedUserDetail(null);
      return;
    }

    fetchUserDetail(selectedUserId);
  }, [selectedUserId, reportData, fetchUserDetail]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setSelectedUserId("");
      setSelectedUserDetail(null);
      setShowActiveDaysOnly(false);

      const result = await axios.post(
        `${API_BASE}/reports/monthly`,
        buildReportPayload(),
        { withCredentials: true },
      );

      const data = result.data.data;
      setReportData(data);
      setSummarySearch("");
      setSummaryPage(1);
      setLocationFilter("all");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load monthly report");
      setReportData(null);
      setSelectedUserId("");
      setSelectedUserDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.loading("Preparing monthly report...", { id: "monthly-report-export" });

      const response = await axios.post(
        `${API_BASE}/export/monthly-report`,
        buildReportPayload(),
        {
          withCredentials: true,
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const monthLabel = monthOptions.find(
        (item) => item.value === Number(filters.month),
      )?.label;

      link.href = url;
      link.download =
        rangeMode === "custom"
          ? `Taypro_HR_Attendance_${effectivePeriod.start_date}_to_${effectivePeriod.end_date}.xlsx`
          : `Taypro_HR_Attendance_${monthLabel}_${filters.year}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Monthly report downloaded", { id: "monthly-report-export" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to export monthly report",
        { id: "monthly-report-export" },
      );
    } finally {
      setExporting(false);
    }
  };

  const handleSummarySearchChange = (value) => {
    setSummarySearch(value);
    setSummaryPage(1);
  };

  const handleLocationFilterChange = (value) => {
    setLocationFilter(value);
    setSummaryPage(1);

    if (!selectedUserId || !reportData) return;

    const stillVisible = reportData.summary.some(
      (row) =>
        String(row.user_id) === selectedUserId &&
        (value === "all" || row.location === value),
    );

    if (!stillVisible) {
      setSelectedUserId("");
    }
  };

  const handleSummaryPageChange = (nextPage) => {
    if (nextPage >= 1 && nextPage <= summaryTotalPages) {
      setSummaryPage(nextPage);
    }
  };

  const handleSummaryPageInputSubmit = (event) => {
    event.preventDefault();
    const nextPage = Number(summaryPageInput);
    if (nextPage >= 1 && nextPage <= summaryTotalPages) {
      setSummaryPage(nextPage);
    }
    setSummaryPageInput("");
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(String(userId));
    document.getElementById("user-daywise-details")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const setCurrentMonth = () => {
    const current = new Date();
    const month = current.getMonth() + 1;
    const year = current.getFullYear();
    const bounds = getMonthBoundaryDates(month, year);

    setRangeMode("month");
    setFilters({
      month,
      year,
      start_date: bounds.start_date,
      end_date: bounds.end_date,
    });
  };

  const handleRangeModeChange = (mode) => {
    if (mode === "custom") {
      const bounds =
        rangeMode === "month"
          ? getMonthBoundaryDates(filters.month, filters.year)
          : effectivePeriod;

      setFilters((current) => ({
        ...current,
        start_date: bounds.start_date,
        end_date: bounds.end_date,
      }));
    }

    setRangeMode(mode);
  };

  const selectedPeriodLabel = monthOptions.find(
    (item) => item.value === Number(filters.month),
  )?.label;

  const displayedPeriodLabel = reportData
    ? reportData.month_label
    : rangeMode === "month"
      ? `${selectedPeriodLabel} ${filters.year}`
      : `${formatDisplayDate(effectivePeriod.start_date)} – ${formatDisplayDate(effectivePeriod.end_date)}`;

  return (
    <div className="container-fluid py-3">
      <div
        className="rounded-4 p-4 mb-4 border"
        style={{
          background:
            "linear-gradient(135deg, rgba(17,28,68,0.95) 0%, rgba(22,33,62,0.9) 100%)",
          borderColor: "rgba(0,212,255,0.15)",
        }}
      >
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <h4 className="mb-0">Monthly Attendance Report</h4>
              {reportData && (
                <CBadge color="info" className="px-3 py-2">
                  {reportData.month_label}
                </CBadge>
              )}
            </div>
            <p className="text-muted mb-0 small">
              Review attendance summary for all employees by month or custom date
              range, then open one employee to see day-wise IN/OUT and working
              hours.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <CButton
              color="light"
              variant="outline"
              size="sm"
              onClick={setCurrentMonth}
            >
              This Month
            </CButton>
            <CButton
              color="success"
              size="sm"
              onClick={handleExport}
              disabled={exporting || !reportData}
            >
              {exporting ? "Exporting..." : "Export Excel"}
            </CButton>
          </div>
        </div>

        <CRow className="g-3 mt-2 align-items-end">
          <CCol xs={12}>
            <div className="d-flex gap-2 flex-wrap">
              <CButton
                color={rangeMode === "month" ? "primary" : "light"}
                variant={rangeMode === "month" ? undefined : "outline"}
                size="sm"
                onClick={() => handleRangeModeChange("month")}
              >
                Month & Year
              </CButton>
              <CButton
                color={rangeMode === "custom" ? "primary" : "light"}
                variant={rangeMode === "custom" ? undefined : "outline"}
                size="sm"
                onClick={() => handleRangeModeChange("custom")}
              >
                Custom Range
              </CButton>
            </div>
          </CCol>

          {rangeMode === "month" ? (
            <>
              <CCol md={3} sm={6}>
                <CFormLabel htmlFor="report_month" className="small text-muted">
                  Month
                </CFormLabel>
                <CFormSelect
                  id="report_month"
                  value={filters.month}
                  onChange={(e) =>
                    setFilters({ ...filters, month: Number(e.target.value) })
                  }
                >
                  {monthOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2} sm={6}>
                <CFormLabel htmlFor="report_year" className="small text-muted">
                  Year
                </CFormLabel>
                <CFormSelect
                  id="report_year"
                  value={filters.year}
                  onChange={(e) =>
                    setFilters({ ...filters, year: Number(e.target.value) })
                  }
                >
                  {yearOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </>
          ) : (
            <>
              <CCol md={3} sm={6}>
                <CFormLabel htmlFor="report_start_date" className="small text-muted">
                  Start Date
                </CFormLabel>
                <CFormInput
                  id="report_start_date"
                  type="date"
                  value={filters.start_date}
                  onChange={(e) =>
                    setFilters({ ...filters, start_date: e.target.value })
                  }
                />
              </CCol>
              <CCol md={3} sm={6}>
                <CFormLabel htmlFor="report_end_date" className="small text-muted">
                  End Date
                </CFormLabel>
                <CFormInput
                  id="report_end_date"
                  type="date"
                  value={filters.end_date}
                  min={filters.start_date}
                  onChange={(e) =>
                    setFilters({ ...filters, end_date: e.target.value })
                  }
                />
              </CCol>
            </>
          )}

          <CCol md={3} sm={6}>
            <CFormLabel className="small text-muted">Report Period</CFormLabel>
            <div className="small text-white border rounded-3 px-3 py-2">
              {formatDisplayDate(effectivePeriod.start_date)} –{" "}
              {formatDisplayDate(effectivePeriod.end_date)}
            </div>
          </CCol>

          <CCol md="auto">
            <CButton color="primary" onClick={fetchReport} disabled={loading}>
              {loading ? "Loading..." : "Load Report"}
            </CButton>
          </CCol>
          <CCol md="auto" className="ms-md-auto">
            <div className="small text-muted">
              Selected period:{" "}
              <span className="text-white">{displayedPeriodLabel}</span>
            </div>
            {reportData?.start_date && reportData?.end_date && (
              <div className="small text-muted mt-1">
                Loaded range:{" "}
                <span className="text-white">
                  {formatDisplayDate(reportData.start_date)} –{" "}
                  {formatDisplayDate(reportData.end_date)}
                </span>
              </div>
            )}
          </CCol>
        </CRow>
      </div>

      <CCard className="mb-4 border-0 shadow-sm">
        <CCardBody className="py-3">
          <CRow className="g-3">
            <CCol md={6}>
              <div className="d-flex align-items-start gap-2">
                <CBadge color="warning" className="mt-1">
                  Present
                </CBadge>
                <div className="small text-muted">
                  User checked in on that day, even if punch-out is missing or
                  hours are low.
                </div>
              </div>
            </CCol>
            <CCol md={6}>
              <div className="d-flex align-items-start gap-2">
                <CBadge color="success" className="mt-1">
                  Working
                </CBadge>
                <div className="small text-muted">
                  Daily working hours are 9h 30m or more. This counts for salary
                  processing.
                </div>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {loading && <LoadingSpinner />}

      {!loading && reportData && (
        <>
          <CRow className="g-3 mb-4">
            <StatCard
              label="Total Employees"
              value={summaryStats.employees}
              hint={`${summaryStats.activeEmployees} with attendance`}
              accent="#00d4ff"
            />
            <StatCard
              label="Total Present Days"
              value={summaryStats.presentDays}
              hint="Checked-in days across all staff"
              accent="#f9b115"
            />
            <StatCard
              label="Total Working Days"
              value={summaryStats.workingDays}
              hint="Salary-eligible days (9h 30m+)"
              accent="#2eb85c"
            />
            <StatCard
              label="Filtered Results"
              value={filteredSummary.length}
              hint={`Showing page ${summaryPage} of ${summaryTotalPages}`}
            />
          </CRow>

          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h5 className="mb-1">Location-wise Summary</h5>
                  <div className="text-muted small">
                    Aggregated attendance totals by office, factory, and WFH.
                  </div>
                </div>
              </div>

              <div className="table-responsive rounded-3 border">
                <CTable hover className="mb-0 align-middle">
                  <CTableHead style={{ background: "rgba(255,255,255,0.05)" }}>
                    <CTableRow>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Employees
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Active
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Working Days
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Present Days
                      </CTableHeaderCell>
                      <CTableHeaderCell>Working Hours</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Filter</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {reportData.location_summary?.map((row) => (
                        <CTableRow
                          key={row.location}
                          active={locationFilter === row.location}
                          style={{
                            background:
                              locationFilter === row.location
                                ? "rgba(0,212,255,0.08)"
                                : undefined,
                          }}
                        >
                          <CTableDataCell>
                            <CBadge color={LOCATION_BADGE_COLORS[row.location]}>
                              {row.location_label}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {row.employee_count}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {row.active_employees}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge color="success">{row.total_working_days}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge color="warning">{row.total_present_days}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{row.total_working_hours}</CTableDataCell>
                          <CTableDataCell className="text-end">
                            <CButton
                              color={
                                locationFilter === row.location ? "info" : "primary"
                              }
                              size="sm"
                              variant={
                                locationFilter === row.location ? undefined : "outline"
                              }
                              onClick={() => handleLocationFilterChange(row.location)}
                            >
                              {locationFilter === row.location ? "Selected" : "View"}
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>

          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h5 className="mb-1">Employee Summary</h5>
                  <div className="text-muted small">
                    Click a row or View to open day-wise details below.
                  </div>
                </div>
                <CBadge color="info" className="px-3 py-2">
                  {filteredSummary.length} / {reportData.summary.length} users
                </CBadge>
              </div>

              <CRow className="g-3 mb-3">
                <CCol md={4} lg={3}>
                  <CFormLabel htmlFor="location_filter" className="small text-muted">
                    Location
                  </CFormLabel>
                  <CFormSelect
                    id="location_filter"
                    value={locationFilter}
                    onChange={(e) => handleLocationFilterChange(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    <option value="office">{LOCATION_LABELS.office}</option>
                    <option value="factory">{LOCATION_LABELS.factory}</option>
                    <option value="wfh">{LOCATION_LABELS.wfh}</option>
                  </CFormSelect>
                </CCol>
                <CCol md={5} lg={4}>
                  <CFormLabel htmlFor="summary_search" className="small text-muted">
                    Search Employee
                  </CFormLabel>
                  <CFormInput
                    id="summary_search"
                    placeholder="Name, email, employee ID..."
                    value={summarySearch}
                    onChange={(e) => handleSummarySearchChange(e.target.value)}
                  />
                </CCol>
                {locationFilter !== "all" && (
                  <CCol md="auto" className="d-flex align-items-end">
                    <CButton
                      color="secondary"
                      size="sm"
                      variant="outline"
                      onClick={() => handleLocationFilterChange("all")}
                    >
                      Clear Location Filter
                    </CButton>
                  </CCol>
                )}
              </CRow>

              <div className="table-responsive rounded-3 border">
                <CTable hover className="mb-0 align-middle">
                  <CTableHead
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <CTableRow>
                      <CTableHeaderCell className="text-muted">#</CTableHeaderCell>
                      <CTableHeaderCell>Employee</CTableHeaderCell>
                      <CTableHeaderCell className="d-none d-lg-table-cell">
                        Email
                      </CTableHeaderCell>
                      <CTableHeaderCell>Emp ID</CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Working
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Present
                      </CTableHeaderCell>
                      <CTableHeaderCell>Hours</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {paginatedSummary.length > 0 ? (
                      paginatedSummary.map((row, index) => {
                        const isSelected = String(row.user_id) === selectedUserId;

                        return (
                          <CTableRow
                            key={row.user_id}
                            active={isSelected}
                            style={{
                              cursor: "pointer",
                              background: isSelected
                                ? "rgba(0,212,255,0.08)"
                                : undefined,
                            }}
                            onClick={() => handleViewUser(row.user_id)}
                          >
                            <CTableDataCell className="text-muted">
                              {(summaryPage - 1) * summaryLimit + index + 1}
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="fw-semibold">{row.username}</div>
                              <div className="text-muted small d-lg-none">
                                {row.email}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="d-none d-lg-table-cell">
                              {row.email}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CBadge color="secondary">{row.employee_id}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CBadge color={LOCATION_BADGE_COLORS[row.location] || "secondary"}>
                                {row.location_label || LOCATION_LABELS[row.location] || row.location}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color="success">{row.total_working_days}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color="warning">{row.total_present_days}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>{row.total_working_hours}</CTableDataCell>
                            <CTableDataCell className="text-end">
                              <CButton
                                color={isSelected ? "info" : "primary"}
                                size="sm"
                                variant={isSelected ? undefined : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewUser(row.user_id);
                                }}
                              >
                                {isSelected ? "Selected" : "View"}
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        );
                      })
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={9} className="text-center py-5">
                          <div className="text-muted">No employees found.</div>
                          <div className="small text-muted mt-1">
                            Try a different search term.
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>

              <PaginateInput
                page={summaryPage}
                totalPages={summaryTotalPages}
                hasPrevPage={summaryPage > 1}
                hasNextPage={summaryPage < summaryTotalPages}
                pageInput={summaryPageInput}
                handlePageChange={handleSummaryPageChange}
                handlePageInputChange={(e) => setSummaryPageInput(e.target.value)}
                handlePageInputSubmit={handleSummaryPageInputSubmit}
                limit={summaryLimit}
                handleLimitChange={(e) => {
                  setSummaryLimit(Number(e.target.value));
                  setSummaryPage(1);
                }}
              />
            </CCardBody>
          </CCard>

          {reportData.users.length > 0 && (
            <CCard id="user-daywise-details" className="border-0 shadow-sm">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1">Day-wise Details</h5>
                    <div className="text-muted small">
                      Only the selected employee is loaded for better performance.
                    </div>
                  </div>
                  {selectedUserId && (
                    <CButton
                      color="secondary"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUserId("")}
                    >
                      Clear Selection
                    </CButton>
                  )}
                </div>

                <CRow className="g-3 mb-4">
                  <CCol lg={7}>
                    <CFormLabel htmlFor="selected_user" className="small text-muted">
                      Select Employee
                    </CFormLabel>
                    <HRUserSelect
                      users={filteredUsers}
                      value={selectedUserId}
                      onChange={setSelectedUserId}
                      placeholder="Search by name, email, or employee ID..."
                    />
                  </CCol>
                </CRow>

                {loadingUserDetail && (
                  <div className="py-5 text-center">
                    <LoadingSpinner />
                    <div className="text-muted small mt-2">
                      Loading day-wise attendance...
                    </div>
                  </div>
                )}

                {!loadingUserDetail && selectedUserDetail && (
                  <>
                    <div
                      className="rounded-3 p-3 mb-4 border"
                      style={{
                        background: "rgba(0,212,255,0.06)",
                        borderColor: "rgba(0,212,255,0.15)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div>
                          <div className="fs-5 fw-semibold">
                            {selectedUserDetail.username}
                          </div>
                          <div className="text-muted small">
                            {selectedUserDetail.email}
                          </div>
                          <CBadge color="secondary" className="mt-2">
                            {selectedUserDetail.employee_id}
                          </CBadge>
                          <CBadge
                            color={
                              LOCATION_BADGE_COLORS[selectedUserDetail.location] ||
                              "secondary"
                            }
                            className="mt-2 ms-2"
                          >
                            {selectedUserDetail.location_label ||
                              LOCATION_LABELS[selectedUserDetail.location]}
                          </CBadge>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          <CBadge color="success" className="px-3 py-2">
                            Working: {selectedUserDetail.total_working_days}
                          </CBadge>
                          <CBadge color="warning" className="px-3 py-2">
                            Present: {selectedUserDetail.total_present_days}
                          </CBadge>
                          <CBadge color="info" className="px-3 py-2">
                            Hours: {selectedUserDetail.total_working_hours}
                          </CBadge>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                      <CFormCheck
                        id="show_active_days"
                        label="Show only days with attendance"
                        checked={showActiveDaysOnly}
                        onChange={(e) => setShowActiveDaysOnly(e.target.checked)}
                      />
                      <div className="text-muted small">
                        {visibleDailyRows.length} day
                        {visibleDailyRows.length === 1 ? "" : "s"} shown
                      </div>
                    </div>

                    <div
                      className="table-responsive rounded-3 border"
                      style={{ maxHeight: "520px", overflowY: "auto" }}
                    >
                      <CTable hover className="mb-0 align-middle">
                        <CTableHead
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          }}
                        >
                          <CTableRow>
                            <CTableHeaderCell>Date</CTableHeaderCell>
                            <CTableHeaderCell>Day</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">
                              Entries
                            </CTableHeaderCell>
                            <CTableHeaderCell>Check In</CTableHeaderCell>
                            <CTableHeaderCell>Check Out</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">
                              Working
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-center">
                              Present
                            </CTableHeaderCell>
                            <CTableHeaderCell>Hours</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {visibleDailyRows.length > 0 ? (
                            visibleDailyRows.map((row) => {
                              const isWeekend =
                                row.day === "Sat" || row.day === "Sun";
                              const hasAttendance = row.present_day === "Yes";

                              return (
                                <CTableRow
                                  key={`${selectedUserDetail.user_id}-${row.date}`}
                                  style={{
                                    background: hasAttendance
                                      ? "rgba(46,184,92,0.06)"
                                      : isWeekend
                                        ? "rgba(255,255,255,0.02)"
                                        : undefined,
                                  }}
                                >
                                  <CTableDataCell className="fw-medium">
                                    {row.date}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge
                                      color={isWeekend ? "secondary" : "dark"}
                                    >
                                      {row.day}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {row.entry_count}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    className="small"
                                    style={{ maxWidth: "180px" }}
                                    title={row.check_in}
                                  >
                                    {row.check_in}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    className="small"
                                    style={{ maxWidth: "180px" }}
                                    title={row.check_out}
                                  >
                                    {row.check_out}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    <CBadge
                                      color={
                                        row.working_day === "Yes"
                                          ? "success"
                                          : "secondary"
                                      }
                                    >
                                      {row.working_day}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    <CBadge
                                      color={
                                        row.present_day === "Yes"
                                          ? "warning"
                                          : "secondary"
                                      }
                                    >
                                      {row.present_day}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell className="fw-medium">
                                    {row.total_working_hours}
                                  </CTableDataCell>
                                </CTableRow>
                              );
                            })
                          ) : (
                            <CTableRow>
                              <CTableDataCell colSpan={8} className="text-center py-4">
                                <div className="text-muted">
                                  No attendance days match this filter.
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </div>
                  </>
                )}

                {!loadingUserDetail && !selectedUserDetail && (
                  <div
                    className="text-center py-5 rounded-3 border"
                    style={{ borderStyle: "dashed" }}
                  >
                    <div className="text-muted mb-1">No employee selected</div>
                    <div className="small text-muted">
                      Pick someone from the summary table or searchable dropdown
                      above.
                    </div>
                  </div>
                )}
              </CCardBody>
            </CCard>
          )}
        </>
      )}

      {!loading && !reportData && (
        <CCard className="border-0 shadow-sm">
          <CCardBody className="text-center py-5">
            <div className="fs-5 mb-2">Ready to generate report</div>
            <div className="text-muted">
              Choose month and year, then click <strong>Load Report</strong>.
            </div>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default MonthlyAttendanceReport;
