export const ROLE_ADMIN_ROUTE = {
  "Master Admin": "master-admin",
  "Service Admin": "service-admin",
  "Project Admin": "project-admin",
  "Client Admin": "client-admin",
  "Site Incharge": "site-incharge",
  "Site Technician": "site-technician",
  "Client Site Technician": "client-site-technician",
  "Master User": "master-user",
  "Service User": "service-user",
  "Project User": "project-user",
  "Factory Admin": "factory-admin",
};

export const getAdminRoute = (role) => ROLE_ADMIN_ROUTE[role] || "";

export const getRobotOperatingPath = (role, site_id, block, robot_no) => {
  const adminroute = getAdminRoute(role);
  if (!adminroute || !site_id || !block || !robot_no) return "";
  return `/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}`;
};
