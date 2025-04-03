import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilMinus, cilPlus, cilX } from "@coreui/icons";
import "../service-tickets/servicetickts.css";

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, projectdoc: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    case "UPDATE_ROBOT_DETAILS":
      return {
        ...state,
        robot_details: action.payload,
      };
    case "UPDATE_HANDOVER_CHECKLIST":
      return {
        ...state,
        handover_checklist: action.payload,
      };

    default:
      return state;
  }
};

const UpdateProjectClosureForm = () => {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    updating: false,
    loadingUpload: false,
    robot_details: [{ block: "", automatic: "", semi_automatic: "" }],
    handover_checklist: [{ task_name: "", status: "", remark: "" }],
  });

  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [serviceItemData, setServiceItemData] = useState({
    project_name: "",
    project_location: "",
    prepared_by: "",
    project_start_date: "",
    project_completion_date: "",
    project_approved_by: "",
    scope_of_work: "",
    challenges_faced: "",
    plant_capacity: "",
    water_stored: "",
    total_no_of_systems: 0,
    modalA_count: 0,
    modalB_count: 0,
    modalT_count: 0,
    ds_setup: "",
    rs_setup: "",
    lora_pole_setup: "",
    lora_pole_coordinated: "",
    robot_details: [{ block: "", automatic: "", semi_automatic: "" }],
    handover_checklist: [{ task_name: "", status: "", remark: "" }],
    commissioning_document: "",
    is_portal_access_provided: false,
    is_client_training_conducted: false,
    client_name: "",
    client_role: "",
    client_email: "",
  });

  useEffect(() => {
    const fetchServiceItem = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/v1/projectdocs/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        console.log(data.data);

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
        setServiceItemData(data.data);
        setImage(data.data.item_image);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchServiceItem();
  }, [id, authtoken]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setServiceItemData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addRobot = () => {
    dispatch({
      type: "UPDATE_ROBOT_DETAILS",
      payload: [
        ...serviceItemData.robot_details,
        { block: "", automatic: "", semi_automatic: "" },
      ],
    });
  };

  const handleRobotChange = (index, field, value) => {
    const updatedRobots = [...serviceItemData.robot_details];
    updatedRobots[index][field] = value;
    dispatch({ type: "UPDATE_ROBOT_DETAILS", payload: updatedRobots });
  };

  const removeRobot = (index) => {
    dispatch({
      type: "UPDATE_ROBOT_DETAILS",
      payload: serviceItemData.robot_details.filter((_, i) => i !== index),
    });
  };

  const addHandoverTask = () => {
    dispatch({
      type: "UPDATE_HANDOVER_CHECKLIST",
      payload: [
        ...serviceItemData.handover_checklist,
        { task_name: "", status: "", remark: "" },
      ],
    });
  };
  const handleHandoverChange = (index, field, value) => {
    const updatedChecklist = [...serviceItemData.handover_checklist];
    updatedChecklist[index][field] = value;
    dispatch({ type: "UPDATE_HANDOVER_CHECKLIST", payload: updatedChecklist });
  };

  const removeHandoverTask = (index) => {
    dispatch({
      type: "UPDATE_HANDOVER_CHECKLIST",
      payload: serviceItemData.handover_checklist.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        "/api/v1/image-upload/commissioning-document",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      setImage(data.url);
      toast.success("Image uploaded successfully. Click Update to apply it.");
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImageHandler = () => {
    setImage("");
    toast.success("Image removed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix: Prevent default form submission

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const {
        createdAt,
        _id,
        item_id,
        updatedAt,
        last_activity,

        ...filteredFormData
      } = serviceItemData;

      const newData = {
        ...filteredFormData,
        item_image: image,
        robot_details: serviceItemData.robot_details,
        handover_checklist: serviceItemData.handover_checklist,
      };
      await axios.put(`/api/v1/projectdocs/${id}`, newData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Project Document Updated Successfully!");

      navigate(`/master-admin/project-closure`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: "Update failed" });
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          Update Project Closure Form -{" "}
          <b className="badge bg-success">{serviceItemData.project_name}</b>
        </CCardHeader>
        {state.loading ? (
          <LoadingSpinner />
        ) : state.error ? (
          <CAlert color="danger">{state.error}</CAlert>
        ) : (
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Project Name
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="project_name"
                      value={serviceItemData.project_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Project Location
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="project_location"
                      value={serviceItemData.project_location || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Prepared By
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="prepared_by"
                      value={serviceItemData.prepared_by || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Project Approved By
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="project_approved_by"
                      value={serviceItemData.project_approved_by || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Project Start Date
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      className="form-control"
                      name="project_start_date"
                      value={
                        serviceItemData.project_start_date
                          ? new Date(serviceItemData.project_start_date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Project End Date
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      className="form-control"
                      name="project_completion_date"
                      value={
                        serviceItemData.project_completion_date
                          ? new Date(serviceItemData.project_completion_date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Client Name
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="client_name"
                      value={serviceItemData.client_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Client Role
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="client_role"
                      value={serviceItemData.client_role || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Client Email
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="client_email"
                      value={serviceItemData.client_email || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Total Systems Count
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="total_no_of_systems"
                      value={serviceItemData.total_no_of_systems || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Model A Count
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="modalA_count"
                      value={serviceItemData.modalA_count || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Model B Count
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="modalB_count"
                      value={serviceItemData.modalB_count || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Model T Count
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="modalT_count"
                      value={serviceItemData.modalT_count || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Plant Capacity(MW)
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="plant_capacity"
                      value={serviceItemData.plant_capacity || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Water Stored(ltr)
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="form-control"
                      name="water_stored"
                      value={serviceItemData.water_stored || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      DS Setup
                    </CFormLabel>
                    <textarea
                      type="text"
                      className="form-control"
                      name="ds_setup"
                      value={serviceItemData.ds_setup || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      RS Setup
                    </CFormLabel>
                    <textarea
                      type="text"
                      className="form-control"
                      name="rs_setup"
                      value={serviceItemData.rs_setup || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Scope of Work
                    </CFormLabel>
                    <textarea
                      type="text"
                      className="form-control"
                      name="scope_of_work"
                      value={serviceItemData.scope_of_work || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Lora Pole Setup
                    </CFormLabel>
                    <textarea
                      type="text"
                      className="form-control"
                      name="lora_pole_setup"
                      value={serviceItemData.lora_pole_setup || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Lora Pole Coordinated
                    </CFormLabel>
                    <textarea
                      type="text"
                      className="form-control"
                      name="lora_pole_coordinated"
                      value={serviceItemData.lora_pole_coordinated || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Challenges Faced
                    </CFormLabel>
                    <textarea
                      type="text"
                      className="form-control"
                      name="challenges_faced"
                      value={serviceItemData.challenges_faced || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </CCol>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Robot Details</h6>
                  <CButton color="primary" size="sm" onClick={addRobot}>
                    <CIcon
                      icon={cilPlus}
                      size="md"
                      style={{ fontWeight: "bold" }}
                    />
                  </CButton>
                </div>

                <CTable
                  bordered
                  hover
                  responsive
                  className="text-center shadow-sm"
                >
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Block</CTableHeaderCell>
                      <CTableHeaderCell>Automatic</CTableHeaderCell>
                      <CTableHeaderCell>Semi-Automatic</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {state.robot_details.map((robot, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            className="form-control"
                            value={robot.block}
                            onChange={(e) =>
                              handleRobotChange(index, "block", e.target.value)
                            }
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            className="form-control"
                            value={robot.automatic}
                            onChange={(e) =>
                              handleRobotChange(
                                index,
                                "automatic",
                                e.target.value
                              )
                            }
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            className="form-control"
                            value={robot.semi_automatic}
                            onChange={(e) =>
                              handleRobotChange(
                                index,
                                "semi_automatic",
                                e.target.value
                              )
                            }
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => removeRobot(index)}
                            style={{
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              padding: "0",
                            }}
                          >
                            <CIcon
                              icon={cilMinus}
                              size="sm"
                              style={{ fontWeight: "bold" }}
                            />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Handover Checklist</h6>
                  <CButton color="primary" size="sm" onClick={addHandoverTask}>
                    <CIcon
                      icon={cilPlus}
                      size="md"
                      style={{ fontWeight: "bold" }}
                    />
                  </CButton>
                </div>

                <CTable
                  bordered
                  hover
                  responsive
                  className="text-center shadow-sm"
                >
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Task Name</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Remark</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {state.handover_checklist.map((list, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            className="form-control"
                            value={list.task_name}
                            onChange={(e) =>
                              handleHandoverChange(
                                index,
                                "task_name",
                                e.target.value
                              )
                            }
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            className="form-control"
                            value={list.status}
                            onChange={(e) =>
                              handleHandoverChange(
                                index,
                                "status",
                                e.target.value
                              )
                            }
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            className="form-control"
                            value={list.remark}
                            onChange={(e) =>
                              handleHandoverChange(
                                index,
                                "remark",
                                e.target.value
                              )
                            }
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => removeHandoverTask(index)}
                            style={{
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              padding: "0",
                            }}
                          >
                            <CIcon
                              icon={cilMinus}
                              size="sm"
                              style={{ fontWeight: "bold" }}
                            />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                <CCol md="3">
                  <div className="mb-3">
                    <CFormLabel className="form-CFormLabel">
                      Upload Commissioning Document
                    </CFormLabel>
                    <div className="container-btn-file p-2 m-2 w-80">
                      <CIcon icon={cilCloudUpload} className="upload-icon" />
                      <CFormInput
                        type="file"
                        name="commissioning_document"
                        onChange={handleImageUpload}
                        className="mb-3 file"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </CCol>

                <CCol md="3" className="d-flex align-items-center">
                  {uploading ? (
                    <div className="d-flex justify-content-center w-100">
                      <LoadingSpinner />
                    </div>
                  ) : image || serviceItemData.item_image ? (
                    <div className="d-flex align-items-center">
                      <img
                        src={image || serviceItemData.item_image}
                        alt="Uploaded Item"
                        width="100"
                        height="100"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                      <CBadge
                        color="primary"
                        className="p-1 position-absolute"
                        style={{
                          top: "-8px",
                          right: "-8px",
                          cursor: "pointer",
                          borderRadius: "50%",
                          backgroundColor: "red",
                        }}
                        onClick={deleteImageHandler}
                      >
                        <CIcon icon={cilX} size="sm" />
                      </CBadge>
                    </div>
                  ) : null}
                </CCol>

                {[
                  "is_portal_access_provided",
                  "is_client_training_conducted",
                ].map((field) => (
                  <CCol key={field} md={3} className="my-2">
                    <div className="flex items-center space-x-2 my-2">
                      <CFormCheck
                        id={field}
                        name={field}
                        checked={serviceItemData[field] || false}
                        onChange={handleChange}
                      />
                      &nbsp;&nbsp;
                      <CFormLabel htmlFor={field}>
                        {field.replace(/_/g, " ").toUpperCase()}
                      </CFormLabel>
                    </div>
                  </CCol>
                ))}
              </CRow>

              <button
                type="submit"
                className="btn btn-warning btn-sm"
                disabled={state.updating}
              >
                {state.updating ? "Updating..." : "Update"}
              </button>
            </form>
          </CCardBody>
        )}
      </CCard>
    </div>
  );
};

export default UpdateProjectClosureForm;
