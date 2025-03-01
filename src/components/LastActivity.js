import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import { CAvatar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeech } from '@coreui/icons';
import { formatDistanceToNow } from 'date-fns';

const LastActivity = ({ LastActivity }) => {
  return (
    <CCard className="w-full  mx-auto shadow rounded">
      <CCardHeader className="bg-light d-flex align-items-center">
        <CIcon icon={cilSpeech} className="me-2 text-primary" />
        <strong>Last Activity</strong>
      </CCardHeader>
      <CCardBody className="overflow-auto" style={{ maxHeight: '400px' }}>
        {LastActivity.length > 0 ? (
          LastActivity.slice()
            .reverse()
            .map((activity, index) => (
              <div
                key={index}
                className="d-flex align-items-center border-bottom pb-3 mb-3"
              >
                <CAvatar
                  src={activity.profile}
                  size="lg"
                  className="me-3 flex-shrink-0"
                  style={{ width: '50px', height: '50px' }} // Fixed size
                />
                <div className="flex-grow-1">
                  <p className="mb-1 fw-semibold d-flex justify-content-between">
                    <span className="fw-semibold">{activity.name}</span>
                    <span className="text-muted small">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </p>

                  {/* <p
                    className="text-dark small"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {activity.details}
                  </p> */}
                  <p
                    className="text-muted"
                    style={{ fontSize: '14px', lineHeight: '1.5' }}
                    dangerouslySetInnerHTML={{ __html: activity.details }}
                  ></p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-muted">No recent activity</p>
        )}
      </CCardBody>
    </CCard>
  );
};

export default LastActivity;
