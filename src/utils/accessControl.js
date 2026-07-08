export const USER_MANAGEMENT_ROLES = [
  "Master Admin",
  "Service Admin",
  "Project Admin",
];

export const canManageUsers = (role) => USER_MANAGEMENT_ROLES.includes(role);

export const isMasterAdmin = (role) => role === "Master Admin";

export const canManageExternalUsers = (role) =>
  role === "Client Admin" || canManageUsers(role);

export const getApiErrorMessage = (error, fallback = "Request failed") =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;
