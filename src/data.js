export const data = [
  {
    roles: [
      {
        role: 'Master Admin',
        permissions: [
          {
            id: 'P001',
            description: 'CRUD operations for all users',
            type: 'CRUD',
          },
          {
            id: 'P002',
            description: 'Monitor system activities and logs',
            type: 'Read',
          },
          {
            id: 'P003',
            description:
              'Manage application settings, permissions, and notifications',
            type: 'CRUD',
          },
          {
            id: 'P004',
            description: 'Oversee all sites and robots',
            type: 'Read',
          },
          {
            id: 'P005',
            description: 'Access analytics, reports, and trends',
            type: 'Read',
          },
          {
            id: 'P006',
            description: 'Assign projects to project engineers',
            type: 'Create',
          },
          {
            id: 'P007',
            description: 'Shift robots within sites',
            type: 'Update',
          },
        ],
        users: [
          {
            username: 'Vaibhav Randale',
            password: 'admin',
            email: 'vaibhav.r@taypro.in',
          },
        ],
      },
      {
        role: 'Project Engineer',
        permissions: [
          {
            id: 'P008',
            description: 'View and manage assigned sites and robots',
            type: 'CRUD',
          },
          { id: 'P009', description: 'Commission robots', type: 'Create' },
          {
            id: 'P010',
            description: 'Oversee service operations and manage technicians',
            type: 'CRUD',
          },
          {
            id: 'P011',
            description: 'Analyze trends for robot failures',
            type: 'Read',
          },
          { id: 'P012', description: 'Send notifications', type: 'Create' },
        ],
        users: [
          {
            username: 'Jitesh Kute',
            password: 'projects123',
            email: 'jitesh.kute@taypro.in',
          },
        ],
      },
      {
        role: 'Service Admin',
        permissions: [
          {
            id: 'P013',
            description: 'Assign and resolve service tickets',
            type: 'CRUD',
          },
          {
            id: 'P014',
            description: 'Monitor robot health scores',
            type: 'Read',
          },
          {
            id: 'P015',
            description: 'Analyze trends for service issues',
            type: 'Read',
          },
        ],
        users: [
          {
            username: 'Abhay Singh',
            password: 'service123',
            email: 'abhay.singh@taypro.in',
          },
        ],
      },
      {
        role: 'Site Technician',
        permissions: [
          { id: 'P016', description: 'Handle daily operations', type: 'CRUD' },
          { id: 'P017', description: 'Execute robot commands', type: 'Update' },
          {
            id: 'P018',
            description: 'Generate and submit cleaning reports',
            type: 'Create',
          },
        ],
        users: [
          {
            username: 'Arjun Rathod',
            password: 'tech123',
            email: 'arjun.rathod@taypro.in',
          },
        ],
      },
      {
        role: 'Client Admin',
        permissions: [
          {
            id: 'P019',
            description: 'Manage company sites and users',
            type: 'CRUD',
          },
          {
            id: 'P020',
            description: 'Download reports for all sites',
            type: 'Read',
          },
          {
            id: 'P021',
            description: 'Raise tickets for technical issues',
            type: 'Create',
          },
        ],
        users: [
          {
            username: 'Dhiren Bhatt',
            password: 'dhiren23',
            email: 'dhiren@gmail.com',
          },
        ],
      },
      {
        role: 'Client Technician',
        permissions: [
          {
            id: 'P022',
            description: 'Perform robot operations',
            type: 'Update',
          },
          { id: 'P023', description: 'Monitor robot status', type: 'Read' },
          {
            id: 'P024',
            description: 'Perform site-specific tasks',
            type: 'CRUD',
          },
        ],
        users: [
          {
            username: 'ABD DEF',
            password: 'client23',
            email: 'abc@gmail.com',
          },
        ],
      },
    ],
  },
];
