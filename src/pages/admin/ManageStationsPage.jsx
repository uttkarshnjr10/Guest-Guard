// src/pages/admin/ManageStationsPage.jsx
import { useManageStations } from '../../features/admin/useManageStations';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';

const ManageStationsPage = () => {
  const { stations, loading, formState, handleInputChange, handleSubmit } = useManageStations();

  const columns = [
    { Header: 'Station Name', accessor: 'name' },
    { Header: 'City', accessor: 'city' },
    {
      Header: 'Pincodes',
      accessor: 'pincodes',
      Cell: (row) => row.pincodes.join(', '),
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Police Stations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Station</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Station Name *"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="City *"
              name="city"
              value={formState.city}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Pincodes (comma-separated) *"
              name="pincodes"
              value={formState.pincodes}
              onChange={handleInputChange}
              placeholder="e.g., 452001, 452002"
              required
            />
            <Button type="submit" className="w-full">
              Add Station
            </Button>
          </form>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Stations</h2>
          <Table columns={columns} data={stations} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ManageStationsPage;