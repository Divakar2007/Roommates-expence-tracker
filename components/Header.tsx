
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
    onAddExpense: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddExpense }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          RoomMate<span className="text-indigo-500">Expenses</span>
        </h1>
        <button
          onClick={onAddExpense}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};
