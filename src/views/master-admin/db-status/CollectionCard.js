// import React from "react";

// const CollectionCard = () => {
//   return <div>CollectionCard</div>;
// };

// export default CollectionCard;

import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
} from "@coreui/react";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Info } from "lucide-react";

export default function CollectionCard({ item, index }) {
  const [visible, setVisible] = useState(false);
  const [activeYear, setActiveYear] = useState(null);

  const years = Array.from(
    new Set(item.monthWise?.map((m) => m.month.split("-")[0]))
  );

  const groupedByYear = years.reduce((acc, year) => {
    acc[year] = item.monthWise.filter((m) => m.month.startsWith(year));
    return acc;
  }, {});

  const getBadgeColor = (value) => {
    if (value > 5000) return "danger"; // Above 5000 → red
    if (value > 1000) return "warning"; // 1001 - 5000 → yellow/orange
    return "success"; // <= 1000 → green
  };

  const montotal = (month) => {
    return month.weeks.reduce((a, t) => a + t.count, 0);
  };

  return (
    <>
      <CCard className="shadow-sm border-0">
        <CCardHeader className="fw-bold d-flex justify-content-between align-items-center">
          <span>
            <CBadge color="warning" className="me-2">
              <span className=""> {index + 1}</span>
            </CBadge>
            {item.collection}
          </span>

          <Info onClick={() => setVisible(true)} className="cursor-pointer" />
        </CCardHeader>

        <CCardBody>
          <div className="d-flex justify-content-between mb-2">
            <span>Total Docs:</span>
            <span>{item.count}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Data Size:</span>
            <span>{item.sizeMB} MB</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Storage Size:</span>
            <span>{item.storageMB} MB</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Index Size:</span>
            <span>{item.totalIndexMB} MB</span>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal */}
      <CModal
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        scrollable
        backdrop="static"
        className="rounded-0"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>{item.collection} - Detailed View</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        {/* <CModalBody>
      
          <CNav variant="tabs">
            {years.map((yr, i) => (
              <CNavItem key={i}>
                <CNavLink
                  active={activeYear === yr}
                  onClick={() => setActiveYear(yr)}
                  style={{ cursor: "pointer" }}
                >
                  {yr}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>

          <CTabContent className="mt-3">
            {years.map((yr, i) => (
              <CTabPane key={i} visible={activeYear === yr}>
                <h6 className="fw-bold mb-3">Monthly Breakdown ({yr})</h6>

                {groupedByYear[yr].map((m, mi) => (
                  <div key={mi} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <strong>{m.month}</strong>
                      <span className="badge bg-primary">
                        Total: {m.monthTotal}
                      </span>
                    </div>
                    <hr />
                    {m.weeks.map((w, wi) => (
                      <div
                        key={wi}
                        className="d-flex justify-content-between py-1"
                      >
                        <span>Week {w.week}</span>
                        <span className="badge bg-dark">{w.count}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </CTabPane>
            ))}
          </CTabContent>
        </CModalBody> */}
        <CModalBody>
          {/* Year Tabs */}
          <CNav variant="tabs" className="mb-2">
            {years.map((yr, i) => (
              <CNavItem key={i}>
                <CNavLink
                  className="mb-2"
                  active={activeYear === yr}
                  onClick={() => setActiveYear(yr)}
                  style={{
                    cursor: "pointer",
                    fontWeight: "600",
                    padding: "6px 12px",
                    fontSize: "0.9rem",
                    color: activeYear === yr ? "#fff" : "#aaa",
                    background: activeYear === yr ? "green" : "green",
                    borderRadius: "6px",
                  }}
                >
                  Monthly Breakdown - {yr}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>

          <CTabContent>
            {years.map((yr, i) => (
              <CTabPane key={i} visible={activeYear === yr}>
                {/* <h6 className="fw-bold mb-3" style={{ color: "#51cf66" }}>
                  Monthly Breakdown ({yr})
                </h6> */}

                <div className="row g-3">
                  {groupedByYear[yr].map((m, mi) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={mi}>
                      <CCard
                        className="shadow-sm rounded-0"
                        style={{
                          background: "#2a2a2a",
                          color: "#fff",
                          borderRadius: "10px",
                          border: "1px solid #3a3a3a",
                        }}
                      >
                        <CCardBody style={{ padding: "12px 14px" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span style={{ fontSize: "0.95rem" }}>
                              {m.month}
                            </span>

                            <CBadge
                              color={getBadgeColor(montotal(m))}
                              shape="rounded-pill"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {montotal(m)}
                            </CBadge>
                          </div>

                          <hr style={{ borderTop: "1px solid #444" }} />

                          <div className="row g-2">
                            {m.weeks.map((w, wi) => (
                              <div className="col-12" key={wi}>
                                <CCard
                                  className="shadow-sm rounded border"
                                  style={{
                                    background: "#1f1f1f",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <CCardBody
                                    style={{
                                      padding: "6px 10px",
                                      fontSize: "0.8rem",
                                      color: "#ddd",
                                    }}
                                  >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span>Week {w.week}</span>

                                      <CBadge
                                        color={getBadgeColor(w.count)}
                                        shape="rounded-pill"
                                        // className="px-2 py-1"
                                        style={{
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        {w.count}
                                      </CBadge>
                                    </div>
                                  </CCardBody>
                                </CCard>
                              </div>
                            ))}
                          </div>
                        </CCardBody>
                      </CCard>
                    </div>
                  ))}
                </div>
              </CTabPane>
            ))}
          </CTabContent>
        </CModalBody>
      </CModal>
    </>
  );
}
