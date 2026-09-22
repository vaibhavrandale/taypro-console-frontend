import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Tayprofordarkbg from "../../assets/brand/logofordarkbg.png";
import Tayproforwhitebg from "../../assets/brand/logoforwhitebg.png";
import toast from "react-hot-toast";
import axios from "axios";

/** Same look as Console /login — separate quiz auth only */
const QuizLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = localStorage.getItem("theme");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/v1/quiz-portal/auth/login",
        { email, password },
        { withCredentials: true },
      );
      sessionStorage.setItem(
        "quizUser",
        JSON.stringify(data.data?.user || {}),
      );
      if (data.data?.token) {
        sessionStorage.setItem("quizToken", data.data.token);
      }
      toast.success(`Welcome! ${data.data?.user?.username || ""}`);
      navigate("/quiz");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/decyim6cd/image/upload/v1756550699/profile-image/zue50f0h9pwdebxd745f.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
      }}
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={4}>
            <CCardGroup>
              <CCard className="p-3 shadow-lg border-0">
                <CCardBody>
                  <div className="text-center mb-3">
                    {theme === "light" ? (
                      <img
                        src={Tayproforwhitebg}
                        alt="Taypro Logo"
                        style={{ height: "80px", width: "auto" }}
                      />
                    ) : (
                      <img
                        src={Tayprofordarkbg}
                        alt="Taypro Logo"
                        style={{ height: "80px", width: "auto" }}
                      />
                    )}
                  </div>

                  <CForm onSubmit={handleSubmit} autoComplete="off">
                    <h4 className="text-center mb-2">Quiz Login</h4>
                    <p className="text-center text-body-secondary small mb-4">
                      Assessment access only
                    </p>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </CInputGroupText>
                    </CInputGroup>

                    <CRow className="d-flex justify-content-between align-items-center">
                      <CCol xs="6">
                        <CButton
                          color="success"
                          className="px-4"
                          size="sm"
                          type="submit"
                          disabled={!email || !password || loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-end">
                        <Link to="/login" className="px-0">
                          Console login
                        </Link>
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

export default QuizLogin;
