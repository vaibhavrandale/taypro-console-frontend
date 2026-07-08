import React, { useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormSelect,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLocationPin, cilMap, cilReload } from "@coreui/icons";
import LoadingSpinner from "../../../components/LoadingSpinner";
import TechnicianLocationMapModal from "./TechnicianLocationMapModal";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        tracks: action.payload.data || [],
        totalPoints: action.payload.count || 0,
        technicianCount: action.payload.technician_count || 0,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const todayIso = () => new Date().toISOString().split("T")[0];

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

const TechnicianLocationDashboard = () => {
  const [{ loading, tracks, totalPoints, technicianCount, error }, dispatch] =
    useReducer(reducer, {
      loading: false,
      tracks: [],
      totalPoints: 0,
      technicianCount: 0,
      error: "",
    });

  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(todayIso());
  const [siteId, setSiteId] = useState("all");
  const [technicianId, setTechnicianId] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sites, setSites] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [sitesRes, techRes] = await Promise.all([
          axios.get("/api/v1/sites", { withCredentials: true }),
          axios.get("/api/v1/users/get-all-site-technicians", {
            withCredentials: true,
          }),
        ]);

        setSites(sitesRes.data.data || []);
        setTechnicians(techRes.data.data || []);
      } catch (fetchError) {
        toast.error("Failed to load filter options");
      }
    };

    fetchFilters();
  }, []);

  const fetchTracks = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });

      const payload = {
        start_date: startDate,
        end_date: endDate,
      };

      if (siteId !== "all") payload.site_id = siteId;
      if (technicianId !== "all") payload.user_id = technicianId;

      const response = await axios.post(
        "/api/v1/technician-user-location-activity/admin",
        payload,
        { withCredentials: true },
      );

      dispatch({
        type: "FETCH_SUCCESS",
        payload: response.data,
      });
    } catch (fetchError) {
      const message =
        fetchError.response?.data?.message ||
        fetchError.response?.data?.error ||
        "Failed to fetch location activity";
      dispatch({ type: "FETCH_FAIL", payload: message });
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const filteredTracks = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return tracks;

    return tracks.filter(
      (track) =>
        track.username?.toLowerCase().includes(query) ||
        track.site_id?.toLowerCase().includes(query),
    );
  }, [tracks, searchText]);

  const uniqueSites = useMemo(
    () => new Set(tracks.map((track) => track.site_id).filter(Boolean)).size,
    [tracks],
  );

  const openMap = (track) => {
    setSelectedTrack(track);
    setMapVisible(true);
  };

  return (
    <div className="p-2">
      <h3 className="text-center mb-4">Technician Location Activity</h3>

      <CRow className="g-3 mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                <CIcon
                  icon={cilLocationPin}
                  size="xl"
                  className="text-primary"
                />
              </div>
              <div>
                <div className="text-body-secondary small">
                  Technicians Tracked
                </div>
                <div className="fs-4 fw-semibold">{technicianCount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success bg-opacity-10 p-3">
                <CIcon icon={cilMap} size="xl" className="text-success" />
              </div>
              <div>
                <div className="text-body-secondary small">Location Points</div>
                <div className="fs-4 fw-semibold">{totalPoints}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody>
              <div className="text-body-secondary small">Sites Covered</div>
              <div className="fs-4 fw-semibold">{uniqueSites}</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody>
              <div className="text-body-secondary small">Date Range</div>
              <div className="fw-semibold">{startDate}</div>
              <div className="text-body-secondary small">to {endDate}</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3} sm={6}>
              <label className="form-label small mb-1">Start Date</label>
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={3} sm={6}>
              <label className="form-label small mb-1">End Date</label>
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
            <CCol md={3} sm={6}>
              <label className="form-label small mb-1">Site</label>
              <CFormSelect
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
              >
                <option value="all">All Sites</option>
                {sites.map((site) => (
                  <option key={site.site_id} value={site.site_id}>
                    {site.site_id}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3} sm={6}>
              <label className="form-label small mb-1">Technician</label>
              <CFormSelect
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
              >
                <option value="all">All Technicians</option>
                {technicians.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.username}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4} sm={8}>
              <label className="form-label small mb-1">Search</label>
              <CFormInput
                placeholder="Search by technician or site"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </CCol>
            <CCol md="auto">
              <CButton color="primary" onClick={fetchTracks}>
                <CIcon icon={cilReload} className="me-1" />
                Apply Filters
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CTable bordered hover responsive align="middle">
        <CTableHead color="dark">
          <CTableRow className="text-center">
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Profile</CTableHeaderCell>
            <CTableHeaderCell>Technician</CTableHeaderCell>
            <CTableHeaderCell>Site</CTableHeaderCell>
            <CTableHeaderCell>Points</CTableHeaderCell>
            <CTableHeaderCell>First Ping</CTableHeaderCell>
            <CTableHeaderCell>Last Ping</CTableHeaderCell>
            <CTableHeaderCell>Source</CTableHeaderCell>
            <CTableHeaderCell>Latest Location</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={10}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan={10} className="text-center text-danger">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredTracks.length ? (
            filteredTracks.map((track, index) => (
              <CTableRow
                key={`${track.user_id}_${track.attendance_id}_${index}`}
              >
                <CTableDataCell className="text-center">
                  {index + 1}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CImage
                    src={track.profile_image}
                    width={44}
                    height={44}
                    className="rounded-circle object-fit-cover"
                  />
                </CTableDataCell>
                <CTableDataCell>{track.username}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color="info">{track.site_id}</CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CBadge color="primary">{track.point_count}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {formatDateTime(track.first_recorded_at)}
                </CTableDataCell>
                <CTableDataCell>
                  {formatDateTime(track.last_recorded_at)}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex flex-wrap gap-1 justify-content-center">
                    {track.sources?.map((source) => (
                      <CBadge color="secondary" key={source}>
                        {source}
                      </CBadge>
                    ))}
                  </div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {track.latest_location ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${track.latest_location.lat},${track.latest_location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-decoration-none"
                    >
                      {track.latest_location.lat.toFixed(5)},{" "}
                      {track.latest_location.lng.toFixed(5)}
                    </a>
                  ) : (
                    "—"
                  )}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    onClick={() => openMap(track)}
                  >
                    View Track
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={10}
                className="text-center text-body-secondary"
              >
                No location activity found for the selected filters.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <TechnicianLocationMapModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        track={selectedTrack}
      />
    </div>
  );
};

export default TechnicianLocationDashboard;
