import React from 'react';
import { CChartPie } from '@coreui/react-chartjs';
import { CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { service_tickets } from '../../../data'; // Import service tickets data

const PieChart = () => {
  /** 🟢 Fault Occurrences Analysis */
  const faultData = service_tickets.reduce((acc, ticket) => {
    const { fault_type, robot_no, site_id } = ticket;
    if (!acc[fault_type]) {
      acc[fault_type] = {
        count: 0, // Total occurrences
        robots: new Set(), // Unique robots
        sites: new Set(), // Unique sites
      };
    }
    acc[fault_type].count++;
    acc[fault_type].robots.add(robot_no);
    acc[fault_type].sites.add(site_id);
    return acc;
  }, {});

  const faultLabels = Object.keys(faultData);
  const faultValues = faultLabels.map((fault) => faultData[fault].count);
  const faultColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF',
    '#FF7E79',
    '#B39DDB',
    '#F06292',
  ];

  //   /** 🔴 Ticket Status Per Site Analysis */
  //   const siteTicketData = service_tickets.reduce((acc, ticket) => {
  //     const { site_id, ticket_resolved } = ticket;
  //     if (!acc[site_id]) {
  //       acc[site_id] = { open: 0, resolved: 0 };
  //     }
  //     ticket_resolved ? acc[site_id].resolved++ : acc[site_id].open++;
  //     return acc;
  //   }, {});

  //   const siteLabels = Object.keys(siteTicketData);
  //   const openTickets = siteLabels.map((site) => siteTicketData[site].open);
  //   const resolvedTickets = siteLabels.map(
  //     (site) => siteTicketData[site].resolved
  //   );
  //   const siteColors = [
  //     '#FF5733',
  //     '#28A745',
  //     '#FFC107',
  //     '#17A2B8',
  //     '#DC3545',
  //     '#6C757D',
  //   ];

  const siteTicketData = service_tickets.reduce((acc, ticket) => {
    const { site_id, ticket_resolved } = ticket;
    if (!acc[site_id]) {
      acc[site_id] = { open: 0, resolved: 0 };
    }
    ticket_resolved ? acc[site_id].resolved++ : acc[site_id].open++;
    return acc;
  }, {});

  const siteLabels = Object.keys(siteTicketData);
  const siteData = siteLabels.map(
    (site) => siteTicketData[site].open + siteTicketData[site].resolved
  );

  const siteColors = [
    '#FF5733',
    '#28A745',
    '#FFC107',
    '#17A2B8',
    '#DC3545',
    '#6C757D',
    '#8E44AD',
    '#3498DB',
    '#E74C3C',
    '#2ECC71',
    '#F39C12',
    '#1ABC9C',
    '#C0392B',
    '#7D3C98',
    '#2980B9',
    '#D35400',
    '#AAB7B8',
    '#16A085',
    '#D68910',
    '#273746',
  ];

  return (
    <CRow className="justify-content-center">
      {/* 🟢 Pie Chart for Ticket Status Per Site */}
      <CCol xs={12} md={6}>
        <CCard className="mb-4 shadow">
          <CCardHeader>
            <h5 className="text-center"> Sitewise Ticket Status </h5>
          </CCardHeader>
          <CCardBody className="d-flex justify-content-center">
            <div style={{ width: '100%', maxWidth: '450px', height: '350px' }}>
              <CChartPie
                data={{
                  labels: siteLabels.map(
                    (site) =>
                      `${site.replace(/_/g, ' ')} | Open: ${
                        siteTicketData[site].open
                      } | Resolved: ${siteTicketData[site].resolved}`
                  ),
                  datasets: [
                    {
                      data: siteData,
                      backgroundColor: siteColors.slice(0, siteLabels.length),
                      hoverOffset: 8, // Effect when hovering
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          const site = siteLabels[tooltipItem.dataIndex];
                          return `📍 ${site.replace(/_/g, ' ')}
                          | 🛠 Open: ${siteTicketData[site].open}
                          | ✅ Resolved: ${siteTicketData[site].resolved}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      {/* 🟠 Pie Chart for Faults */}
      <CCol xs={12} md={6}>
        <CCard className="mb-4 shadow">
          <CCardHeader>
            <h5 className="text-center">Fault Occurrences</h5>
          </CCardHeader>
          <CCardBody className="d-flex justify-content-center">
            <div style={{ width: '100%', maxWidth: '400px', height: '350px' }}>
              <CChartPie
                data={{
                  labels: faultLabels,
                  datasets: [
                    {
                      data: faultValues,
                      backgroundColor: faultColors.slice(0, faultLabels.length),
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { position: 'right' },
                  },
                }}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default PieChart;
