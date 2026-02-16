import { CCard, CCardBody } from "@coreui/react";
import { CChartBar } from "@coreui/react-chartjs";

const UserApiUsageBarChart = ({ logs, onSelectEndpoint }) => {
  const labels = logs.map((log) => `${log.endpoint}`);

  const counts = logs.map((log) => log.count);

  return (
    <CCard className="mb-4">
      <CCardBody>
        <h6 className="fw-semibold mb-3">API Usage (Endpoint vs Count)</h6>

        <div style={{ minHeight: "100px" }}>
          <CChartBar
            data={{
              labels,
              datasets: [
                {
                  label: "Usage Count",
                  data: counts,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `Count: ${ctx.parsed.y}`,
                  },
                },
              },
              scales: {
                x: {
                  display: false, // ✅ hides x-axis labels & line
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
              onClick: (_, elements) => {
                if (!elements.length) return;
                const index = elements[0].index;
                onSelectEndpoint(logs[index]);
              },
            }}
          />
        </div>
      </CCardBody>
    </CCard>
  );
};

export default UserApiUsageBarChart;
