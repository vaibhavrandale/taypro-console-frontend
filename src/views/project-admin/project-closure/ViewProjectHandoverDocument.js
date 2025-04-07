import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "./projectDoc.css";
import jsPDF from "jspdf";
import { CButton } from "@coreui/react";
import header from "../../../assets/brand/logoforwhitebg.png";
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

const ViewProjectHandoverDocument = () => {
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

  // const exportToPDF = () => {
  //   const doc = new jsPDF("p", "pt", "a4");

  //   const element = document.querySelector(".container");

  //   doc.html(element, {
  //     callback: function (doc) {
  //       doc.save("Project_Handover.pdf");
  //     },
  //     x: 20,
  //     y: 20,
  //     autoPaging: true,
  //     html2canvas: {
  //       scale: 0.6, // match 1:1 styling, or try 0.8 if text overflows
  //       useCORS: true,
  //       logging: true,
  //     },
  //   });
  // };
  const exportToPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    const element = document.querySelector(".second-container");

    doc.html(element, {
      callback: function (doc) {
        doc.save("Project_Handover.pdf");
      },
      x: 20,
      y: 20,
      autoPaging: true,
      html2canvas: {
        scale: 0.6,
        useCORS: true,
        logging: true,
      },
    });
  };
  return (
    <div className="main-container">
      <CButton onClick={exportToPDF}>Export</CButton>
      <div className="second-container">
        <table className="site-details-table ">
          <thead>
            <tr className="">
              <td colSpan={1} className="text-center">
                <img
                  src={header}
                  alt="Taypro Logo"
                  className="sidebar-brand-full logo"
                  style={{
                    height: "50px",
                    width: "110px",
                    objectFit: "contain",
                  }}
                />
              </td>
              <td colSpan={2} className="text-center">
                <h5>Project to Service Handover Document</h5>
              </td>
              <td colSpan={1}>Doc. No. : TPL-12</td>

              {/* <td colSpan={1}>Rev. No.: 1</td>
    
                  <td>Revised By</td>
                  <td className="fw-bold">Abhay Singh</td>
                  <td>Start Date</td>
                  <td className="fw-bold">22/04/2025</td> */}
            </tr>
          </thead>
        </table>
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
              Project&nbsp;&nbsp;Name&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
            </span>{" "}
            {serviceItemData.project_name}
          </p>
          <p>
            <span className="label">
              Project&nbsp;&nbsp;Location&nbsp;&nbsp;:
            </span>{" "}
            {serviceItemData.project_location}
          </p>
          <p>
            <span className="label">
              Project&nbsp;&nbsp;Completion&nbsp;&nbsp;Date&nbsp;&nbsp;:
            </span>{" "}
            {serviceItemData.project_completion_date
              ? new Date(serviceItemData.project_completion_date)
                  .toISOString()
                  .split("T")[0]
              : ""}
          </p>
          <p>
            <span className="label">Prepared&nbsp;&nbsp;By&nbsp;&nbsp;:</span>{" "}
            {serviceItemData.prepared_by}
          </p>

          <p>
            <span className="label">Approved&nbsp;&nbsp;By&nbsp;&nbsp;:</span>{" "}
            {serviceItemData.project_approved_by}
          </p>
        </div>
        <div className="section-title">2. Project&nbsp;&nbsp;Overview</div>
        <ul>
          <li>
            <span class="label">
              Scope&nbsp;&nbsp;of&nbsp;&nbsp;Work&nbsp;&nbsp;:
            </span>
            &nbsp;
            {serviceItemData.scope_of_work}
          </li>
          <li>
            <strong>
              Key&nbsp;&nbsp;Milestones&nbsp;&nbsp;Achieved&nbsp;&nbsp;:
            </strong>{" "}
            For {serviceItemData.plant_capacity}MW,{" "}
            {serviceItemData.water_stored}
            liters per year water is being saved.
          </li>
          <li>
            <strong>Project&nbsp;&nbsp;Duration&nbsp;&nbsp;:</strong>{" "}
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
            <strong>Challenges&nbsp;&nbsp;Faced&nbsp;&nbsp;:</strong>{" "}
            {serviceItemData.challenges_faced}
          </li>
        </ul>
        <div className="section-title">3. System&nbsp;&nbsp;Details</div>
        <ul>
          <li>
            <strong>
              Total&nbsp;&nbsp;Number&nbsp;&nbsp;of&nbsp;&nbsp;Systems&nbsp;&nbsp;Installed&nbsp;&nbsp;:
            </strong>{" "}
            {serviceItemData.total_no_of_systems} Systems
          </li>
          <li>
            <strong>
              Model&nbsp;&nbsp;/&nbsp;&nbsp;Type&nbsp;&nbsp;of&nbsp;&nbsp;Systems&nbsp;&nbsp;:
            </strong>
            <ul>
              <li style={{ listStyleType: "none" }}>
                1)&nbsp;&nbsp;Model&nbsp;&nbsp;A&nbsp;&nbsp;–&nbsp;&nbsp;Automatic&nbsp;&nbsp;Systems&nbsp;&nbsp;
                {serviceItemData.modalA_count}
              </li>
              <li style={{ listStyleType: "none" }}>
                2)&nbsp;&nbsp;Model&nbsp;&nbsp;B&nbsp;&nbsp;–&nbsp;&nbsp;Semi-Automatic&nbsp;&nbsp;Systems
                ({serviceItemData.modalB_count})
              </li>
              <li style={{ listStyleType: "none" }}>
                3)&nbsp;&nbsp;Model&nbsp;&nbsp;T&nbsp;&nbsp;–&nbsp;&nbsp;Tracker&nbsp;&nbsp;Systems
                ({serviceItemData.modalT_count})
              </li>
            </ul>
          </li>
          <li>
            <strong>
              DS&nbsp;&nbsp;Setup&nbsp;&nbsp;Installed&nbsp;&nbsp;:
            </strong>{" "}
            {serviceItemData.ds_setup}
          </li>
          <li>
            <strong>
              RS&nbsp;&nbsp;Setup&nbsp;&nbsp;Installed&nbsp;&nbsp;:
            </strong>{" "}
            {serviceItemData.rs_setup}
          </li>
          <li>
            <strong>LoRa&nbsp;&nbsp;Pole&nbsp;&nbsp;Setup&nbsp;&nbsp;:</strong>
            {serviceItemData.lora_pole_setup}
          </li>
          <li>
            <strong>
              LoRa&nbsp;&nbsp;Pole&nbsp;&nbsp;Coordinates&nbsp;&nbsp;:
            </strong>{" "}
            {serviceItemData.lora_pole_coordinated}
          </li>
        </ul>

        <div className="section-title">4. Site&nbsp;&nbsp;Details</div>
        <table className="site-details-table">
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
        <div className="page-break"></div>

        <div className="section-title">6. Handover&nbsp;&nbsp;Checklist</div>
        <table className="site-details-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status&nbsp;&nbsp;(✔)</th>
              <th>Remarks&nbsp;&nbsp;(If Any)</th>
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
        <div className="section-title">
          7. Handover&nbsp;&nbsp;Documents&nbsp;&nbsp;&&nbsp;&nbsp;Details
        </div>
        <ul>
          <li>
            <strong>
              Portal&nbsp;&nbsp;Access&nbsp;&nbsp;Provided&nbsp;&nbsp;:
            </strong>{" "}
            {serviceItemData.is_portal_access_provided ? "Yes" : "No"}
          </li>
          <li>
            <strong>
              Client&nbsp;&nbsp;Training&nbsp;&nbsp;Conducted&nbsp;&nbsp;:
            </strong>{" "}
            {serviceItemData.is_client_training_conducted ? "Yes" : "No"}
          </li>
          <li>
            <strong>Commissioning&nbsp;&nbsp;Documents&nbsp;&nbsp;:</strong>{" "}
            <Link target="blank" to={serviceItemData.commissioning_document}>
              Click&nbsp;&nbsp;Here
            </Link>
          </li>
        </ul>
        <div className="section-title">
          8. Points&nbsp;&nbsp;of&nbsp;&nbsp;Contact
        </div>
        <table className="site-details-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>E-Mail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project&nbsp;&nbsp;Team&nbsp;&nbsp;Lead</td>
              <td>Jitesh&nbsp;&nbsp;Kute</td>
              <td>jitesh.kute@taypro.in</td>
            </tr>
            <tr>
              <td>Asst.&nbsp;&nbsp;Service&nbsp;&nbsp;Manager</td>
              <td>Abhay&nbsp;&nbsp;Singh</td>
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
              <strong>Project&nbsp;&nbsp;Team</strong>
            </p>
            <p>
              Name&nbsp;&nbsp;:&nbsp;&nbsp;{serviceItemData.created_by?.name}
            </p>
            <p>
              Designation&nbsp;&nbsp;:&nbsp;&nbsp;
              {serviceItemData.created_by?.designation || ""}
            </p>
            <p className="signature-line">
              Signature&nbsp;&nbsp;:&nbsp;&nbsp;
              <span style={{ fontWeight: "bold", color: "green" }}>
                Verified
              </span>
            </p>

            <p>
              Date&nbsp;&nbsp;:&nbsp;&nbsp;
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
              <strong>Service&nbsp;&nbsp;Team</strong>
            </p>
            <p>
              Name&nbsp;&nbsp;:&nbsp;&nbsp;
              {serviceItemData.approval_sent_by?.name || ""}
            </p>
            <p>
              Designation&nbsp;&nbsp;:&nbsp;&nbsp;
              {serviceItemData.approval_sent_by?.designation || ""}{" "}
            </p>
            <p className="signature-line">
              Signature&nbsp;&nbsp;:&nbsp;&nbsp;
              <span style={{ fontWeight: "bold", color: "green" }}>
                Verified
              </span>
            </p>
            <p>
              Date&nbsp;&nbsp;:&nbsp;&nbsp;
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

export default ViewProjectHandoverDocument;
