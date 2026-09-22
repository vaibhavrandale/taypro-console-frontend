import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CButton, CCard, CCardBody, CCardHeader, CSpinner } from "@coreui/react";
import { formatQuizDate } from "./quizUtils";

const QuizInstructions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/v1/quiz-portal/quizzes/${quizId}/instructions`, {
        withCredentials: true,
      })
      .then((r) => setData(r.data.data))
      .catch((e) => {
        toast.error(e.response?.data?.message || "Failed to load");
        navigate("/quiz");
      })
      .finally(() => setLoading(false));
  }, [quizId, navigate]);

  const start = async () => {
    try {
      setStarting(true);
      const { data: res } = await axios.post(
        `/api/v1/quiz-portal/quizzes/${quizId}/start`,
        {},
        { withCredentials: true },
      );
      navigate(`/quiz/${quizId}/attempt/${res.data.attemptId}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Cannot start");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    );
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>{data.title}</strong>
      </CCardHeader>
      <CCardBody>
        {data.description ? (
          <p className="text-body-secondary">{data.description}</p>
        ) : null}
        <ul className="small">
          <li>Questions: {data.questionCount}</li>
          <li>Duration: {data.durationMinutes} minutes</li>
          <li>
            Marks: {data.maxMarks} (Pass {data.passingMarks})
          </li>
          <li>
            Window: {formatQuizDate(data.startAt)} →{" "}
            {formatQuizDate(data.endAt)}
          </li>
          <li>Only one attempt. Do not refresh to restart.</li>
          {data.settings?.detectTabSwitch ? (
            <li>Leaving the quiz window may count as a violation.</li>
          ) : null}
        </ul>
        <div className="d-flex gap-2">
          <Link className="btn btn-secondary btn-sm" to="/quiz">
            Back
          </Link>
          <CButton
            color="success"
            size="sm"
            disabled={!data.canStart || starting}
            onClick={start}
          >
            {starting ? "Starting..." : "Begin assessment"}
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default QuizInstructions;
