import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ScoreDonut from "../components/ScoreDonut";
import MonthlyUptimeList from "../components/MonthlyUptimeList";
import CategoryWeights from "../components/CategoryWeights";
import DelayReasonForm from "../components/DelayReasonForm";
import { scoreSummary, weightTotal, weightsValid } from "../utils/score";
import { canSeeNavItem } from "../utils/access";

jest.mock("axios", () => ({}));

test("score donut reports excluded KPIs and stays provisional", () => {
  const summary = scoreSummary({
    overall_score: 72.4,
    kpis: [
      { key: "a", status: "eligible", weight: 40 },
      { key: "b", status: "eligible", weight: 20 },
      { key: "c", status: "excluded", weight: 25, reason: "missing_data" },
      { key: "d", status: "excluded", weight: 15, reason: "missing_data" },
    ],
  });
  expect(summary.eligible).toBe(2);
  expect(summary.total).toBe(4);
  expect(summary.provisional).toBe(true);

  render(<ScoreDonut score={summary.overall} eligible={summary.eligible} total={summary.total} completeness={summary.completeness} />);
  expect(screen.getByText(/2 of 4 KPIs eligible/)).toBeTruthy();
  expect(screen.getByText("Provisional")).toBeTruthy();
  expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(/72\.4 out of 100, provisional/);
});

test("score donut never shows 0 for a missing score", () => {
  render(<ScoreDonut score={null} eligible={0} total={6} completeness={0} />);
  expect(screen.getByText("—")).toBeTruthy();
  expect(screen.queryByText("0.0")).toBeNull();
});

test("missing uptime months render as No record, not 0% or 100%", () => {
  render(
    <MonthlyUptimeList
      target={95}
      rows={[
        { label: "2026-09", value: 97.25 },
        { label: "2026-10", value: null },
      ]}
    />,
  );
  expect(screen.getByText("97.3%")).toBeTruthy();
  expect(screen.getByText("No record")).toBeTruthy();
  expect(screen.queryByText("0.0%")).toBeNull();
  expect(screen.queryByText("100.0%")).toBeNull();
});

test("category weights must total exactly 100", () => {
  const rows = [
    { key: "tickets", name: "Tickets", kpiCount: 3, weight: 40, was: 40 },
    { key: "uptime", name: "Uptime", kpiCount: 1, weight: 60, was: 50 },
  ];
  expect(weightTotal(rows)).toBe(100);
  expect(weightsValid(rows)).toBe(true);
  expect(weightsValid([{ weight: 101 }, { weight: -1 }])).toBe(false);
  expect(weightsValid([{ weight: 50 }, { weight: 40 }])).toBe(false);

  const onChange = jest.fn();
  const { rerender } = render(<CategoryWeights rows={rows} onChange={onChange} />);
  expect(screen.getByText("Total 100.0%")).toBeTruthy();
  expect(screen.getByText("was 50.0%")).toBeTruthy();
  expect(screen.queryByRole("alert")).toBeNull();

  fireEvent.change(screen.getByLabelText(/Tickets/), { target: { value: "50" } });
  expect(onChange).toHaveBeenCalledWith("tickets", 50);

  rerender(<CategoryWeights rows={[{ ...rows[0], weight: 50 }, rows[1]]} onChange={onChange} />);
  expect(screen.getByText(/Total 110\.0%/)).toBeTruthy();
  expect(screen.getByRole("alert").textContent).toMatch(/must add up to 100%/);
});

test("nav items are gated by role and designation", () => {
  const engineerItem = { access: "performance" };
  const adminItem = { access: "performance-admin" };
  const master = { role: "Master Admin", designation: "Service Engineer" };
  const manager = { role: "Service Admin", designation: "Service Manager" };
  const engineer = { role: "Service Admin", designation: " service engineer " };
  const other = { role: "Site Technician" };

  expect(canSeeNavItem(master, adminItem)).toBe(true);
  expect(canSeeNavItem(manager, adminItem)).toBe(true);
  expect(canSeeNavItem(engineer, engineerItem)).toBe(true);
  expect(canSeeNavItem(engineer, adminItem)).toBe(false);
  expect(canSeeNavItem(other, engineerItem)).toBe(false);
  expect(canSeeNavItem({ role: "Project Admin" }, engineerItem)).toBe(false);
  expect(canSeeNavItem({ role: "Service Admin", designation: "Team Lead" }, engineerItem)).toBe(false);
  expect(canSeeNavItem(manager, { designation: "Service Engineer" })).toBe(false);
  expect(canSeeNavItem(master, { designation: "Service Engineer" })).toBe(true);
  expect(canSeeNavItem(other, { name: "plain item" })).toBe(true);
});

test("delay reason form only saves an enabled configured code", async () => {
  const onSave = jest.fn().mockResolvedValue({});
  render(
    <DelayReasonForm
      ticketId="ST-1"
      onSave={onSave}
      reasons={[
        { code: "spare_unavailable", label: "Spare unavailable", enabled: true },
        { code: "old_code", label: "Old code", enabled: false },
      ]}
    />,
  );
  const save = screen.getByRole("button", { name: "Save" });
  expect(save.disabled).toBe(true);
  expect(screen.queryByRole("option", { name: "Old code" })).toBeNull();

  fireEvent.change(screen.getByLabelText("Delay reason"), { target: { value: "spare_unavailable" } });
  fireEvent.change(screen.getByLabelText("Remarks (optional)"), { target: { value: "  waiting on vendor " } });
  expect(save.disabled).toBe(false);
  fireEvent.click(save);
  await waitFor(() => expect(onSave).toHaveBeenCalledWith({ delay_reason_code: "spare_unavailable", delay_reason_remarks: "waiting on vendor" }));
});

test("errors show the exact server message, status and request", () => {
  const { errorText, toApiError } = require("../api/client");
  const axiosError = { message: "Request failed with status code 403", status: 403, config: { method: "get", url: "/api/v1/engineer-performance/compare" }, response: { status: 403, statusText: "Forbidden", data: { success: false, error: "Access denied" } } };
  const parsed = toApiError(axiosError);
  expect(parsed.message).toBe("Access denied");
  expect(errorText(axiosError)).toBe("Access denied (HTTP 403 Forbidden · GET /api/v1/engineer-performance/compare)");
  expect(errorText(parsed)).toBe(errorText(axiosError));
  expect(errorText({ message: "Network Error", config: { method: "post", url: "/x" } })).toBe("Network Error (POST /x)");
});

test("delay reason form is locked when the record id is unavailable", () => {
  render(<DelayReasonForm ticketId="ST-2" onSave={jest.fn()} reasons={[{ code: "x", label: "X" }]} disabledReason="No record id from the API yet." />);
  expect(screen.getByLabelText("Delay reason").disabled).toBe(true);
  expect(screen.getByRole("button", { name: "Save" }).disabled).toBe(true);
  expect(screen.getByText("No record id from the API yet.")).toBeTruthy();
});
