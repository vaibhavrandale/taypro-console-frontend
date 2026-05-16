import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CFormTextarea,
} from "@coreui/react";

import LoadingSpinner from "../../components/LoadingSpinner";
import { useSelector } from "react-redux";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, fetchloading: true, error: "" };

    case "FETCH_SUCCESS":
      return {
        ...state,
        fetchloading: false,
        nomenclature: action.payload,
      };

    case "FETCH_FAIL":
      return {
        ...state,
        fetchloading: false,
        error: action.payload,
      };

    case "UPDATE_REQUEST":
      return { ...state, updateloading: true };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        updateloading: false,
        success: true,
      };

    case "UPDATE_FAIL":
      return {
        ...state,
        updateloading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const UpdatenomenClature = () => {
  const [{ error, fetchloading, updateloading }, dispatch] = useReducer(
    reducer,
    {
      nomenclature: {},
      fetchloading: true,
      updateloading: false,
      error: "",
    },
  );

  const { id } = useParams();

  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  // i want loading spiiner when i remove the attachment and add that time taking time to upload the file and remove the file from the list of attachments in the ui when i click on remove button and also want to show the error if any error occurs during uploading or removing the attachment in the ui using toast

  const [formData, setFormData] = useState({
    status: "",
    remark: "",
    nomenclature: [],
  });
  useEffect(() => {
    const fetchNomenclature = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const response = await axios.get(`/api/v1/nomenclatures/${id}`, {
          withCredentials: true,
        });

        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data.data,
        });

        setFormData({
          status: response.data.data.status || "",
          remark: response.data.data.remark || "",
          nomenclature: response.data.data.nomenclature || [],
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.message,
        });
      }
    };

    fetchNomenclature();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleNomenclatureChange = (index, value) => {
  //   const updatedNomenclature = [...formData.nomenclature];

  //   updatedNomenclature[index].value = value;
  //   updatedNomenclature[index].description = description;

  //   setFormData({
  //     ...formData,
  //     nomenclature: updatedNomenclature,
  //   });
  // };

  const handleNomenclatureChange = (index, field, value) => {
    const updatedNomenclature = [...formData.nomenclature];

    updatedNomenclature[index][field] = value;

    setFormData({
      ...formData,
      nomenclature: updatedNomenclature,
    });
  };

  const [imageUploading, setImageUploading] = useState(false);
  const handleAttachmentUpload = async (e, nomenclatureIndex) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    try {
      setImageUploading((prev) => ({ ...prev, [nomenclatureIndex]: true }));

      const uploadedAttachments = [];

      for (const file of files) {
        const bodyFormData = new FormData();

        bodyFormData.append("file", file);

        const response = await axios.post(
          `/api/v1/image-upload/nomenclature-chats`,
          bodyFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );

        uploadedAttachments.push({
          name: file.name,
          img: response.data.url,
        });
      }

      const updatedNomenclature = [...formData.nomenclature];

      updatedNomenclature[nomenclatureIndex].attachments = [
        ...(updatedNomenclature[nomenclatureIndex].attachments || []),
        ...uploadedAttachments,
      ];

      setFormData({
        ...formData,
        nomenclature: updatedNomenclature,
      });

      setImageUploading((prev) => ({ ...prev, [nomenclatureIndex]: false }));
      toast.success("Attachments uploaded successfully!");
    } catch (error) {
      setImageUploading((prev) => ({ ...prev, [nomenclatureIndex]: false }));
      toast.error(
        error.response?.data?.message || "Failed to upload attachment",
      );
    }
  };

  const handleRemoveAttachment = (nomenclatureIndex, attachmentIndex) => {
    const updatedNomenclature = [...formData.nomenclature];

    updatedNomenclature[nomenclatureIndex].attachments.splice(
      attachmentIndex,
      1,
    );

    setFormData({
      ...formData,
      nomenclature: updatedNomenclature,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "UPDATE_REQUEST" });

    try {
      await axios.put(`/api/v1/nomenclatures/${id}`, formData, {
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS" });

      toast.success("Nomenclature updated successfully!");

      navigate(`/${adminroute}/view-nomenclature/${id}`);
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data.error || error.response?.data.message,
      });
      toast.error(error.response?.data.error || error.response?.data.message);
    }
  };

  if (fetchloading) return <LoadingSpinner />;

  if (error) return <p className="error">{error}</p>;

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Design Admin") {
    adminroute = "design-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  }

  return (
    <div className="update-robot-container px-3">
      <CCard className="w-100 shadow-sm rounded-lg">
        <CCardHeader>
          <h4 className="mb-0">Update Nomenclature</h4>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSubmit}>
            <CRow>
              {/* STATUS */}
              <CCol md={6} className="mb-3">
                <CFormLabel>Status</CFormLabel>

                <CFormSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>

                  <option value="draft">Draft</option>

                  <option value="completed">Completed</option>

                  <option value="submitted">Submitted</option>

                  <option value="rejected">Rejected</option>
                </CFormSelect>
              </CCol>

              {/* REMARK */}
              <CCol md={12} className="mb-3">
                <CFormLabel>Remark</CFormLabel>

                <CFormTextarea
                  rows={4}
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>

            {/* NOMENCLATURE FIELDS */}
            <CRow>
              {formData.nomenclature?.map((item, index) => (
                <CCol md={6} key={item.key} className="mb-4">
                  <CCard className="shadow-sm h-100">
                    <CCardBody>
                      <CFormLabel className="fw-bold">{item.name}</CFormLabel>

                      <p className="text-muted small mb-2">Value</p>

                      {/* <CFormInput
                        type="text"
                        value={item.value || ""}
                        onChange={(e) =>
                          handleNomenclatureChange(index, e.target.value)
                        }
                      />
                      <CFormInput
                        type="text"
                        value={item.description || ""}
                        onChange={(e) =>
                          handleNomenclatureChange(index, e.target.value)
                        }
                      /> */}

                      <CFormInput
                        className="m-1"
                        type="text"
                        value={item.value || ""}
                        onChange={(e) =>
                          handleNomenclatureChange(
                            index,
                            "value",
                            e.target.value,
                          )
                        }
                      />
                      <p className="text-muted small mb-2">Description</p>
                      <CFormInput
                        className="m-1"
                        type="text"
                        value={item.description || ""}
                        onChange={(e) =>
                          handleNomenclatureChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                      />

                      {/* ATTACHMENTS */}
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <p className="fw-bold mb-0">Attachments</p>

                          <CFormInput
                            type="file"
                            multiple
                            size="sm"
                            onChange={(e) => handleAttachmentUpload(e, index)}
                            style={{
                              maxWidth: "250px",
                            }}
                          />
                          {imageUploading[index] && <LoadingSpinner />}
                        </div>

                        {Array.isArray(item.attachments) &&
                          item.attachments.length > 0 && (
                            <div className="d-flex flex-wrap gap-2">
                              {item.attachments.map((attachment, idx) => (
                                <div
                                  key={idx}
                                  className="position-relative border rounded p-1"
                                >
                                  <img
                                    src={attachment.img}
                                    alt={attachment.name}
                                    width="100"
                                    height="100"
                                    className="rounded"
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  />

                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    style={{
                                      padding: "2px 6px",
                                      fontSize: "10px",
                                    }}
                                    onClick={() =>
                                      handleRemoveAttachment(index, idx)
                                    }
                                  >
                                    X
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>

            {/* SUBMIT BUTTON */}
            <div className="d-flex justify-content-end mt-4">
              <CButton type="submit" color="warning" size="sm" className="w-25">
                {updateloading ? (
                  <>
                    Updating...
                    <LoadingSpinner />
                  </>
                ) : (
                  "Update"
                )}
              </CButton>
            </div>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdatenomenClature;
