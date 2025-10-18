// src/features/police/FlagGuestModal.jsx
import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const FlagGuestModal = ({ guest, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason);
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-2">Flag Guest: {guest.primaryGuest.name}</h2>
      <p className="text-sm text-gray-600 mb-4">Provide a clear reason for flagging. This action will be logged.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Reason for flagging..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
          required
        />
        <div className="flex justify-end gap-4 pt-4 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit Alert</Button>
        </div>
      </form>
    </Modal>
  );
};

export default FlagGuestModal;