import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { CContainer } from "@coreui/react";
import Tayprofordarkbg from "../../assets/brand/logofordarkbg.png";
import Tayproforwhitebg from "../../assets/brand/logoforwhitebg.png";

/**
 * Quiz shell uses the same CoreUI / app theme as Console.
 */
const QuizPortalLayout = () => {
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("quizUser") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    axios
      .get("/api/v1/quiz-portal/me", { withCredentials: true })
      .then((r) => {
        const u = r.data.data?.user;
        if (u) {
          setUser(u);
          sessionStorage.setItem("quizUser", JSON.stringify(u));
        }
      })
      .catch(() => {
        navigate("/quiz/login");
      });
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post(
        "/api/v1/quiz-portal/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch (_) {
      /* ignore */
    }
    sessionStorage.removeItem("quizUser");
    sessionStorage.removeItem("quizToken");
    navigate("/quiz/login");
  };

  const initial = (user?.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <header className="header header-sticky p-0 mb-3">
        <div
          className="container-fluid border-bottom px-3 py-2 d-flex align-items-center justify-content-between gap-2"
          style={{
            backdropFilter: "blur(8px)",
            background: "var(--cui-body-bg)",
          }}
        >
          <Link
            to="/quiz"
            className="d-flex align-items-center text-decoration-none gap-2 text-body"
          >
            <img
              src={theme === "light" ? Tayproforwhitebg : Tayprofordarkbg}
              alt="Taypro"
              style={{ height: 36, width: "auto" }}
            />
            <div className="lh-sm d-none d-sm-block">
              <div className="fw-semibold">Quiz Assessment</div>
              <div className="text-body-secondary" style={{ fontSize: 11 }}>
                Technician portal
              </div>
            </div>
          </Link>
          <div className="d-flex align-items-center gap-2 gap-md-3">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white"
                  style={{
                    width: 36,
                    height: 36,
                    background: "#0f3460",
                    fontSize: 14,
                  }}
                  aria-hidden
                >
                  {initial}
                </div>
                <div className="text-end lh-sm d-none d-sm-block">
                  <div className="fw-semibold small">{user.username}</div>
                  <div className="text-body-secondary" style={{ fontSize: 12 }}>
                    {user.role}
                  </div>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="body flex-grow-1 px-3 pb-4">
        <CContainer lg>
          <Outlet />
        </CContainer>
      </div>
    </div>
  );
};

export default QuizPortalLayout;
