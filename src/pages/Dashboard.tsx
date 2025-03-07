import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaChartLine, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';

const DashboardCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card className="dashboard-card">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="text-muted small">{title}</div>
          <div className="h3 mb-0">{value}</div>
        </div>
        <div style={{ color }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row className="g-4">
        <Col md={6} xl={3}>
          <DashboardCard
            title="Total Users"
            value="1,234"
            icon={<FaUsers size={24} />}
            color="#0d6efd"
          />
        </Col>
        <Col md={6} xl={3}>
          <DashboardCard
            title="Active Scorecards"
            value="56"
            icon={<FaClipboardCheck size={24} />}
            color="#198754"
          />
        </Col>
        <Col md={6} xl={3}>
          <DashboardCard
            title="Monthly Growth"
            value="+12.5%"
            icon={<FaChartLine size={24} />}
            color="#6f42c1"
          />
        </Col>
        <Col md={6} xl={3}>
          <DashboardCard
            title="Pending Reviews"
            value="23"
            icon={<FaExclamationTriangle size={24} />}
            color="#dc3545"
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={8}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="card-title">Recent Activity</h5>
              <p className="text-muted">
                This section will display recent activities and updates.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-primary">Create New Scorecard</button>
                <button className="btn btn-outline-secondary">Generate Report</button>
                <button className="btn btn-outline-secondary">Add User</button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 