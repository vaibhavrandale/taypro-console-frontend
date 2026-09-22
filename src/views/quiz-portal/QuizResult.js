import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CBadge, CCard, CCardBody, CCardHeader, CSpinner } from "@coreui/react";

const QuizResult = () => {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/v1/quiz-portal/attempts/${attemptId}/result`, {
        withCredentials: true,
      })
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    );
  }

  const published = data?.status === "RESULT_PUBLISHED";

  return (
    <CCard>
      <CCardHeader className="text-center">
        <strong>{data?.title || "Quiz submitted"}</strong>
      </CCardHeader>
      <CCardBody className="text-center">
        {published ? (
          <>
            <div className="fs-2 mb-2">
              {data.obtainedMarks} / {data.maxMarks}
            </div>
            <div className="mb-2">{data.percentage}%</div>
            <CBadge color={data.passed ? "success" : "danger"} className="fs-6">
              {data.passed ? "Passed" : "Failed"}
            </CBadge>
          </>
        ) : (
          <>
            <CBadge color="warning" className="mb-3">
              Under Review
            </CBadge>
            <p className="text-body-secondary mb-0">
              {data?.message ||
                "Your answers have been submitted. Result will be published after evaluation."}
            </p>
          </>
        )}
        <div className="mt-4">
          <Link className="btn btn-success btn-sm" to="/quiz">
            Back to quizzes
          </Link>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default QuizResult;
