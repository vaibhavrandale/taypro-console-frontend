import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "./projectDoc.css";
import jsPDF from "jspdf";
import { CButton } from "@coreui/react";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, projectdoc: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewProjectClosureDocument = () => {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    updating: false,
  });
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);

  const [serviceItemData, setServiceItemData] = useState({});

  useEffect(() => {
    const fetchProjectHandoverDoc = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/v1/projectdocs/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });

        setServiceItemData(data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchProjectHandoverDoc();
  }, [id, authtoken]);

  const exportToPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    const element = document.querySelector(".container");

    doc.html(element, {
      callback: function (doc) {
        doc.save("Project_Closure.pdf");
      },
      x: 20,
      y: 20,
      autoPaging: true,
      html2canvas: {
        scale: 0.6, // match 1:1 styling, or try 0.8 if text overflows
        useCORS: true,
        logging: true,
      },
    });
  };

  return (
    <div>
      <CButton onClick={exportToPDF}>Export</CButton>
      <div className="container">
        <h2>Taypro Pvt. Ltd. Project to Service Handover Document</h2>
        <div className="section-title">1. Introduction</div>
        <p>
          This document serves as a formal handover from the Project Team to the
          Service Team for the successful completion and transition of{" "}
          <b>{serviceItemData.project_name}</b>. The handover ensures that all
          relevant details, responsibilities, and documentation are shared
          effectively to enable seamless operation and maintenance of the
          system.
        </p>
        <div className="compact">
          <p>
            <span className="label">
              Project&nbsp;&nbsp;Name&nbsp;&nbsp;:&nbsp;&nbsp;
            </span>{" "}
            {serviceItemData.project_name}
          </p>
          <p>
            <span className="label">Project Location:</span>{" "}
            {serviceItemData.project_location}
          </p>
          <p>
            <span className="label">Project Completion Date:</span>{" "}
            {serviceItemData.project_completion_date
              ? new Date(serviceItemData.project_completion_date)
                  .toISOString()
                  .split("T")[0]
              : ""}
          </p>
          <p>
            <span className="label">Prepared By:</span>{" "}
            {serviceItemData.prepared_by}
          </p>

          <p>
            <span className="label">Approved By:</span>{" "}
            {serviceItemData.project_approved_by}
          </p>
        </div>
        <div className="section-title">2. Project Overview</div>
        <ul>
          <li>
            <span class="label">Scope of Work:</span>&nbsp;
            {serviceItemData.scope_of_work}
          </li>
          <li>
            <strong>Key Milestones Achieved:</strong> For{" "}
            {serviceItemData.plant_capacity}MW, {serviceItemData.water_stored}
            liters per year water is being saved.
          </li>
          <li>
            <strong>Project Duration:</strong>{" "}
            {serviceItemData.project_completion_date
              ? new Date(serviceItemData.project_completion_date)
                  .toISOString()
                  .split("T")[0]
              : ""}{" "}
            to{" "}
            {serviceItemData.project_start_date
              ? new Date(serviceItemData.project_start_date)
                  .toISOString()
                  .split("T")[0]
              : ""}
          </li>
          <li>
            <strong>Challenges Faced:</strong>{" "}
            {serviceItemData.challenges_faced}
          </li>
        </ul>
        <div className="section-title">3. System Details</div>
        <ul>
          <li>
            <strong>Total Number of Systems Installed:</strong>{" "}
            {serviceItemData.total_no_of_systems} Systems
          </li>
          <li>
            <strong>Model/Type of Systems:</strong>
            <ul>
              <li>
                Model A – Automatic Systems ({serviceItemData.modalA_count})
              </li>
              <li>
                Model B – Semi-Automatic Systems ({serviceItemData.modalB_count}
                )
              </li>
              <li>
                Model T – Tracker Systems ({serviceItemData.modalT_count})
              </li>
            </ul>
          </li>
          <li>
            <strong>DS Setup Installed:</strong> {serviceItemData.ds_setup}
          </li>
          <li>
            <strong>RS Setup Installed:</strong> {serviceItemData.rs_setup}
          </li>
          <li>
            <strong>LoRa Pole Setup:</strong>
            {serviceItemData.lora_pole_setup}
          </li>
          <li>
            <strong>LoRa Pole Coordinates:</strong>{" "}
            {serviceItemData.lora_pole_coordinated}
          </li>
        </ul>
        <div className="end-page"></div>
        <div className="section-title">4. Site Details</div>
        <table>
          <thead>
            <tr>
              <th>BLOCK</th>
              <th>AUTOMATIC</th>
              <th>SEMI-AUTOMATIC</th>
            </tr>
          </thead>
          <tbody>
            {serviceItemData.robot_details?.map((item, index) => (
              <tr key={index}>
                <td>{item.block}</td>
                <td>{item.automatic}</td>
                <td>{item.semi_automatic}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="section-title">6. Handover Checklist</div>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Status (✔)</th>
              <th>Remarks (If Any)</th>
            </tr>
          </thead>
          <tbody>
            {serviceItemData.handover_checklist?.map((item, index) => (
              <tr key={index}>
                <td>{item.task_name}</td>
                <td>{item.status}</td>
                <td>{item.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="end-page"></div>
        <div className="section-title">7. Handover Documents & Details</div>
        <ul>
          <li>
            <strong>Portal Access Provided:</strong>{" "}
            {serviceItemData.is_portal_access_provided ? "Yes" : "No"}
          </li>
          <li>
            <strong>Client Training Conducted:</strong>{" "}
            {serviceItemData.is_client_training_conducted ? "Yes" : "No"}
          </li>
          <li>
            <strong>Commissioning Documents:</strong>{" "}
            <Link target="blank" to={serviceItemData.commissioning_document}>
              Click Here
            </Link>
          </li>
        </ul>
        <div className="section-title">8. Points of Contact</div>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>E-Mail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project Team Lead</td>
              <td>Jitesh Kute</td>
              <td>jitesh.kute@taypro.in</td>
            </tr>
            <tr>
              <td>Asst. Service Manager</td>
              <td>Abhay Singh</td>
              <td>abhay.singh@taypro.in</td>
            </tr>
            <tr>
              <td>{serviceItemData.client_role}</td>
              <td>{serviceItemData.client_name}</td>
              <td>{serviceItemData.client_email}</td>
            </tr>
          </tbody>
        </table>
        <div className="signature-section">
          <div className="signature-box">
            <p>
              <strong>Project Team</strong>
            </p>
            <p>Name: {serviceItemData.created_by?.name}</p>
            <p>Designation: {serviceItemData.created_by?.designation || ""}</p>
            <p className="signature-line">
              Signature:{" "}
              <span style={{ fontWeight: "bold", color: "green" }}>
                Verified
              </span>
            </p>

            <p>
              Date:{" "}
              {serviceItemData.created_by?.timestamp
                ? new Date(serviceItemData.created_by.timestamp)
                    .toISOString()
                    .split("T")[0]
                : ""}
            </p>
          </div>
          <br />
          <div className="signature-box">
            <p>
              <strong>Service Team</strong>
            </p>
            <p>Name: {serviceItemData.approval_sent_by?.name || ""}</p>
            <p>
              Designation: {serviceItemData.approval_sent_by?.designation || ""}{" "}
            </p>
            <p className="signature-line">
              Signature:{" "}
              <span style={{ fontWeight: "bold", color: "green" }}>
                Verified
              </span>
            </p>
            <p>
              Date:{" "}
              {serviceItemData.approval_sent_by?.timestamp
                ? new Date(serviceItemData.approval_sent_by.timestamp)
                    .toISOString()
                    .split("T")[0]
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectClosureDocument;
