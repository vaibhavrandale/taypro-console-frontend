import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const LastOnlineStatus = ({ lastOnlineTime }) => {
  if (!lastOnlineTime)
    return <span style={{ color: 'red', fontWeight: 'bold' }}>Offline</span>;

  // Convert given timestamp to a Moment.js object
  const lastUpdateTime = moment(lastOnlineTime, 'YYYY-MM-DD HH:mm:ss');
  const currentTime = moment();

  // Calculate the difference in minutes
  const diffMinutes = currentTime.diff(lastUpdateTime, 'minutes');

  return diffMinutes <= 5 ? (
    <span className="badge bg-success">Online</span>
  ) : (
    <span className="badge bg-danger">Offline</span>
  );
};

// Prop Validation
LastOnlineStatus.propTypes = {
  lastOnlineTime: PropTypes.string.isRequired, // Expects a string in "YYYY-MM-DD HH:mm:ss" format
};

export default LastOnlineStatus;
