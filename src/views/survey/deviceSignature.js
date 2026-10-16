const STORAGE_KEY = "taypro.survey.device";

export function surveyDevice() {
  let clientId = "";
  try {
    clientId = localStorage.getItem(STORAGE_KEY) || "";
    if (!/^[0-9a-f-]{16,80}$/i.test(clientId)) {
      clientId = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, clientId);
    }
  } catch {
    clientId = crypto.randomUUID();
  }
  return {
    clientId,
    userAgent: navigator.userAgent,
    platform: navigator.platform || "",
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    touchPoints: navigator.maxTouchPoints || 0,
  };
}
