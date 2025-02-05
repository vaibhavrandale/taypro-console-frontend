import React, { useEffect, useRef } from 'react';
import { CChartBar } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';
import { service_tickets } from '../../../data'; // Import service tickets data

const TicketChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent'
          );
          chartRef.current.options.scales.x.grid.color = getStyle(
            '--cui-border-color-translucent'
          );
          chartRef.current.options.scales.x.ticks.color =
            getStyle('--cui-body-color');
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent'
          );
          chartRef.current.options.scales.y.grid.color = getStyle(
            '--cui-border-color-translucent'
          );
          chartRef.current.options.scales.y.ticks.color =
            getStyle('--cui-body-color');
          chartRef.current.update();
        });
      }
    });
  }, [chartRef]);

  // 📊 Group service tickets by site and count open/resolved
  const siteWiseData = service_tickets.reduce((acc, ticket) => {
    const { site_id, ticket_resolved } = ticket;
    if (!acc[site_id]) acc[site_id] = { open: 0, resolved: 0 };
    ticket_resolved ? acc[site_id].resolved++ : acc[site_id].open++;
    return acc;
  }, {});

  const labels = Object.keys(siteWiseData);
  const openTickets = Object.values(siteWiseData).map((d) => d.open);
  const resolvedTickets = Object.values(siteWiseData).map((d) => d.resolved);

  return (
    <CChartBar
      ref={chartRef}
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: labels,
        datasets: [
          {
            label: 'Open Tickets',
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: getStyle('--cui-danger'),
            data: openTickets,
          },
          {
            label: 'Resolved Tickets',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: getStyle('--cui-success'),
            data: resolvedTickets,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          //   x: {
          //     grid: {
          //       color: getStyle('--cui-border-color-translucent'),
          //       drawOnChartArea: false,
          //     },
          //     ticks: {
          //       color: getStyle('--cui-body-color'),
          //     },
          //   },

          x: {
            display: false,
          },
          y: {
            beginAtZero: true,
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
              maxTicksLimit: 5,
            },
          },
        },
      }}
    />
  );
};

export default TicketChart;
