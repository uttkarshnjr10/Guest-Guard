// src/pages/police/CaseReportsPage.jsx
import { useCaseReports } from '../../features/police/useCaseReports';
import CaseReportModal from '../../features/police/CaseReportModal';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const StatusPill = ({ status }) => {
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    Open: 'bg-yellow-100 text-yellow-800',
    'Under Investigation': 'bg-blue-100 text-blue-800',
    Closed: 'bg-green-100 text-green-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const CaseReportsPage = () => {
  const { reports, loading, isModalOpen, setIsModalOpen, openModalToCreate, handleCreateReport } = useCaseReports();

  const columns = [
    { Header: 'Case ID', accessor: 'id' },
    { Header: 'Title', accessor: 'title' },
    { Header: 'Status', accessor: 'status', Cell: (row) => <StatusPill status={row.status} /> },
    { Header: 'Date Filed', accessor: 'createdAt', Cell: (row) => new Date(row.createdAt).toLocaleDateString() },
    { Header: 'Lead Officer', accessor: 'officer' },
    { Header: 'Actions', accessor: 'actions', Cell: (row) => (
        <Button variant="secondary" className="text-sm py-1 px-2">View Details</Button>
    )},
  ];

  return (
    <>
        {isModalOpen && <CaseReportModal onClose={() => setIsModalOpen(false)} onSubmit={handleCreateReport} />}

        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Case Reports</h1>
                <Button onClick={openModalToCreate}>+ File New Report</Button>
            </div>
            <Table columns={columns} data={reports} loading={loading} />
        </div>
    </>
  );
};

export default CaseReportsPage;