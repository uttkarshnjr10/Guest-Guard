// src/components/ui/StatCard.jsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StatCard = ({ title, value, icon, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <Skeleton circle width={48} height={48} className="mr-4" />
        <div className="flex-1">
          <Skeleton width={100} height={28} />
          <Skeleton width={150} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center transition-transform hover:scale-105">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-blue-900">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;