import axios from "axios";
import React, { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
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

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        projectDocData: {
          ...state.projectDocData,
          [action.name]: action.value,
        },
      };
    case "UPDATE_ROBOT_DETAILS":
      return {
        ...state,
        robotDetails: action.payload,
      };
    case "UPDATE_HANDOVER_CHECKLIST":
      return {
        ...state,
        handoverChecklist: action.payload,
      };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

const NewProjectClosure = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    projectDocData: {
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
      half_table_length: "",
      full_table_length: "",
      total_no_of_systems: 0,
      modalA_count: 0,
      modalB_count: 0,
      modalT_count: 0,
      ds_setup: "",
      rs_setup: "",
      lora_pole_setup: "",
      lora_pole_coordinated: "",
      robot_details: [],
      handover_checklist: [],
      commissioning_document: "",
      is_portal_access_provided: false,
      is_client_training_conducted: false,
      client_name: "",
      client_role: "",
      client_email: "",
    },
    robotDetails: [{ block: "", automatic: "", semi_automatic: "" }],
    handoverChecklist: [{ task_name: "", status: "", remark: "" }],
    loading: false,
    success: false,
    loadingUpload: false,
  });
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    dispatch({
      type: "SET_FIELD",
      name: name,
      value: type === "checkbox" ? checked : value,
    });
  };

  const addRobot = () => {
    dispatch({
      type: "UPDATE_ROBOT_DETAILS",
      payload: [
        ...state.robotDetails,
        { block: "", automatic: "", semi_automatic: "" },
      ],
    });
  };

  const handleRobotChange = (index, field, value) => {
    const updatedRobots = [...state.robotDetails];
    updatedRobots[index][field] = value;
    dispatch({ type: "UPDATE_ROBOT_DETAILS", payload: updatedRobots });
  };

  const removeRobot = (index) => {
    dispatch({
      type: "UPDATE_ROBOT_DETAILS",
      payload: state.robotDetails.filter((_, i) => i !== index),
    });
  };

  const addHandoverTask = () => {
    dispatch({
      type: "UPDATE_HANDOVER_CHECKLIST",
      payload: [
        ...state.handoverChecklist,
        { task_name: "", status: "", remark: "" },
      ],
    });
  };
  const handleHandoverChange = (index, field, value) => {
    const updatedChecklist = [...state.handoverChecklist];
    updatedChecklist[index][field] = value;
    dispatch({ type: "UPDATE_HANDOVER_CHECKLIST", payload: updatedChecklist });
  };

  const removeHandoverTask = (index) => {
    dispatch({
      type: "UPDATE_HANDOVER_CHECKLIST",
      payload: state.handoverChecklist.filter((_, i) => i !== index),
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
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    if (state.projectDocData.project_name === "") {
      toast.error("Project Name is required!");
    }
    const newdata = {
      ...state.projectDocData,
      commissioning_document: image,
      robot_details: state.robotDetails,
      handover_checklist: state.handoverChecklist,
    };
    try {
      console.log(state.projectDocData);
      const data = await axios.post("/api/v1/projectdocs", newdata, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      console.log(data);
      toast.success("Project Closure Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/master-admin/project-closure`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error Adding Project Closure",
      });

      toast.error(error.response.data.error || "Error Adding Project Closure");
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Project Closure Form</h2>
        </CCardHeader>
        <CCardBody>
          <form>
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
                    value={state.projectDocData.project_name}
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
                    value={state.projectDocData.project_location}
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
                    value={state.projectDocData.prepared_by}
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
                    value={state.projectDocData.project_approved_by}
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
                    value={state.projectDocData.project_start_date}
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
                    value={state.projectDocData.project_completion_date}
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
                    value={state.projectDocData.client_name}
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
                    value={state.projectDocData.client_role}
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
                    value={state.projectDocData.client_email}
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
                    value={state.projectDocData.total_no_of_systems}
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
                    value={state.projectDocData.modalA_count}
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
                    value={state.projectDocData.modalB_count}
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
                    value={state.projectDocData.modalT_count}
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
                    value={state.projectDocData.plant_capacity}
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
                    value={state.projectDocData.water_stored}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Half Table Length
                  </CFormLabel>

                  <CFormInput
                    type="text"
                    className="form-control"
                    name="half_table_length"
                    value={state.projectDocData.half_table_length}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Full Table Length
                  </CFormLabel>

                  <CFormInput
                    type="text"
                    className="form-control"
                    name="full_table_length"
                    value={state.projectDocData.full_table_length}
                    onChange={handleChange}
                  />
                </div>
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
                      checked={state.projectDocData[field] || false}
                      onChange={handleChange}
                    />
                    &nbsp;&nbsp;
                    <CFormLabel htmlFor={field}>
                      {field.replace(/_/g, " ").toUpperCase()}
                    </CFormLabel>
                  </div>
                </CCol>
              ))}

              <CCol md="6">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">DS Setup</CFormLabel>

                  <textarea
                    type="text"
                    className="form-control"
                    name="ds_setup"
                    placeholder="Enter text..."
                    value={state.projectDocData.ds_setup}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">RS Setup</CFormLabel>

                  <textarea
                    type="text"
                    className="form-control"
                    name="rs_setup"
                    placeholder="Enter text..."
                    value={state.projectDocData.rs_setup}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Scope of Work
                  </CFormLabel>

                  <textarea
                    type="text"
                    className="form-control"
                    name="scope_of_work"
                    placeholder="Enter text..."
                    value={state.projectDocData.scope_of_work}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Lora Pole Setup
                  </CFormLabel>

                  <textarea
                    type="text"
                    className="form-control"
                    name="lora_pole_setup"
                    placeholder="Enter text..."
                    value={state.projectDocData.lora_pole_setup}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Lora Pole Coordinates
                  </CFormLabel>

                  <textarea
                    type="text"
                    className="form-control"
                    name="lora_pole_coordinated"
                    placeholder="Enter text..."
                    value={state.projectDocData.lora_pole_coordinated}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Challenges Faced
                  </CFormLabel>

                  <textarea
                    type="text"
                    className="form-control"
                    name="challenges_faced"
                    placeholder="Enter text..."
                    value={state.projectDocData.challenges_faced}
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
                  {state.robotDetails.map((robot, index) => (
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
                  {state.handoverChecklist.map((list, index) => (
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

              <CCol md="3">
                {uploading ? (
                  <div className=" d-flex justify-content-center">
                    <LoadingSpinner />
                  </div>
                ) : image ? (
                  <div className="position-relative d-inline-block">
                    <img
                      src={image}
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
            </CRow>

            <Link onClick={handleSubmit} className="btn btn-warning btn-sm">
              {state.loading ? (
                <>
                  Saving...
                  <LoadingSpinner />
                </>
              ) : (
                "Save to Draft"
              )}
            </Link>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};
export default NewProjectClosure;
