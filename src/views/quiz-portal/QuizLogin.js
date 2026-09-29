import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { cilLockLocked, cilUser } from "@coreui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Tayprofordarkbg from "../../assets/brand/logofordarkbg.png";
import toast from "react-hot-toast";
import axios from "axios";

/** Quiz portal login — same Console brand, clearer assessment-focused UX */
const QuizLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/v1/quiz-portal/auth/login",
        { email: email.trim(), password },
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
      className="d-flex flex-column min-vh-100"
      style={{
        backgroundImage:
          "linear-gradient(160deg, rgba(8,16,28,0.78) 0%, rgba(8,16,28,0.55) 45%, rgba(8,16,28,0.72) 100%), url('https://res.cloudinary.com/decyim6cd/image/upload/v1756550699/profile-image/zue50f0h9pwdebxd745f.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <CContainer className="flex-grow-1 d-flex align-items-center py-4 py-md-5">
        <CRow className="justify-content-center w-100 g-0">
          <CCol xs={12} sm={10} md={7} lg={5} xl={4}>
            <div className="text-center text-white mb-4">
              <img
                src={Tayprofordarkbg}
                alt="Taypro"
                style={{ height: 56, width: "auto" }}
              />
              <div
                className="mt-3 text-uppercase"
                style={{
                  letterSpacing: "0.18em",
                  fontSize: 12,
                  opacity: 0.85,
                }}
              >
                Assessment portal
              </div>
            </div>

            <CCard
              className="border-0 shadow-lg overflow-hidden"
              style={{ borderRadius: 16 }}
            >
              <div
                style={{
                  height: 4,
                  background: "linear-gradient(90deg, #2eb85c, #39f, #f9b115)",
                }}
              />
              <CCardBody className="p-4 p-md-4">
                <CForm onSubmit={handleSubmit} autoComplete="off">
                  <h4 className="mb-1 fw-semibold">Sign in to take quizzes</h4>
                  <p className="text-body-secondary small mb-4">
                    Use your Console email and password. This portal is for
                    assessments only.
                  </p>

                  <label className="form-label small fw-semibold mb-1">
                    Email
                  </label>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      autoFocus
                      required
                    />
                  </CInputGroup>

                  <label className="form-label small fw-semibold mb-1">
                    Password
                  </label>
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
                      required
                    />
                    <CInputGroupText
                      role="button"
                      tabIndex={0}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setShowPassword((v) => !v);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </CInputGroupText>
                  </CInputGroup>

                  <CButton
                    color="success"
                    className="w-100 py-2 fw-semibold"
                    type="submit"
                    disabled={!email || !password || loading}
                  >
                    {loading ? "Signing in…" : "Continue to quizzes"}
                  </CButton>

                  <div className="text-center mt-3">
                    <Link
                      to="/login"
                      className="small text-decoration-none text-body-secondary"
                    >
                      Need Console access instead? →
                    </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>

            <p
              className="text-center text-white small mt-3 mb-0"
              style={{ opacity: 0.65 }}
            >
              Stable connection recommended for video questions
            </p>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default QuizLogin;
