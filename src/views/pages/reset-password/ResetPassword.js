import React, { useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked } from "@coreui/icons";
import toast from "react-hot-toast";
import Tayprofordarkbg from "../../../assets/brand/logofordarkbg.png";
import Tayproforwhitebg from "../../../assets/brand/logoforwhitebg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../../components/LoadingSpinner";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "RESET_REQUEST":
      return { ...state, resetLoading: true };
    case "RESET_SUCCESS":
      return { ...state, resetLoading: false };
    case "RESET_FAIL":
      return { ...state, resetLoading: false, error: action.payload };

    default:
      return state;
  }
};
const ResetPassword = () => {
  const [{ resetLoading }, dispatch] = useReducer(reducer, {
    resetLoading: false,
    error: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const theme = localStorage.getItem("theme");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("password are not match");
    } else {
      try {
        dispatch({ type: "RESET_REQUEST" }); // Show loading
        const data = await axios.post("/api/v1/auth/reset-password", {
          password: newPassword,
          token: id,
        });

        dispatch({ type: "RESET_SUCCESS" }); // Show loading

        toast.success(data.data.message);
        toast("Wait...we are redirecting you to login page.!", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/login"), 5000); // Redirect after 2s
      } catch (err) {
        dispatch({ type: "RESET_FAIL", error: err.response.data.error }); // Show loading
        toast.error(err.response.data.error);
      }
    }
  };
  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/di0iwc8ql/image/upload/v1724749800/ium0a01kucfsimtbyesq.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={4}>
            <CCard className="p-3">
              <CCardBody>
                <div className="text-center mb-3">
                  {theme === "light" ? (
                    <img
                      src={Tayproforwhitebg}
                      alt="Taypro Logo"
                      className=""
                      style={{ height: "80px", width: "auto" }}
                    />
                  ) : (
                    <img
                      src={Tayprofordarkbg}
                      alt="Taypro Logo"
                      className=""
                      style={{ height: "80px", width: "auto" }}
                    />
                  )}
                </div>
                <CForm onSubmit={handleResetPassword} autoComplete="off">
                  <h4 className="text-center mb-4">Reset Password</h4>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="New Password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4 position-relative">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <CInputGroupText
                      onClick={() => setShowPassword(!showPassword)}
                      className="border-0 bg-transparent position-absolute"
                      style={{
                        right: "10px", // Adjust position inside input
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        zIndex: 10, // Ensure it stays on top
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </CInputGroupText>
                  </CInputGroup>
                  <CRow className="d-flex justify-content-between align-items-center">
                    <CCol xs={6}>
                      <CButton
                        color="secondary"
                        className="px-4 py-1"
                        size="sm"
                        type="submit"
                        disabled={
                          !newPassword ||
                          !confirmPassword ||
                          resetLoading ||
                          newPassword !== confirmPassword
                        }
                      >
                        {resetLoading ? (
                          <>
                            Resetting...
                            <LoadingSpinner />
                          </>
                        ) : (
                          "Reset"
                        )}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-end">
                      <Link className="px-0" to="/login">
                        Back to Login
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;
