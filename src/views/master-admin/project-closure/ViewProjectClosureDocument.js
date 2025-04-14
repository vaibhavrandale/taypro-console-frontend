import axios from "axios";
import React, { useEffect, useReducer, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./projectDoc.css";
import header from "../../../assets/brand/logoforwhitebg.png";
import html2pdf from "html2pdf.js";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, fetchloading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, projectdoc: action.payload, fetchloading: false };
    case "FETCH_FAIL":
      return { ...state, fetchloading: false, error: action.payload };
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
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

const ViewProjectClosureDocument = () => {
  const [state, dispatch] = useReducer(reducer, {
    fetchloading: true,
    loading: false,
    error: "",
    updating: false,
  });
  const { id } = useParams();
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const contentRef = useRef();

  const [serviceItemData, setServiceItemData] = useState({});

  useEffect(() => {
    toast("Please Export the Document while using the Light Mode...", {
      icon: "⚠️",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
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

  const approveHandoverDoc = async (data) => {
    dispatch({ type: "SUBMIT_REQUEST" });
    try {
      const result = await axios.put(
        `/api/v1/projectdocs/change-status/${data._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({
        type: "SUBMIT_SUCCESS",
      });
      toast.success(
        result.data.message || "Project Handover Approved Successfully."
      );

      navigate(`/${adminroute}/project-handover`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload:
          error.response?.data?.error || "Failed to send an approval request",
      });
      toast.error(
        error.response?.data?.error || "Failed to send an approval request"
      );
    }
  };

  // const exportToPDF = () => {
  //   const element = contentRef.current;

  //   const opt = {
  //     margin: [0.5, 0.5],
  //     filename: `${serviceItemData.project_name}_handover.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 2,
  //       useCORS: true,
  //     },
  //     jsPDF: {
  //       unit: "in",
  //       format: "a4",
  //       orientation: "portrait",
  //     },
  //     pagebreak: {
  //       mode: ["css", "legacy"],
  //       before: [".page-break", ".end-page"],
  //     },
  //   };

  //   html2pdf().set(opt).from(element).save();
  // };

  const exportToPDF = () => {
    const element = contentRef.current;

    const opt = {
      margin: [0.5, 0.5],
      filename: `${serviceItemData.project_name}_handover.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
        before: [".page-break", ".end-page"],
      },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setDrawColor(0); // Black border
          pdf.setLineWidth(0.01); // Adjust border thickness here
          pdf.rect(0.25, 0.25, pageWidth - 0.5, pageHeight - 0.5); // Border inside margin
        }
      })
      .save();
  };

  return (
    <div className="main-container">
      {state.fetchloading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Link
            className="btn btn-sm btn-secondary mt-2"
            size="sm"
            onClick={exportToPDF}
          >
            Export
          </Link>

          <div className="second-container" ref={contentRef}>
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
                        width: "160px",
                        objectFit: "contain",
                      }}
                    />
                  </td>
                  <td colSpan={2} className="text-center">
                    <h5>Project to Service Handover Document</h5>
                  </td>
                  <td colSpan={1}>
                    <b>TPL_PRH-R00</b>
                  </td>
                </tr>
              </thead>
            </table>
            <div className="section-title mt-6">1. Introduction</div>
            <p>
              This document serves as a formal handover from the Project Team to
              the Service Team for the successful completion and transition of{" "}
              <b>{serviceItemData.project_name}</b>. The handover ensures that
              all relevant details, responsibilities, and documentation are
              shared effectively to enable seamless operation and maintenance of
              the system.
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
                <span className="label">
                  Prepared&nbsp;&nbsp;By&nbsp;&nbsp;:
                </span>{" "}
                {serviceItemData.prepared_by}
              </p>

              <p>
                <span className="label">
                  Approved&nbsp;&nbsp;By&nbsp;&nbsp;:
                </span>{" "}
                {serviceItemData.project_approved_by}
              </p>
            </div>
            <div className="section-title mt-6">
              2. Project&nbsp;&nbsp;Overview
            </div>
            <ul>
              <li>
                <span className="label">
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
              {serviceItemData.challenges_faced === "-" ? (
                ""
              ) : (
                <li>
                  <strong>Challenges&nbsp;&nbsp;Faced&nbsp;&nbsp;:</strong>
                  {serviceItemData.challenges_faced}
                </li>
              )}
            </ul>
            <div className="section-title mt-6">
              3. System&nbsp;&nbsp;Details
            </div>
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
                <strong>
                  LoRa&nbsp;&nbsp;Pole&nbsp;&nbsp;Setup&nbsp;&nbsp;:
                </strong>
                {serviceItemData.lora_pole_setup}
              </li>
              <li>
                <strong>
                  LoRa&nbsp;&nbsp;Pole&nbsp;&nbsp;Coordinates&nbsp;&nbsp;:
                </strong>{" "}
                {serviceItemData.lora_pole_coordinated}
              </li>
              <li>
                <strong>
                  Half&nbsp;&nbsp;Table&nbsp;&nbsp;Length&nbsp;&nbsp;:
                </strong>{" "}
                {serviceItemData.half_table_length}
              </li>
              <li>
                <strong>
                  Full&nbsp;&nbsp;Table&nbsp;&nbsp;Length&nbsp;&nbsp;:
                </strong>{" "}
                {serviceItemData.full_table_length}
              </li>
            </ul>
            <br /> <br />
            <br /> <br />
            <div className="section-title mt-6">4. Site&nbsp;&nbsp;Details</div>
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
            <div className="section-title">
              5. Handover&nbsp;&nbsp;Checklist
            </div>
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
                    <td>{item.status === "Done" ? "✔" : item.status}</td>
                    <td>{item.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="section-title page-break">
              6. Handover&nbsp;&nbsp;Documents&nbsp;&nbsp;&&nbsp;&nbsp;Details
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
                <Link
                  target="blank"
                  to={serviceItemData.commissioning_document}
                >
                  Click&nbsp;&nbsp;Here
                </Link>
              </li>
            </ul>
            <div className="section-title">
              7. Points&nbsp;&nbsp;of&nbsp;&nbsp;Contact
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
                  Name&nbsp;&nbsp;:&nbsp;&nbsp;
                  {serviceItemData.created_by?.name}
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
                  {serviceItemData.approved_by?.name || ""}
                </p>
                <p>
                  Designation&nbsp;&nbsp;:&nbsp;&nbsp;
                  {serviceItemData.approved_by?.designation || ""}{" "}
                </p>
                <p className="signature-line">
                  Signature&nbsp;&nbsp;:&nbsp;&nbsp;
                  {serviceItemData.approved_by && (
                    <span style={{ fontWeight: "bold", color: "green" }}>
                      Verified
                    </span>
                  )}
                </p>
                <p>
                  Date&nbsp;&nbsp;:&nbsp;&nbsp;
                  {serviceItemData.approved_by?.timestamp
                    ? new Date(serviceItemData.approved_by.timestamp)
                        .toISOString()
                        .split("T")[0]
                    : ""}
                </p>
                {userInfo.role === "Service Admin" &&
                  serviceItemData.approval_status !== "Approved" && (
                    <Link
                      className="btn btn-sm btn-success mt-2"
                      size="sm"
                      onClick={() => approveHandoverDoc(serviceItemData)}
                    >
                      {state.loading ? (
                        <>
                          Approving... <LoadingSpinner />
                        </>
                      ) : (
                        "Approve"
                      )}
                    </Link>
                  )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewProjectClosureDocument;
