import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CRow,
} from "@coreui/react";
import toast from "react-hot-toast";
import TayproLogo from "../../../assets/brand/logoforwhitebg.png";
import { users } from "../../../data"; // Import users from data.js
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FORGOT_REQUEST":
      return { ...state, forgotLoading: true };
    case "FORGOT_SUCCESS":
      return { ...state, forgotLoading: false };
    case "FORGOT_FAIL":
      return { ...state, forgotLoading: false, error: action.payload };

    default:
      return state;
  }
};
const ForgotPassword = () => {
  const [{ forgotLoading, error }, dispatch] = useReducer(reducer, {
    forgotLoading: false,
    error: "",
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "FORGOT_REQUEST" }); // Show loading
      const data = await axios.post("/api/v1/auth/forgot-password", {
        email,
      });

      dispatch({ type: "FORGOT_SUCCESS" }); // Show loading

      toast.success(data.data.message);
      setEmail("");
    } catch (err) {
      dispatch({ type: "FORGOT_SUCCESS", error: err.response.data.error }); // Show loading
      toast.error(err.response.data.error);
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
          <CCol md={8} lg={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <div className="text-center mb-3">
                    <img
                      src={TayproLogo}
                      alt="Taypro Logo"
                      className="sidebar-brand-full logo"
                      style={{
                        height: "100px",
                        width: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <CForm onSubmit={handleForgotPassword} autoComplete="off">
                    <h2 className="text-center mb-4">Forgot Password</h2>

                    <CInputGroup className="mb-3">
                      <CFormInput
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12} className="text-center">
                        <CButton
                          color="primary"
                          className="px-4 py-1 w-100"
                          type="submit"
                          disabled={forgotLoading}
                        >
                          {error ? (
                            error
                          ) : forgotLoading ? (
                            <>
                              Sending..
                              <LoadingSpinner />
                            </>
                          ) : (
                            "Send Reset Link"
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  <div className="text-center mt-3">
                    <CButton
                      color="link"
                      className="px-0"
                      onClick={() => navigate("/login")}
                    >
                      Back to Login
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ForgotPassword;
