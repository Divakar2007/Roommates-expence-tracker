
import React, { useState, useRef, useCallback } from 'react';
import { User, Expense, Category } from '../types';
import { scanReceipt } from '../services/geminiService';
import { CameraIcon } from './icons/CameraIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

interface AddExpenseModalProps {
  users: User[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onClose: () => void;
}

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      base64: await base64EncodedDataPromise,
      mimeType: file.type
    };
};

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ users, onAddExpense, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>(Category.Groceries);
  const [paidBy, setPaidBy] = useState(users[0]?.id || '');
  const [splitWith, setSplitWith] = useState<string[]>(users.map(u => u.id));
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSplitWithChange = (userId: string) => {
    setSplitWith(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);
    try {
        const { base64, mimeType } = await fileToGenerativePart(file);
        const data = await scanReceipt(base64, mimeType);
        setDescription(data.merchantName);
        setAmount(data.totalAmount);
        setDate(data.transactionDate.split('T')[0]);
        setCategory(Category.Other); // Default to Other after scan
    } catch (error) {
        setScanError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
        setIsScanning(false);
        // Reset file input to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Explicitly convert `amount` to a number for comparison to fix TypeScript error.
    if (description && Number(amount) > 0 && paidBy && splitWith.length > 0) {
      onAddExpense({
        description,
        amount: Number(amount),
        date,
        category,
        paidBy,
        splitWith,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Expense</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
             <XIcon className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                  <>
                    <SpinnerIcon />
                    <span>Scanning Receipt...</span>
                  </>
              ) : (
                  <>
                    <CameraIcon className="w-6 h-6" />
                    <span>Scan Receipt with AI</span>
                  </>
              )}
            </button>
            {scanError && <p className="text-sm text-red-500">{scanError}</p>}
            
            <div className="text-center my-2 text-slate-400">or enter manually</div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount (₹)</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Paid By</label>
              <div className="mt-2 flex space-x-2">
                {users.map(user => (
                  <button type="button" key={user.id} onClick={() => setPaidBy(user.id)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${paidBy === user.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                    {user.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Split With (equally)</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {users.map(user => (
                  <button type="button" key={user.id} onClick={() => handleSplitWithChange(user.id)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${splitWith.includes(user.id) ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                    <span>{user.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={!description || !amount || splitWith.length === 0}>Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};