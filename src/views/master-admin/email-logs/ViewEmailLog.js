import axios from "axios";
import React, { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        log: action.payload,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
const ViewEmailLog = () => {
  const { id } = useParams();
  const [{ loading, error, log }, dispatch] = useReducer(reducer, {
    log: {},
    loading: true,
    error: "",
  });
  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchEmailLog = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const result = await axios.get(
          `/api/v1/email-logs/${id}`,

          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        console.log(result);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",

          payload: error.response?.data?.message || error.response?.data?.error,
        });

        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };
    fetchEmailLog();
  }, [authtoken, id]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: log.email_body
              ?.replace(/color:\s?#fff/gi, "color:#000") // Replace white text with black
              .replace(/color:\s?#333/gi, "color:#fff") // Replace dark gray with white
              .replace(/color:\s?#555/gi, "color:#fff") // Replace dark gray with white
              .replace(/color:\s?#333/gi, "color:#fff") // Replace dark gray with white
              .replace(/color:\s?black/gi, "color:#fff")

              .replace(/color:\s?#f4f4f4/gi, "color:#fff") // Replace light gray with white
              .replace(
                /background\s*:\s*(#f4f4f4|#fff|#ffffff)\s*;?/gi,
                "background:#e0e0e0"
              )
              .replace(/<th([^>]*)style="([^"]*)"/gi, (match, p1, p2) => {
                // Inject color:#000 into existing th styles if not already there
                let newStyle = p2;
                if (!/color\s*:\s*#000/gi.test(p2)) {
                  newStyle += "; color:#000";
                }
                return `<th${p1}style="${newStyle}"`;
              })
              .replace(/<th(?![^>]*style)/gi, '<th style="color:#000"'), // Add style if missing
          }}
        ></div>
      )}
    </>
  );
};

export default ViewEmailLog;
