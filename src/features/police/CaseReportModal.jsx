// src/features/police/CaseReportModal.jsx
import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';

const CaseReportModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', summary: '', status: 'Open', officer: 'Officer Singh' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">File New Case Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Case Title" name="title" value={formData.title} onChange={handleChange} required />
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case Summary</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md text-sm min-h-[120px] focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">File Report</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CaseReportModal;