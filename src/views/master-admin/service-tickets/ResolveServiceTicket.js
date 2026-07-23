/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormTextarea,
  CFormSelect,
  CBadge,
  CFormLabel,
  CListGroup,
  CListGroupItem,
  CInputGroup,
  CModalFooter,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
  CFormCheck,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilList, cilPlus, cilTrash, cilX } from "@coreui/icons";
import "./servicetickts.css";

const emptyPartRow = () => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  part_replaced_id: "",
  part_replaced: "",
  replaced_part_quantity: "",
  checklist: null,
  searchTerm: "",
});

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, ticket: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false, success: true };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "FETCH_FAULTS_REQUEST":
      return { ...state, faultsloading: true };
    case "FETCH_FAULTS_SUCCESS":
      return {
        ...state,
        serviceticketsfault: action.payload,
        faultsloading: false,
      };
    case "FETCH_FAULTS_FAIL":
      return { ...state, faultsloading: false, faulterror: action.payload };
    case "FETCH_INVENTORY_REQUEST":
      return { ...state, loadingInventories: true, inventoryerror: "" };
    case "FETCH_INVENTORY_SUCCESS":
      return {
        ...state,
        loadingInventories: false,
        inventories: action.payload,
      };
    case "FETCH_INVENTORY_FAIL":
      return {
        ...state,
        loadingInventories: false,
        inventoryerror: action.payload,
      };
    default:
      return state;
  }
};

const roleToRoute = (role) => {
  const map = {
    "Master Admin": "master-admin",
    "Service Admin": "service-admin",
    "Project Admin": "project-admin",
    "Master User": "master-user",
    "Service User": "service-user",
    "Project User": "project-user",
    "Site Technician": "site-technician",
  };
  return map[role] || "master-admin";
};

const ResolveServiceTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const adminroute = roleToRoute(userInfo?.role);
  const isSiteTechnician = userInfo?.role === "Site Technician";

  const [state, dispatch] = useReducer(reducer, {
    ticket: {},
    inventories: [],
    loadingInventories: true,
    loading: true,
    error: "",
    updating: false,
    success: false,
    faultsloading: true,
    faulterror: "",
    inventoryerror: "",
    serviceticketsfault: [],
  });

  const [formData, setFormData] = useState({});
  const [parts, setParts] = useState([emptyPartRow()]);
  const [uploadingFields, setUploadingFields] = useState({});
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [checklistFields, setChecklistFields] = useState([]);
  const [checklistResponses, setChecklistResponses] = useState({});
  const [checklistFieldLoading, setChecklistFieldLoading] = useState(false);
  const [activePartKey, setActivePartKey] = useState(null);

  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentImageField, setCurrentImageField] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null, name: "" });
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/v1/servicetickets/getone/${id}`,
          { withCredentials: true },
        );
        const ticket = response.data.data;
        dispatch({ type: "FETCH_SUCCESS", payload: ticket });
        setFormData(ticket);

        if (Array.isArray(ticket.parts_replaced) && ticket.parts_replaced.length) {
          setParts(
            ticket.parts_replaced.map((p) => ({
              ...emptyPartRow(),
              part_replaced_id: p.part_replaced_id || "",
              part_replaced: p.part_replaced || "",
              replaced_part_quantity: p.replaced_part_quantity || "",
              checklist: p.checklist || null,
            })),
          );
          setFormData((prev) => ({ ...prev, service_part_replaced: true }));
        } else if (ticket.part_replaced_id) {
          const checklistEntry = Array.isArray(ticket.part_checklist)
            ? ticket.part_checklist.find(
                (c) => c.part_id === ticket.part_replaced_id,
              )
            : null;
          setParts([
            {
              ...emptyPartRow(),
              part_replaced_id: ticket.part_replaced_id,
              part_replaced: ticket.part_replaced || "",
              replaced_part_quantity: ticket.replaced_part_quantity || "",
              checklist: checklistEntry?.checklist || null,
            },
          ]);
          setFormData((prev) => ({
            ...prev,
            service_part_replaced: ticket.service_part_replaced !== false,
          }));
        }
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.message,
        });
      }
    };

    const fetchAllFaults = async () => {
      try {
        dispatch({ type: "FETCH_FAULTS_REQUEST" });
        const response = await axios.get(
          "/api/v1/serviceticketsfaults/all-serviceticketsfaults-without-pg",
          { withCredentials: true },
        );
        dispatch({
          type: "FETCH_FAULTS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAULTS_FAIL",
          payload: error.response?.data?.message || error.message,
        });
      }
    };

    const fetchInventories = async () => {
      dispatch({ type: "FETCH_INVENTORY_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/service-inventory`, {
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_INVENTORY_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_INVENTORY_FAIL",
          payload: "Failed to fetch Inventories",
        });
        toast.error("Failed to fetch Inventories");
      }
    };

    fetchTicket();
    fetchAllFaults();
    fetchInventories();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "service_part_replaced" && !checked) {
      setParts([emptyPartRow()]);
    }
  };

  const updatePart = (key, patch) => {
    setParts((prev) =>
      prev.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    );
  };

  const addPartRow = () => setParts((prev) => [...prev, emptyPartRow()]);

  const removePartRow = (key) => {
    setParts((prev) =>
      prev.length <= 1 ? [emptyPartRow()] : prev.filter((p) => p.key !== key),
    );
  };

  const filteredInventories = (searchTerm) =>
    state.inventories?.filter((inv) =>
      `${inv.item_name} ${inv.item_code}`
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase()),
    ) || [];

  const handleOpenChecklistModal = async (part, reopen = false) => {
    if (!part?.part_replaced_id) {
      toast.error("Select a part first");
      return;
    }
    try {
      setChecklistFieldLoading(true);
      setActivePartKey(part.key);
      const result = await axios.get(
        `/api/v1/faultanalysis/${part.part_replaced_id}`,
        { withCredentials: true },
      );
      const fields = result.data.data?.[0]?.checklist_fields || [];
      setChecklistFields(fields);
      // No configured fields → mark checklist done without modal friction
      if (!fields.length && !reopen) {
        setParts((prev) =>
          prev.map((p) =>
            p.key === part.key ? { ...p, checklist: {} } : p,
          ),
        );
        toast.success("No checklist configured for this part");
        return;
      }
      setChecklistResponses(
        reopen && part.checklist && typeof part.checklist === "object"
          ? part.checklist
          : {},
      );
      setShowChecklistModal(true);
    } catch (err) {
      toast.error("Checklist not found or error loading checklist");
    } finally {
      setChecklistFieldLoading(false);
    }
  };

  const updateChecklistResponse = (fieldName, value) => {
    setChecklistResponses((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSaveChecklist = () => {
    const checklistObject = { ...checklistResponses };
    setParts((prev) =>
      prev.map((p) =>
        p.key === activePartKey ? { ...p, checklist: checklistObject } : p,
      ),
    );
    setShowChecklistModal(false);
    toast.success("Checklist saved");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });

    const { createdAt, updatedAt, _id, last_activity, __v, ...rest } = formData;
    const servicePartReplaced = !!rest.service_part_replaced;

    const parts_replaced = servicePartReplaced
      ? parts
          .filter((p) => p.part_replaced_id)
          .map((p) => ({
            part_replaced_id: p.part_replaced_id,
            part_replaced: p.part_replaced,
            replaced_part_quantity: Number(p.replaced_part_quantity) || 0,
            checklist: p.checklist || {},
          }))
      : [];

    const first = parts_replaced[0] || {};
    const payload = {
      ...rest,
      service_part_replaced: servicePartReplaced,
      parts_replaced,
      // legacy fields kept in sync with first part
      part_replaced: first.part_replaced || null,
      part_replaced_id: first.part_replaced_id || null,
      replaced_part_quantity: first.replaced_part_quantity || null,
      part_checklist: parts_replaced.map((p) => ({
        part_id: p.part_replaced_id,
        checklist: p.checklist || {},
      })),
    };

    try {
      await axios.put(`/api/v1/servicetickets/resolve/${id}`, payload, {
        withCredentials: true,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(
        `${payload.ticket_id || "Ticket"} resolved successfully`,
      );
      navigate(`/${adminroute}/service-tickets`);
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      dispatch({ type: "UPDATE_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  const deleteImage = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    if (!files?.length) return;
    const uploadData = new FormData();
    uploadData.append("file", files[0]);
    try {
      setUploadingFields((prev) => ({ ...prev, [name]: true }));
      const response = await axios.post(
        "/api/v1/image-upload/service-tickets",
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      setFormData((prev) => ({ ...prev, [name]: response.data.url }));
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploadingFields((prev) => ({ ...prev, [name]: false }));
    }
  };

  const openCamera = (fieldName) => {
    setCurrentImageField(fieldName);
    setCameraModalVisible(true);
  };

  useEffect(() => {
    if (!cameraModalVisible) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const data = await response.json();
          setLocation({
            lat,
            lng,
            name: data.display_name || "Unknown location",
          });
        } catch {
          setLocation({ lat, lng, name: "Location not available" });
        }
      },
      () => setLocation({ lat: null, lng: null, name: "Location not available" }),
    );
  }, [cameraModalVisible]);

  useEffect(() => {
    if (!cameraModalVisible) {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      return;
    }
    let mediaStream;
    (async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        toast.error("Could not access camera: " + err.message);
        setCameraModalVisible(false);
      }
    })();
    return () => {
      if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraModalVisible]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const timestamp = new Date().toLocaleString("en-IN", {
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    const boxHeight = 90;
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);
    context.fillStyle = "white";
    context.font = "16px Arial";
    let y = canvas.height - boxHeight + 25;
    context.fillText(`Coordinates: ${location.lat}, ${location.lng}`, 10, y);
    y += 20;
    context.fillText(`Address: ${location.name || "N/A"}`, 10, y);
    y += 20;
    context.fillText(`Timestamp: ${timestamp}`, 10, y);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        setUploadingFields((prev) => ({
          ...prev,
          [currentImageField]: true,
        }));
        try {
          const uploadData = new FormData();
          uploadData.append(
            "file",
            blob,
            `camera-capture-${Date.now()}.jpg`,
          );
          const response = await axios.post(
            "/api/v1/image-upload/service-tickets",
            uploadData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            },
          );
          setFormData((prev) => ({
            ...prev,
            [currentImageField]: response.data.url,
          }));
          setCameraModalVisible(false);
        } catch {
          toast.error("Image upload failed");
        } finally {
          setUploadingFields((prev) => ({
            ...prev,
            [currentImageField]: false,
          }));
        }
      },
      "image/jpeg",
      0.8,
    );
  };

  const isTicketResolved = formData.ticket_resolved === true;
  const servicePartReplaced = !!formData.service_part_replaced;

  const partsValid =
    !servicePartReplaced ||
    (parts.length > 0 &&
      parts.every(
        (p) =>
          p.part_replaced_id &&
          Number(p.replaced_part_quantity) > 0 &&
          p.checklist !== null &&
          typeof p.checklist === "object",
      ));

  // If checklist has no fields configured, allow save without checklist answers
  const enableUpdateTicket = isTicketResolved && partsValid;

  const activePart = parts.find((p) => p.key === activePartKey);
  const checklistComplete =
    checklistFields.length === 0 ||
    checklistFields.every((f) => {
      const val = checklistResponses[f.field_name];
      return val !== undefined && val !== null && String(val).trim() !== "";
    });

  const renderImageSlot = (fieldName, label) => (
    <CRow key={fieldName} className="align-items-center mb-2">
      <CCol md={3} xs={6}>
        {isSiteTechnician ? (
          <div
            className="container-btn-file p-2 my-2 w-80"
            style={{ cursor: "pointer" }}
            onClick={() => openCamera(fieldName)}
          >
            <CIcon icon={cilCloudUpload} className="upload-icon" />
            {label}
          </div>
        ) : (
          <div className="container-btn-file p-2 my-2 w-80">
            <CIcon icon={cilCloudUpload} className="upload-icon" />
            {label}
            <input
              className="file"
              name={fieldName}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploadingFields[fieldName]}
            />
          </div>
        )}
      </CCol>
      <CCol md={3} xs={6}>
        {uploadingFields[fieldName] ? (
          <LoadingSpinner />
        ) : formData[fieldName] ? (
          <div className="my-2 position-relative d-inline-block">
            <img
              src={formData[fieldName]}
              alt={label}
              width="80"
              height="80"
              style={{ objectFit: "cover", borderRadius: "5px" }}
            />
            <CBadge
              color="primary"
              shape="rounded-pill"
              className="position-absolute top-0 start-0 p-1"
              style={{ cursor: "pointer" }}
              onClick={() => deleteImage(fieldName)}
            >
              <CIcon icon={cilX} title="Remove" />
            </CBadge>
          </div>
        ) : null}
      </CCol>
    </CRow>
  );

  return (
    <div>
      <CCard>
        <CCardHeader>
          Resolve Service Ticket -{" "}
          <b className="badge bg-success">{formData.ticket_id}</b>
        </CCardHeader>
        <CCardBody>
          {state.loading ? (
            <div className="d-flex justify-content-center align-items-center h-50">
              <LoadingSpinner />
            </div>
          ) : state.error ? (
            <div className="d-flex justify-content-center align-items-center w-100">
              <p className="badge bg-danger p-2">{state.error}</p>
            </div>
          ) : (
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CFormInput type="hidden" name="ticket_id" value={formData.ticket_id || ""} readOnly />
                <CCol md={6}>
                  <CFormInput label="Robot No" name="robot_no" value={formData.robot_no || ""} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Deveui" name="deveui" value={formData.deveui || ""} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Block" name="block" value={formData.block || ""} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Robot Type" name="robot_type" value={formData.robot_type || ""} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Site ID" name="site_id" value={formData.site_id || ""} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Company" name="company" value={formData.company || ""} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Lora No" name="lora_no" value={formData.lora_no || ""} readOnly />
                </CCol>
                <CCol md={6}>
                  {state.faultsloading ? (
                    <LoadingSpinner />
                  ) : (
                    <CFormSelect
                      label="Fault Type"
                      name="fault_type"
                      value={formData.fault_type || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fault_type: e.target.value })
                      }
                      className="mb-3"
                    >
                      <option value="">Select Fault Type</option>
                      {(state.serviceticketsfault || []).map((fault, index) => (
                        <option key={index} value={fault.fault_name}>
                          {fault.fault_name.replace(/-/g, " ")}
                        </option>
                      ))}
                    </CFormSelect>
                  )}
                </CCol>

                <CCol md={12}>
                  <CFormSelect
                    label="Ticket Resolved"
                    name="ticket_resolved"
                    value={String(formData.ticket_resolved ?? "")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticket_resolved: e.target.value === "true",
                      })
                    }
                  >
                    <option value="">Select an option</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </CFormSelect>
                </CCol>

                <CCol md={12}>
                  <CFormTextarea
                    label="Ticket Resolving Notes"
                    name="ticket_resolving_notes"
                    value={formData.ticket_resolving_notes || ""}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={12} className="mt-3 mb-2">
                  <CFormCheck
                    type="checkbox"
                    name="service_part_replaced"
                    label="Part(s) replaced?"
                    checked={!!formData.service_part_replaced}
                    onChange={handleChange}
                  />
                </CCol>

                {servicePartReplaced && (
                  <CCol md={12}>
                    {state.loadingInventories ? (
                      <LoadingSpinner />
                    ) : state.inventoryerror ? (
                      <span className="badge bg-danger p-2">
                        {state.inventoryerror}
                      </span>
                    ) : (
                      parts.map((part, idx) => (
                        <CCard key={part.key} className="mb-3 border">
                          <CCardBody>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong>Part {idx + 1}</strong>
                              <div className="d-flex gap-2">
                                {part.checklist && (
                                  <CButton
                                    type="button"
                                    color="info"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleOpenChecklistModal(part, true)
                                    }
                                  >
                                    <CIcon icon={cilList} /> Checklist
                                  </CButton>
                                )}
                                <CButton
                                  type="button"
                                  color="danger"
                                  size="sm"
                                  variant="outline"
                                  disabled={parts.length <= 1}
                                  onClick={() => removePartRow(part.key)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </div>
                            </div>

                            <CRow>
                              <CCol md={8}>
                                <CFormLabel>Select part</CFormLabel>
                                <CInputGroup className="mb-2">
                                  <CFormInput
                                    type="text"
                                    placeholder="Search item name or code..."
                                    value={
                                      part.searchTerm || part.part_replaced || ""
                                    }
                                    onChange={(e) =>
                                      updatePart(part.key, {
                                        searchTerm: e.target.value,
                                        part_replaced_id: "",
                                        part_replaced: "",
                                        checklist: null,
                                      })
                                    }
                                  />
                                  <CButton
                                    type="button"
                                    color="primary"
                                    disabled={!part.part_replaced_id}
                                    onClick={() =>
                                      handleOpenChecklistModal(part, !!part.checklist)
                                    }
                                  >
                                    Fill Checklist
                                  </CButton>
                                </CInputGroup>
                                {part.searchTerm && (
                                  <CListGroup
                                    className="mb-3"
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredInventories(part.searchTerm)
                                      .length === 0 ? (
                                      <CListGroupItem>
                                        No matching parts found
                                      </CListGroupItem>
                                    ) : (
                                      filteredInventories(part.searchTerm).map(
                                        (inventory, i) => (
                                          <CListGroupItem
                                            key={i}
                                            action
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              updatePart(part.key, {
                                                searchTerm: "",
                                                part_replaced_id:
                                                  inventory.item_id,
                                                part_replaced: `${inventory.item_name} - ${inventory.item_code}`,
                                                checklist: null,
                                              });
                                              handleOpenChecklistModal(
                                                {
                                                  ...part,
                                                  part_replaced_id:
                                                    inventory.item_id,
                                                  part_replaced: `${inventory.item_name} - ${inventory.item_code}`,
                                                },
                                                false,
                                              );
                                            }}
                                          >
                                            {inventory.item_name} -{" "}
                                            {inventory.item_code} (Qty:{" "}
                                            {inventory.quantity})
                                          </CListGroupItem>
                                        ),
                                      )
                                    )}
                                  </CListGroup>
                                )}
                                {part.part_replaced_id && !part.checklist && (
                                  <small className="text-danger">
                                    Checklist required for this part
                                  </small>
                                )}
                                {part.checklist && (
                                  <small className="text-success">
                                    Checklist saved
                                  </small>
                                )}
                              </CCol>
                              <CCol md={4}>
                                <CFormInput
                                  label="Quantity"
                                  type="number"
                                  min="1"
                                  value={part.replaced_part_quantity}
                                  onChange={(e) =>
                                    updatePart(part.key, {
                                      replaced_part_quantity: e.target.value,
                                    })
                                  }
                                />
                              </CCol>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      ))
                    )}
                    <CButton
                      type="button"
                      color="secondary"
                      size="sm"
                      className="mb-3"
                      onClick={addPartRow}
                    >
                      <CIcon icon={cilPlus} className="me-1" /> Add another part
                    </CButton>
                  </CCol>
                )}

                <CCol md={12}>
                  <p className="fw-semibold mt-2 mb-1">Ticket Resolving Images</p>
                  {[1, 2, 3, 4, 5].map((num) =>
                    renderImageSlot(
                      `ticket_resolved_images${num}`,
                      `Image ${num}`,
                    ),
                  )}
                </CCol>
              </CRow>

              <div className="d-flex justify-content-end">
                <CButton
                  className="my-2"
                  type="submit"
                  size="sm"
                  color="secondary"
                  disabled={!enableUpdateTicket || state.updating}
                >
                  {state.updating ? (
                    <>
                      Updating... <LoadingSpinner />
                    </>
                  ) : (
                    "Update Ticket"
                  )}
                </CButton>
              </div>
            </CForm>
          )}
        </CCardBody>
      </CCard>

      <CModal
        scrollable
        visible={showChecklistModal}
        onClose={() => setShowChecklistModal(false)}
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Checklist: {activePart?.part_replaced || "N/A"}
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setShowChecklistModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {checklistFieldLoading ? (
            <LoadingSpinner />
          ) : checklistFields.length === 0 ? (
            <p className="text-muted">
              No checklist items configured for this part. You can still save.
            </p>
          ) : (
            checklistFields.map((field, index) => (
              <div className="mb-3" key={index}>
                {field.input_type !== "checkbox" && (
                  <CFormLabel className="fw-semibold">
                    {field.field_name
                      .replace(/_/g, " ")
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                    :
                  </CFormLabel>
                )}
                {field.input_type === "text" && (
                  <CFormInput
                    type="text"
                    value={checklistResponses[field.field_name] || ""}
                    onChange={(e) =>
                      updateChecklistResponse(field.field_name, e.target.value)
                    }
                  />
                )}
                {field.input_type === "checkbox" && (
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`check-${index}`}
                      checked={
                        checklistResponses[field.field_name] === "Yes"
                      }
                      onChange={(e) =>
                        updateChecklistResponse(
                          field.field_name,
                          e.target.checked ? "Yes" : "No",
                        )
                      }
                    />
                    <CFormLabel htmlFor={`check-${index}`} className="ms-2">
                      {field.field_name
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </CFormLabel>
                  </div>
                )}
                {field.input_type === "select" && (
                  <CFormSelect
                    value={checklistResponses[field.field_name] || ""}
                    onChange={(e) =>
                      updateChecklistResponse(field.field_name, e.target.value)
                    }
                  >
                    <option value="">-- Select --</option>
                    {(field.input_options || []).map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </CFormSelect>
                )}
              </div>
            ))
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowChecklistModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleSaveChecklist}
            disabled={
              checklistFields.length > 0 && !checklistComplete
            }
          >
            Save Checklist
          </CButton>
        </CModalFooter>
      </CModal>

      {isSiteTechnician && (
        <CModal
          visible={cameraModalVisible}
          onClose={() => setCameraModalVisible(false)}
          size="lg"
          backdrop="static"
        >
          <CModalHeader>
            <CModalTitle>Capture photo</CModalTitle>
          </CModalHeader>
          <CModalBody className="text-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", maxHeight: "60vh", borderRadius: 8 }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => setCameraModalVisible(false)}
            >
              Cancel
            </CButton>
            <CButton color="primary" onClick={captureImage}>
              Capture
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default ResolveServiceTicket;
