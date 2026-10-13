export const SERVICE_ENGINEER = "Service Engineer";

export function designationIs(user, name) {
  return String(user?.designation || "").trim().toLowerCase() === String(name || "").trim().toLowerCase();
}

export const isServiceEngineer = (user) => designationIs(user, SERVICE_ENGINEER);

/** Mirrors backend access.js canReadAll. The backend stays the authority. */
export function canReadAll(user) {
  if (user?.role === "Master Admin") return true;
  return user?.role === "Service Admin" && designationIs(user, "Service Manager");
}

export const canWriteConfig = canReadAll;

export const canViewPerformance = (user) => canReadAll(user) || isServiceEngineer(user);

/** Sidebar rule shared by AppSidebarNav. */
export function canSeeNavItem(user, item) {
  if (item?.access === "performance") return canViewPerformance(user);
  if (item?.access === "performance-admin") return canReadAll(user);
  if (!item?.designation || user?.role === "Master Admin") return true;
  return designationIs(user, item.designation);
}
