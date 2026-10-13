import axios from "axios";

const base = "/api/v1/engineer-performance";

export async function performanceGet(path, params) {
  const response = await axios.get(`${base}${path}`, {
    params,
    withCredentials: true,
  });
  return response.data.data;
}

export async function performanceSend(method, path, body) {
  const response = await axios({
    method,
    url: `${base}${path}`,
    data: body,
    withCredentials: true,
  });
  return response.data.data;
}

export function apiError(error) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    "Request failed"
  );
}
