// src/components/ui/MetricCard.jsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MetricCard = ({ label, value, icon, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
        <Skeleton circle width={48} height={48} className="mr-4" />
        <div className="flex-1">
          <Skeleton width={80} height={24} />
          <Skeleton width={120} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="text-blue-600 mr-4">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
};

export default MetricCard;