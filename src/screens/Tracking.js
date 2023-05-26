import React from 'react';
import './TrackingPage.css'; // Import custom styles

const TrackingPage = () => {
  return (
    <div className="tracking-page">
      <header className="header">
        <h1>Order Tracking</h1>
      </header>
      <div className="tracking-details">
        <div className="tracking-item">
          <div className="tracking-status">
            <span className="status-badge in-transit">In Transit</span>
            <span className="status-time">Estimated Delivery: May 30, 2023</span>
          </div>
          <div className="tracking-info">
            <h2>Order #123456789</h2>
            <p>Shipped from: Warehouse A</p>
            <p>Destination: John Doe, 123 Main St, City, Country</p>
          </div>
        </div>
        <div className="tracking-item">
          <div className="tracking-status">
            <span className="status-badge delivered">Delivered</span>
            <span className="status-time">Delivered on: May 28, 2023</span>
          </div>
          <div className="tracking-info">
            <h2>Order #987654321</h2>
            <p>Shipped from: Warehouse B</p>
            <p>Destination: Jane Smith, 456 Elm St, City, Country</p>
          </div>
        </div>
        {/* Add more tracking items as needed */}
      </div>
      <footer className="footer">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TrackingPage;
