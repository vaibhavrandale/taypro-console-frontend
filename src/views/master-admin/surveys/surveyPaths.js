export const surveyBase = (role) => {
  if (role === "Service Admin") return "/service-admin/surveys";
  if (role === "Project Admin") return "/project-admin/surveys";
  return "/master-admin/surveys";
};

export const publicUrl = (publicPath) => {
  if (!publicPath) return "";
  return `${window.location.origin}${publicPath}`;
};
