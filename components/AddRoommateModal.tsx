import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';

interface AddRoommateModalProps {
  onAddRoommate: (name: string) => void;
  onClose: () => void;
}

export const AddRoommateModal: React.FC<AddRoommateModalProps> = ({ onAddRoommate, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddRoommate(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Roommate</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close modal">
             <XIcon className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="roommate-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Roommate's Name</label>
            <input 
              type="text" 
              id="roommate-name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., John Doe"
              autoFocus
            />
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={!name.trim()}>Save Roommate</button>
          </div>
        </form>
      </div>
    </div>
  );
};
