import React, { useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import toast from "react-hot-toast";
import { users } from "../../../data"; // Use correct data import
import TayproLogo from "../../../assets/brand/logoforwhitebg.png";
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
  const [{ resetLoading, error }, dispatch] = useReducer(reducer, {
    resetLoading: false,
    error: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  console.log(id);

  // Handle form submission
  // const handleResetPassword = (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   setTimeout(() => {
  //     // Find user in `users` array
  //     const userIndex = users.findIndex((user) => user.email === email);

  //     if (userIndex === -1) {
  //       toast.error("Username not found");
  //     } else if (newPassword.length < 6) {
  //       toast.error("Password must be at least 6 characters long");
  //     } else if (newPassword !== confirmPassword) {
  //       toast.error("Passwords do not match");
  //     } else {
  //       // Update password (temporary, should be stored in a database)
  //       users[userIndex].password = newPassword;
  //       toast.success("Password reset successful!");
  //       navigate("/login");
  //     }

  //     setLoading(false);
  //   }, 1000);
  // };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("password are not match");
    } else {
      // let password = newPassword; // Correct assignment

      try {
        dispatch({ type: "RESET_REQUEST" }); // Show loading
        const data = await axios.post("/api/v1/auth/reset-password", {
          password: newPassword,
          token: id,
        });
        console.log(data);

        dispatch({ type: "RESET_SUCCESS" }); // Show loading

        // toast.success(`Login Successfull!`);
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
          <CCol xs={12} sm={10} md={8} lg={5}>
            <CCardGroup>
              <CCard className="p-3">
                <CCardBody>
                  <div className="text-center mb-4">
                    <img
                      src={TayproLogo}
                      alt="Taypro Logo"
                      className=""
                      style={{
                        height: "80px",
                        objectFit: "cover",
                        width: "auto",
                      }}
                    />
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
                        // type="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      {/* Show/Hide Password Button (Inside Input) */}
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
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4 py-1"
                          type="submit"
                          disabled={
                            !newPassword || !confirmPassword || resetLoading
                          }
                        >
                          {resetLoading ? (
                            <>
                              Resetting...
                              <LoadingSpinner />
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={() => navigate("/login")}
                        >
                          Back to Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;
