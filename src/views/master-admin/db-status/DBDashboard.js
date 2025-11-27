import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CAlert,
  CBadge,
  CFormInput,
} from "@coreui/react";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CollectionCard from "./CollectionCard";

const DBDashboard = () => {
  const [stats, setStats] = useState([]);
  const [total, setTotal] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/api-logger/collection-status");
        setStats(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);
  const filteredStats = stats
    .filter((item) =>
      item.collection.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.collection.toLowerCase().localeCompare(b.collection.toLowerCase())
    );

  return (
    <div>
      <h4 className=" text-center mb-4">📊 Database Overview</h4>

      <div className="d-flex justify-content-end align-items-center">
        <CButton
          color="primary"
          size="sm"
          onClick={() => setRefreshKey((p) => p + 1)}
        >
          <RefreshCcw size={18} /> Refresh
        </CButton>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CAlert color="danger">{error}</CAlert>
      ) : (
        <>
          {total && (
            <CRow className="my-3">
              <CCol xs={12}>
                <CCard className="shadow-sm border-0 rounded-3">
                  <CCardHeader className="fw-bold fs-5 bg-light">
                    Database Summary
                  </CCardHeader>
                  <CCardBody>
                    <CRow className="g-3">
                      {/* Total Docs */}
                      <CCol xs={6} md={4} lg={2}>
                        <CCard className="py-3 text-center border-0 shadow-sm rounded-3">
                          <div className="text-muted small">Total Docs</div>
                          <div className="fs-4 fw-bold ">
                            {total.totalDocuments}
                          </div>
                        </CCard>
                      </CCol>

                      {/* Data Size */}
                      <CCol xs={6} md={4} lg={2}>
                        <CCard className="py-3 text-center border-0 shadow-sm rounded-3">
                          <div className="text-muted small">Data Size</div>
                          <div className="fs-5 fw-bold text-success">
                            {total.totalDataSizeMB} MB
                          </div>
                        </CCard>
                      </CCol>

                      {/* Storage Size */}
                      <CCol xs={6} md={4} lg={2}>
                        <CCard className="py-3 text-center border-0 shadow-sm rounded-3">
                          <div className="text-muted small">Storage Size</div>
                          <div className="fs-5 fw-bold text-danger">
                            {total.totalStorageSizeMB} MB
                          </div>
                        </CCard>
                      </CCol>

                      {/* Index Size */}
                      <CCol xs={6} md={4} lg={3}>
                        <CCard className="py-3 text-center border-0 shadow-sm rounded-3">
                          <div className="text-muted small">Index Size</div>
                          <div className="fs-5 fw-bold text-warning">
                            {total.totalIndexSizeMB} MB
                          </div>
                        </CCard>
                      </CCol>

                      {/* Overall DB Size */}
                      <CCol xs={6} md={4} lg={3}>
                        <CCard className="py-3 text-center border-0 shadow-sm rounded-3">
                          <div className="text-muted small">
                            Overall DB Size
                          </div>
                          <div className="fs-4 fw-bold text-primary">
                            {total.totalDBSizeMB} MB
                          </div>
                        </CCard>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
          <div className="d-flex justify-content-end align-items-center">
            <CFormInput
              placeholder="Search collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "260px" }}
              className="mb-2"
            />
          </div>
          <CRow className="g-4">
            {filteredStats.map((item, i) => (
              <CCol xs={12} md={6} lg={4} key={i}>
                <CollectionCard item={item} index={i} />
              </CCol>
            ))}
            {/* {filteredStats.map((item, i) => (
              <CCol xs={12} md={6} lg={4} key={i}>
                <CCard className="shadow-sm border-0">
                  <CCardHeader className="fw-bold d-flex justify-content-between">
                    <span>
                      <CBadge color="dark" className="me-2">
                        <span className="text-white"> {i + 1}</span>
                      </CBadge>
                      {item.collection}
                    </span>
                  </CCardHeader>
                  <CCardBody>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Docs:</span>
                      <span>{item.count}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Data Size:</span>
                      <CBadge color="success">{item.sizeMB} MB</CBadge>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Storage Size:</span>
                      <CBadge color="danger">{item.storageMB} MB</CBadge>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span>Index Size:</span>
                      <CBadge color="warning">{item.totalIndexMB} MB</CBadge>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))} */}
          </CRow>
        </>
      )}
    </div>
  );
};

export default DBDashboard;
