import React, { useState, useEffect } from 'react';
// import logo from '../assets/brand/logoforwhitebg.png';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div style={styles.overlay}>
        <div style={styles.messageBox}>
          {/* <img
            src={logo}
            alt="taypro-logo"
            style={{ border: '1px solid red ' }}
          /> */}
          <h1 style={styles.heading}>⚠️ No Internet Connection</h1>
          <p style={styles.text}>Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return null; // Return nothing if online
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  messageBox: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0px 4px 10px rgba(255, 0, 0, 0.4)',
  },
  heading: {
    fontSize: '2rem',
    color: '#e74c3c', // Red color
    marginBottom: '10px',
  },
  text: {
    fontSize: '1.2rem',
    color: '#333',
  },
};

export default NetworkStatus;
