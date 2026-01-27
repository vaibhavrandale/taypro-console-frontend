import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import * as XLSX from "xlsx-js-style";
import { CFormSelect } from "@coreui/react";
import { useParams } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        mdslogs: action.payload,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    // case "FETCH_SITES_REQUEST":
    //   return { ...state, loadingSites: true, sitesError: "" };
    // case "FETCH_SITES_SUCCESS":
    //   return { ...state, loadingSites: false, sites: action.payload };
    // case "FETCH_SITES_FAIL":
    //   return { ...state, loadingSites: false, sitesError: action.payload };
    default:
      return state;
  }
};

const MdsLog = () => {
  const [
    {
      loading,
      error,
      mdslogs,
      //  loadingSites, sites, sitesError
    },
    dispatch,
  ] = useReducer(reducer, {
    mdslogs: [],
    loading: true,
    error: "",
    // loadingSites: false,
    // sites: [],
    // sitesError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const today = new Date().toISOString().split("T")[0];
  const { site_id } = useParams();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  //   useEffect(() => {
  //     const fetchSites = async () => {
  //       dispatch({ type: "FETCH_SITES_REQUEST" });
  //       try {
  //         const res = await axios.get(`/api/v1/sites`, {
  //           headers: { Authorization: `Bearer ${authtoken}` },
  //         });

  //         const siteData = res.data.data || [];
  //         dispatch({ type: "FETCH_SITES_SUCCESS", payload: siteData });

  //         // ✅ Immediately set siteId after fetching if user is External
  //         if (siteData.length > 0) {
  //           setSiteId(siteData[0].site_id);
  //         }
  //       } catch (err) {
  //         const errorMsg =
  //           err.response?.data?.error || err.response?.data?.message;
  //         dispatch({ type: "FETCH_SITES_FAIL", payload: errorMsg });
  //         toast.error(errorMsg);
  //       }
  //     };
  //     fetchSites();
  //   }, [authtoken]);
  useEffect(() => {
    // if (!site_id) return;
    // if (site_id) {
    const fetchMdsLgs = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.post(
          `/api/v1/mds-tracking/report`,
          {
            site_id: site_id,
            fromDate,
            toDate,
          },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );

        const result = response.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };
    fetchMdsLgs();
    // }
  }, [authtoken, fromDate, site_id, toDate]);

  const formatTime = (date) =>
    date ? new Date(date).toLocaleString("en-IN") : "-";
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const exportToExcel = () => {
    if (!mdslogs || mdslogs.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const sheetData = [];

    // ========================
    // 1. Report Header
    // ========================
    sheetData.push(["MDS DAILY CLEANING REPORT"]);
    sheetData.push([]);
    sheetData.push(["Site", mdslogs[0]?.site_id || "N/A"]);
    sheetData.push(["From Date", formatDateDDMMYYYY(fromDate)]);
    sheetData.push(["To Date", formatDateDDMMYYYY(toDate)]);
    sheetData.push([
      "Generated At",
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    ]);
    sheetData.push([]);
    sheetData.push([]);

    // ========================
    // 2. Day-wise Data
    // ========================
    mdslogs.forEach((log, index) => {
      // ---- Day Heading ----
      sheetData.push([
        `Day ${index + 1} | ${formatDateDDMMYYYY(log.date)} | ${log.site_id} | ${log.mds_no}`,
      ]);

      sheetData.push([]);

      // ---- Summary ----
      sheetData.push(["Total Rows", log.total_rows]);
      sheetData.push(["Completed Rows", log.completed_rows]);
      sheetData.push(["Incomplete Rows", log.incomplete_rows]);
      sheetData.push([]);

      // ---- Table Header ----
      sheetData.push(["Row No", "Start Time", "Finish Time", "Status"]);

      // ---- Table Data ----
      log.rows.forEach((row) => {
        sheetData.push([
          row.row_no,
          row.startAt ? formatTime(row.startAt) : "N/A",
          row.finishAt ? formatTime(row.finishAt) : "N/A",
          row.finished ? "Completed" : "In Progress",
        ]);
      });

      // ---- Day Summary ----
      sheetData.push([]);

      // ---- Space between days ----
      sheetData.push([]);
      sheetData.push([]);
    });

    // ========================
    // Create Sheet
    // ========================
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // ========================
    // Styling & Merging
    // ========================
    ws["!merges"] = [];

    sheetData.forEach((row, rowIndex) => {
      // Big headings
      if (
        row.length === 1 &&
        typeof row[0] === "string" &&
        row[0].includes("Day")
      ) {
        ws["!merges"].push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: 3 },
        });

        const cell = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
        ws[cell].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "FFF59D" } }, // light yellow
        };
      }

      // Table headers
      if (row.length === 4 && row[0] === "Row No" && row[1] === "Start Time") {
        row.forEach((_, colIndex) => {
          const cell = XLSX.utils.encode_cell({
            r: rowIndex,
            c: colIndex,
          });
          ws[cell].s = {
            font: { bold: true },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: "E3F2FD" } },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        });
      }

      // Table cells
      if (row.length === 4 && typeof row[0] === "number") {
        row.forEach((_, colIndex) => {
          const cell = XLSX.utils.encode_cell({
            r: rowIndex,
            c: colIndex,
          });
          ws[cell].s = {
            alignment: { horizontal: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        });
      }
    });

    // Column widths
    ws["!cols"] = [{ wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 18 }];

    // ========================
    // Create Workbook
    // ========================
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MDS Daily Report");

    try {
      XLSX.writeFile(wb, `MDS_Report_${fromDate}_to_${toDate}.xlsx`);
      toast.success("Excel report downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel report");
    }
  };

  return (
    <div className=" mt-3">
      {/* Date selection */}
      {/* Date & Site Filter */}
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <h6 className="mb-3 fw-semibold">Filter Report</h6>

          <div className="row g-3">
            {/* From Date */}
            <div className="col-12 col-md-2">
              <label className="form-label">From</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate}
              />
            </div>

            {/* To Date */}
            <div className="col-12 col-md-2">
              <label className="form-label">To</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate}
                max={today}
              />
            </div>

            {/* <div className="col-12 col-md-2">
              <label className="form-label">Site</label>
              <CFormSelect
                id="siteSelect"
                value={site_id}
                onChange={(e) => setSiteId(e.target.value)}
              >
                <option value="">Select Site</option>
                {sites?.map((site, index) => (
                  <option key={index} value={site.site_id}>
                    {site.site_id}
                  </option>
                ))}
              </CFormSelect>
            </div> */}

            {/* Action Button */}
            <div className="col-12 col-md-3 d-flex flex-column">
              <label className="form-label">Report</label>
              <button
                className="btn btn-success btn-sm "
                onClick={exportToExcel}
                disabled={loading || mdslogs.length === 0}
              >
                ⬇Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* States */}
      {loading && <LoadingSpinner />}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          {mdslogs.length === 0 ? (
            <p className="text-muted text-center">
              No cleaning activity found for selected date
            </p>
          ) : (
            mdslogs.map((log, index) => {
              const allDone = log.completed_rows === log.total_rows;

              return (
                <div key={index} className="card mb-4 shadow-sm">
                  {/* Summary */}
                  <div className="card-body">
                    <h5 className="mb-1">{log.date}</h5>

                    <p className="mb-2">
                      <span className="text-warning me-2">Site</span>:{" "}
                      {log.site_id}
                    </p>

                    <p className="mb-2">
                      <span className="text-warning me-2">Cleaning Status</span>
                      {allDone ? (
                        <span className="text-success">
                          : All rows cleaned successfully
                        </span>
                      ) : (
                        <span className="text-warning">
                          Cleaning still in progress
                        </span>
                      )}
                    </p>

                    <p className="mb-3">
                      <span className="me-2 text-warning">Rows cleaned</span>:{" "}
                      {log.completed_rows} out of
                      <span className="ms-2">{log.total_rows}</span>
                    </p>

                    {/* Simple table */}
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Row No</th>
                            <th>Start Time</th>
                            <th>Finish Time</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {log.rows.map((row, i) => (
                            <tr key={i}>
                              <td>{row.row_no}</td>
                              <td>{formatTime(row.startAt)}</td>
                              <td>{formatTime(row.finishAt)}</td>
                              <td>
                                {row.finished ? (
                                  <span className="text-success">✔ Done</span>
                                ) : (
                                  <span className="text-warning">
                                    ⏳ In Progress
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default MdsLog;
