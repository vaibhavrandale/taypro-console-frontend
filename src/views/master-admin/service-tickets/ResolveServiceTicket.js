/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useReducer, useState } from "react";
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
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilX } from "@coreui/icons";
import "./servicetickts.css";
import { FaArrowUp } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, ticket: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_SERVICE_ITEMS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SERVICE_ITEMS_SUCCESS":
      return { ...state, serviceitems: action.payload, loading: false };
    case "FETCH_SERVICE_ITEMS_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_SUCCESS":
      return { ...state, updating: false, success: true };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
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

const ResolveServiceTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [state, dispatch] = useReducer(reducer, {
    ticket: {},
    inventories: [],
    loadingInventories: true,
    loading: true,
    loadingUpload: false,
    error: "",
    updating: false,
    success: false,
    faultsloading: true,
    faulterror: "",
    inventoryerror: "",
    serviceticketsfault: [],
  });
  const [formData, setFormData] = useState({});
  const [uploadingFields, setUploadingFields] = useState({});
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [checklistFields, setChecklistFields] = useState([]);
  const [checklistResponses, setChecklistResponses] = useState([]);
  const [partChecklist, setPartChecklist] = useState([]);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/v1/servicetickets/getone/${id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
        setFormData(response.data.data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.response.data.error });
      }
    };
    const fetchAllFaults = async () => {
      try {
        dispatch({ type: "FETCH_FAULTS_REQUEST" });
        const response = await axios.get(
          "/api/v1/serviceticketsfaults/all-serviceticketsfaults-without-pg",
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_FAULTS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };

    const fetchInventories = async () => {
      dispatch({ type: "FETCH_INVENTORY_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/service-inventory`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
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
  }, [id, authtoken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenChecklistModal = async () => {
    try {
      const result = await axios.get(
        `/api/v1/faultanalysis/${formData.part_replaced_id}`,
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      const fields = result.data.data?.[0]?.checklist_fields || [];
      setChecklistFields(fields);
      setChecklistResponses([]);
      setShowChecklistModal(true);
    } catch (err) {
      toast.error("Checklist not found or error loading checklist");
    }
  };

  const updateChecklistResponse = (fieldName, value) => {
    setChecklistResponses((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (item) => Object.keys(item)[0] === fieldName
      );

      if (index !== -1) {
        updated[index] = { [fieldName]: value };
      } else {
        updated.push({ [fieldName]: value });
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });

    // Create a copy of formData excluding last_activity
    const { createdAt, _id, last_activity, ...filteredFormData } = formData;
    filteredFormData.part_checklist = partChecklist;

    try {
      await axios.put(
        `/api/v1/servicetickets/resolve/${id}`,
        filteredFormData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(
        `${filteredFormData.ticket_id} Service ticket Resolved successfully`
      );
      navigate(`/${adminroute}/service-tickets`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: error.response.data.error });
      toast.error(error.response.data.error);
    }
  };

  const deleteFileHandler = async (fileName) => {
    setFormData((prevData) => ({
      ...prevData,
      [`ticket_generated_images${fileName}`]: "",
    }));
  };
  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    if (files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingFields((prev) => ({ ...prev, [name]: true })); // ✅ Set only this field to loading

      const response = await axios.post(
        "/api/v1/image-upload/service-tickets",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      // ✅ Update uploaded image dynamically for the specific field
      setFormData((prevData) => ({
        ...prevData,
        [name]: response.data.url, // Assuming backend returns { url: "uploaded_image_url" }
      }));

      setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading for this input
    } catch (error) {
      setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading on error
      console.error("File upload error:", error);
    }
  };
  const [searchInventoryTerm, setSearchInventoryTerm] = useState("");

  const filteredInventories = state.inventories?.filter((inv) =>
    `${inv.item_name} ${inv.item_code}`
      .toLowerCase()
      .includes(searchInventoryTerm.toLowerCase())
  );

  const isTicketResolved = formData.ticket_resolved === true;

  const isPartSelected = !!formData.part_replaced_id;
  const isQuantityValid =
    formData.replaced_part_quantity &&
    Number(formData.replaced_part_quantity) > 0;

  // Checklist is considered saved if partChecklist has been set at all
  const isChecklistSaved = partChecklist.some(
    (entry) => entry.part_id === formData.part_replaced_id
  );

  const enableUpdateTicket =
    isTicketResolved &&
    (!isPartSelected || // Case 1
      (isPartSelected && isQuantityValid && isChecklistSaved)); // Case 2

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
            <div className="d-flex justify-content-center align-items-center w-100 ">
              <p className="badge bg-danger p-2">{state.error}</p>
            </div>
          ) : (
            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Non-editable fields */}
                <CFormInput
                  type="hidden"
                  name="ticket_id"
                  value={formData.ticket_id || ""}
                  readOnly
                />
                {/* Editable fields */}
                <CCol md={6}>
                  <CFormInput
                    label="Robot No"
                    name="robot_no"
                    value={formData.robot_no || ""}
                    readOnly
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Deveui"
                    name="deveui"
                    value={formData.deveui || ""}
                    readOnly
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Block"
                    name="block"
                    value={formData.block || ""}
                    readOnly
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Robot Type"
                    name="robot_type"
                    value={formData.robot_type || ""}
                    readOnly
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Site ID"
                    name="site_id"
                    value={formData.site_id || ""}
                    readOnly
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Company"
                    name="company"
                    value={formData.company || ""}
                    readOnly
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Lora No"
                    name="lora_no"
                    value={formData.lora_no || ""}
                    readOnly
                  />
                </CCol>
                <CCol md={6}>
                  {state.faultsloading ? (
                    <LoadingSpinner />
                  ) : state.faulterror ? (
                    <span className="badge bg-danger p-2">
                      {state.faulterror}
                    </span>
                  ) : (
                    <CFormSelect
                      label="Fault Type"
                      name="fault_type"
                      value={formData.fault_type}
                      onChange={(e) =>
                        setFormData({ ...formData, fault_type: e.target.value })
                      }
                      className="mb-3 "
                    >
                      <option value="">Select Fault Type</option>
                      {state.serviceticketsfault
                        ? state.serviceticketsfault.map((fault, index) => (
                            <option key={index} value={fault.fault_name}>
                              {fault.fault_name.replace(/-/g, " ")}
                            </option>
                          ))
                        : []}
                    </CFormSelect>
                  )}
                </CCol>

                {/* Ticket Resolution Info */}
                {formData.ticket_resolved_at ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved At"
                      name="ticket_resolved_at"
                      value={formData.ticket_resolved_at || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}
                {formData.ticket_resolved_by ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved By"
                      name="ticket_resolved_by"
                      value={formData.ticket_resolved_by || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}
                {formData.ticket_resolved_by_email ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved By Email"
                      name="ticket_resolved_by_email"
                      value={formData.ticket_resolved_by_email || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}
                {formData.ticket_resolved_at ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved By User ID"
                      name="ticket_resolved_by_user_id"
                      value={formData.ticket_resolved_by_user_id || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}

                {/* Move the Ticket Resolved field to a new row */}
                <CCol md={12}>
                  <CFormSelect
                    label="Ticket Resolved"
                    name="ticket_resolved"
                    value={String(formData.ticket_resolved)}
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

                {/* Move the Ticket Resolving Notes field to a new row */}
                <CCol md={12}>
                  <CFormTextarea
                    label="Ticket Resolving Notes"
                    name="ticket_resolving_notes"
                    value={formData.ticket_resolving_notes || ""}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6}>
                  {state.loadingInventories ? (
                    <LoadingSpinner />
                  ) : state.inventoryerror ? (
                    <span className="badge bg-danger p-2">
                      {state.inventoryerror}
                    </span>
                  ) : (
                    <>
                      <CFormLabel htmlFor="inventorySearch">
                        Select a part If Replaced
                      </CFormLabel>
                      <CInputGroup className="mb-2">
                        <CFormInput
                          type="text"
                          placeholder="Search item name or code..."
                          value={
                            searchInventoryTerm || formData.part_replaced || ""
                          }
                          onChange={(e) => {
                            setSearchInventoryTerm(e.target.value);
                            setFormData({
                              ...formData,
                              part_replaced_id: "",
                              part_replaced: "",
                            });
                          }}
                        />
                        <CButton
                          type="button"
                          color="primary"
                          className="btn-sm"
                          disabled={!formData.part_replaced_id}
                          onClick={handleOpenChecklistModal}
                        >
                          <FaArrowUp />
                        </CButton>
                      </CInputGroup>

                      {searchInventoryTerm && (
                        <CListGroup
                          className="mb-3"
                          style={{
                            maxHeight: "250px",
                            overflowY: "auto",
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "0.375rem",
                            backgroundColor: "#fff",
                          }}
                        >
                          {filteredInventories.length === 0 ? (
                            <CListGroupItem>
                              No matching parts found
                            </CListGroupItem>
                          ) : (
                            filteredInventories.map((inventory, index) => (
                              <CListGroupItem
                                key={index}
                                action
                                style={{ cursor: "pointer", padding: "10px" }}
                                onClick={() => {
                                  setSearchInventoryTerm(""); // hide dropdown after selection
                                  setFormData({
                                    ...formData,
                                    part_replaced_id: inventory.item_id,
                                    part_replaced: `${inventory.item_name} - ${inventory.item_code}`,
                                  });
                                }}
                              >
                                {inventory.item_name} - {inventory.item_code}
                              </CListGroupItem>
                            ))
                          )}
                        </CListGroup>
                      )}
                    </>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Part Replaced Quantity"
                    name="replaced_part_quantity"
                    type="number"
                    className="form-control-lg"
                    value={formData.replaced_part_quantity}
                    onChange={handleChange}
                  />
                </CCol>

                {[1, 2, 3, 4, 5].map((num, index) => (
                  <CRow key={index}>
                    <CCol md={2} xs={5}>
                      <div className="container-btn-file p-2 my-2 w-80">
                        <CIcon icon={cilCloudUpload} className="upload-icon" />
                        {`Image ${num}`}
                        <input
                          className="file"
                          name={`ticket_resolved_images${num}`}
                          type="file"
                          onChange={handleFileChange}
                          disabled={
                            uploadingFields[`ticket_resolved_images${num}`]
                          }
                        />
                      </div>
                    </CCol>
                    <CCol md={3} sm={2}>
                      {uploadingFields[`ticket_resolved_images${num}`] ? ( // ✅ Show loader only for the uploading input
                        <div className="mt-2 d-flex justify-content-center">
                          <LoadingSpinner />
                        </div>
                      ) : formData[`ticket_resolved_images${num}`] ? (
                        <div className="my-2">
                          <img
                            src={formData[`ticket_resolved_images${num}`]}
                            alt={`Resolved Image ${num}`}
                            width="80"
                            height="80"
                            style={{ objectFit: "cover", borderRadius: "5px" }}
                          />
                          <CBadge
                            color="primary"
                            // position="absolute"
                            top="0"
                            left="0"
                            shape="rounded-pill"
                            className=" p-1"
                          >
                            <CIcon
                              icon={cilX}
                              cursor="pointer"
                              onClick={() => deleteFileHandler(num)}
                              title="Remove file"
                            />
                          </CBadge>
                        </div>
                      ) : null}
                    </CCol>
                  </CRow>
                ))}
              </CRow>

              <div className="d-flex justify-content-end">
                <CButton
                  className="my-2"
                  type="submit"
                  size="sm"
                  color="secondary"
                  disabled={
                    !enableUpdateTicket || state.updating || state.loadingUpload
                  }
                >
                  {state.updating || state.loadingUpload ? (
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
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Part Replacement Checklist for: {formData.part_replaced || "N/A"}
          </CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setShowChecklistModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {checklistFields.length === 0 ? (
            <p className="text-muted">
              No checklist items found for this part.
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
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    :
                  </CFormLabel>
                )}

                {field.input_type === "text" && (
                  <CFormInput
                    type="text"
                    value={partChecklist.field_name}
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
                      value={partChecklist.field_name}
                      id={`check-${index}`}
                      onChange={(e) =>
                        updateChecklistResponse(
                          field.field_name,
                          e.target.checked ? "Yes" : "No"
                        )
                      }
                    />
                    <CFormLabel htmlFor={`check-${index}`} className="ms-2">
                      {field.field_name
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </CFormLabel>
                  </div>
                )}

                {field.input_type === "select" && (
                  <CFormSelect
                    value={partChecklist.field_name}
                    onChange={(e) =>
                      updateChecklistResponse(field.field_name, e.target.value)
                    }
                  >
                    <option value="">-- Select --</option>
                    {field.input_options.map((opt, i) => (
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
            onClick={() => {
              const checklistObject = {};
              checklistResponses.forEach((entry) => {
                const key = Object.keys(entry)[0];
                const value = entry[key];
                checklistObject[key] = value;
              });

              setPartChecklist([
                {
                  part_id: formData.part_replaced_id,
                  checklist: checklistResponses,
                },
              ]);
              setShowChecklistModal(false);
            }}
            disabled={
              checklistFields.length === 0 ||
              Object.values(checklistResponses).every(
                (val) => !val || String(val).trim() === ""
              )
            }
          >
            Save Checklist
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ResolveServiceTicket;
