import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ESPFIRMWARE_DATA_REQUEST":
      return {
        ...state,
        espFirmwareDataLoading: true,
        espFirmwareDataError: "",
      };
    case "FETCH_ESPFIRMWARE_DATA_SUCCESS":
      return {
        ...state,
        espFirmwareDataLoading: false,
        espFirmwares: action.payload,
        espFirmwareDataError: "",
      };
    case "FETCH_ESPFIRMWARE_DATA_FAIL":
      return {
        ...state,
        espFirmwareDataLoading: false,
        espFirmwareDataError: action.payload,
      };
    case "UPLOAD_ESPFIRMWARE_DATA_REQUEST":
      return {
        ...state,
        espFirmwareDataUploadLoading: true,
        espFirmwareDataUploadError: "",
      };
    case "UPLOAD_ESPFIRMWARE_DATA_SUCCESS":
      return {
        ...state,
        espFirmwareDataUploadLoading: false,
        espFirmwareDataUploadError: "",
      };
    case "UPLOAD_ESPFIRMWARE_DATA_FAIL":
      return {
        ...state,
        espFirmwareDataUploadLoading: false,
        espFirmwareDataUploadError: action.payload,
      };
    case "ADD_ESPFIRMWARE_DATA_REQUEST":
      return { ...state, espFirmwareAddloading: true, espFirmwareError: "" };

    case "ADD_ESPFIRMWARE_DATA_SUCCESS":
      return {
        ...state,
        espFirmwareAddloading: false,
        espFirmwares: [...state.espFirmwares, action.payload],
      };

    case "ADD_ESPFIRMWARE_DATA_FAIL":
      return {
        ...state,
        espFirmwareAddloading: false,
        espFirmwareError: action.payload,
      };

    default:
      return state;
  }
};
const EspFirmwareDataUpload = () => {
  const [
    {
      espFirmwareDataUploadLoading,
      espFirmwareDataUploadError,
      espFirmwareAddloading,
      espFirmwareError,
      espFirmwareDataLoading,
      espFirmwareDataError,
      espFirmwares,
    },
    dispatch,
  ] = useReducer(reducer, {
    espFirmwareDataUploadLoading: false,
    espFirmwareDataUploadError: "",
    espFirmwareAddloading: false,
    espFirmwareError: "",
    espFirmwareDataLoading: false,
    espFirmwareDataError: "",
    espFirmwares: [],
  });
  // const authtoken = useSelector((state) => state.authtoken);

  const [espFirmwareFile, setEspFirmwareFile] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchEspFirmwareData = async () => {
      dispatch({ type: "FETCH_ESPFIRMWARE_DATA_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/espfirmwares`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_ESPFIRMWARE_DATA_SUCCESS",
          payload: res.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ESPFIRMWARE_DATA_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
        toast.error(error.response.data.error || error.response.data.message);
      }
    };

    fetchEspFirmwareData();
  }, []);

  const handleEspFirmwareData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_ESPFIRMWARE_DATA_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/bin-files",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );
      console.log(data.url);
      dispatch({ type: "UPLOAD_ESPFIRMWARE_DATA_SUCCESS" });
      setEspFirmwareFile(data.url);
      setFileName(data.fileName);
      toast.success("The file uploaded successfully");
    } catch (error) {
      dispatch({
        type: "UPLOAD_ESPFIRMWARE_DATA_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
      console.error(error);
    }
  };

  const data = {
    esp_firmware_url: espFirmwareFile,
    esp_firmware_fileName: fileName,
  };
  //   try {
  //     dispatch({ type: "ADD_ESPFIRMWARE_DATA_REQUEST" });
  //     const response = await axios.post(`/api/v1/espfirmwares`, data, {
  //       // headers: { authorization: `Bearer ${authtoken}` },
  // withCredentials: true,
  //     });

  //     dispatch({
  //       type: "ADD_ESPFIRMWARE_DATA_SUCCESS",
  //       payload: response.data.data,
  //     });

  //     toast.success(response.data.message);
  //   } catch (error) {
  //     console.error(error);
  //     dispatch({
  //       type: "ADD_ESPFIRMWARE_DATA_FAIL",
  //       payload: error.response.data.error,
  //     });
  //     toast.error(error.response.data.error);
  //   }
  // };

  const handleAdd = async () => {
    try {
      dispatch({ type: "ADD_ESPFIRMWARE_DATA_REQUEST" });
      const response = await axios.post(`/api/v1/espfirmwares`, data, {
        // headers: { authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      console.log(response.data.data);

      dispatch({
        type: "ADD_ESPFIRMWARE_DATA_SUCCESS",
        payload: response.data.data,
      });

      toast.success(response.data.message);

      // ✅ Reset states after successful add
      setEspFirmwareFile("");
      setFileName("");
      document.getElementById("esp_firmware_url").value = ""; // clear file input
    } catch (error) {
      console.error(error);
      dispatch({
        type: "ADD_ESPFIRMWARE_DATA_FAIL",
        payload: error.response.data.error,
      });
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h4>Add ESP Firmware Data</h4>
        </CCardHeader>
        <CCardBody>
          <CFormLabel>Upload ESP Firmware Code</CFormLabel>
          <CFormInput
            id="esp_firmware_url"
            className="w-50"
            type="file"
            name="esp_firmware_url"
            onChange={handleEspFirmwareData}
          />
          {espFirmwareDataUploadLoading ? (
            <div className="mt-2 d-flex justify-content-center">
              <LoadingSpinner />
            </div>
          ) : espFirmwareDataUploadError ? (
            <CBadge color="danger">{espFirmwareDataUploadError}</CBadge>
          ) : (
            ""
          )}
          {espFirmwareFile && (
            <div className="mt-3">
              <span>Uploaded File URL:</span>
              <a
                href={espFirmwareFile}
                target="_blank"
                rel="noopener noreferrer"
              >
                {espFirmwareFile}
              </a>
            </div>
          )}
          <CButton
            color="success"
            size="sm"
            className="text-white mt-3"
            onClick={handleAdd}
            disabled={espFirmwareAddloading || !espFirmwareFile}
          >
            {espFirmwareAddloading ? (
              <>
                Uploading..
                <LoadingSpinner />
              </>
            ) : (
              "Upload"
            )}
          </CButton>
        </CCardBody>
      </CCard>
      <CCard className="mt-4">
        <CCardHeader>
          <h4>All ESP Firmwares</h4>
        </CCardHeader>
        <CCardBody>
          {espFirmwareDataError && (
            <CBadge color="danger">{espFirmwareDataError}</CBadge>
          )}
          {espFirmwareDataLoading ? (
            <div className="d-flex justify-content-center">
              <LoadingSpinner />
            </div>
          ) : espFirmwares && espFirmwares.length > 0 ? (
            <CTable
              bordered
              hover
              responsive
              className="text-center shadow-sm bg-important"
            >
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell>Sr No.</CTableHeaderCell>
                  <CTableHeaderCell>File Name</CTableHeaderCell>
                  <CTableHeaderCell>File URL</CTableHeaderCell>
                  <CTableHeaderCell>Added On</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {espFirmwares.map((fw, index) => (
                  <CTableRow key={fw._id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{fw.esp_firmware_fileName}</CTableDataCell>
                    <CTableDataCell>
                      <a
                        href={fw.esp_firmware_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fw.esp_firmware_url}
                      </a>
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(fw.createdAt).toLocaleString()}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p className="text-center fw-bold">No ESP Firmwares Found</p>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default EspFirmwareDataUpload;
