// src/pages/DashboardPage.jsx
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DashboardPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Link to="/hotel/register-guest">
          <Button>Register New Guest</Button>
        </Link>
      </div>
      <Card>
        <p>
          Welcome to the dashboard. Click the button above to register a
          new guest.
        </p>
      </Card>
    </div>
  );
};

export default DashboardPage;