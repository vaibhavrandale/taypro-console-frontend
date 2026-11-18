import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { attention, cycles, fleetSummary, motorHistory, motorScore, restBattery, robotStats, SHOW, windowOf } from "./sampleData";
import Fleet from "../views/robot-intelligence/Fleet";
import SiteHealth from "../views/robot-intelligence/SiteHealth";
import RobotHealth from "../views/robot-intelligence/RobotHealth";
import Battery from "../views/robot-intelligence/Battery";
import Motors from "../views/robot-intelligence/Motors";
import Cleaning from "../views/robot-intelligence/Cleaning";
import DataTables from "../views/robot-intelligence/DataTables";

const show = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

test("rest battery averages up from the day log", () => {
  const month = restBattery.find((row) => row.month === "Nov");
  const day = month.days.find((row) => row.day === "16 Nov");
  const fromLog = Math.round(day.log.reduce((sum, row) => sum + row.battery, 0) / day.log.length);
  expect(day.log.length).toBeGreaterThan(4);
  expect(day.average).toBe(fromLog);
  expect(month.days).toHaveLength(16);
  expect(month.average).toBeGreaterThan(0);
});

test("a long robot list stays a short window", () => {
  const page = windowOf(Array.from({ length: 1000 }, (_, index) => index));
  expect(page.shown).toHaveLength(SHOW);
  expect(page.total).toBe(1000);
});

test("missing robot does not throw", () => {
  expect(robotStats("nope").robot).toBeNull();
});

test("fleet summary stays on a 0 to 100 scale", () => {
  const summary = fleetSummary();
  expect(summary.members).toHaveLength(10);
  ["health", "completion", "battery", "utilization", "breakdown"].forEach((key) => {
    expect(summary[key]).toBeGreaterThanOrEqual(0);
    expect(summary[key]).toBeLessThanOrEqual(100);
  });
  expect(summary.watch.length).toBeGreaterThan(0);
});

test("a finished run stores battery, motor, time, and cycle count", () => {
  const pass = cycles.find((row) => row.robot_no === "RB-1001" && row.finished);
  expect(pass.battery_before).toBeGreaterThan(pass.battery_after);
  expect(pass.brush_max).toBeGreaterThan(0);
  expect(pass.wheel_max).toBeGreaterThan(0);
  expect(pass.total_time).toBeGreaterThan(pass.forward_time);
  expect(pass.cycle_count).toBeGreaterThan(0);
  const dead = cycles.find((row) => row.battery_dead);
  expect(dead.total_time).toBeNull();
  expect(dead.cycle_count).toBeNull();
});

test("a robot with both motors high and a low battery carries both flags", () => {
  const stats = robotStats("RB-3003");
  expect(attention(stats.robot, stats)).toEqual(expect.arrayContaining(["Motor", "Battery"]));
  expect(motorScore(stats.robot)).toBe(52);
});

test("each selling screen renders its heading", () => {
  [
    [<Fleet />, "Fleet overview"],
    [<Battery />, "Battery"],
    [<Motors />, "Motors"],
    [<Cleaning />, "Block priority"],
    [<DataTables />, "Records"],
  ].forEach(([ui, title]) => {
    cleanup();
    show(ui);
    expect(screen.getByRole("heading", { name: title })).toBeTruthy();
  });
});

test("one robot month has 30 cleaning days and both motor currents", () => {
  const history = motorHistory("RB-1001");
  expect(history.days).toHaveLength(30);
  const day = history.days[29];
  expect(day.brush_max).toBeGreaterThan(0);
  expect(day.wheel_max).toBeGreaterThan(0);
  expect(history.brush).toBe(Math.round(history.days.reduce((sum, row) => sum + row.brush_max, 0) / 30));
});

test("motors opens the month and then one cleaning day", () => {
  render(<MemoryRouter><Motors /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /30 days/ }));
  expect(screen.getByText("Nov cleaning days")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "30" }));
  expect(screen.getByText("Cleaning · 30 Nov")).toBeTruthy();
  expect(screen.getByText(/Brush avg/)).toBeTruthy();
  expect(screen.getByText(/Wheel avg/)).toBeTruthy();
});

test("battery opens a month and then that day's rest log", () => {
  render(<MemoryRouter><Battery /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /^Nov / }));
  expect(screen.getByText("Nov day by day")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /^16 / }));
  expect(screen.getAllByText("05:30")).toHaveLength(4);
  expect(screen.getAllByText("18:05")).toHaveLength(4);
});

test("site and robot screens render from the route id", () => {
  render(
    <MemoryRouter initialEntries={["/sites/north_field"]}>
      <Routes>
        <Route path="/sites/:siteId" element={<SiteHealth />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole("heading", { name: "North Field" })).toBeTruthy();
  render(
    <MemoryRouter initialEntries={["/robots/RB-1004"]}>
      <Routes>
        <Route path="/robots/:robotNo" element={<RobotHealth />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole("heading", { name: "RB-1004" })).toBeTruthy();
});
