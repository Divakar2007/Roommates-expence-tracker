import React from 'react';
import { User } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrendingDownIcon } from './icons/TrendingDownIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';

interface BalanceSummaryProps {
  usersWithBalances: (User & { balance: number })[];
  onAddRoommate: () => void;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({ usersWithBalances, onAddRoommate }) => {
  const totalExpenses = usersWithBalances.reduce((acc, user) => {
    return user.balance > 0 ? acc + user.balance : acc;
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
       <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <ScaleIcon className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Balances</h2>
        </div>
        <button 
          onClick={onAddRoommate}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors"
          aria-label="Add Roommate"
        >
          <UserPlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {usersWithBalances.map(user => {
          const isOwed = user.balance > 0;
          const isOwing = user.balance < 0;
          const isSettled = user.balance === 0;
          
          const statusColor = isOwed ? 'text-emerald-500' : isOwing ? 'text-rose-500' : 'text-slate-500';
          const bgColor = isOwed ? 'bg-emerald-50 dark:bg-emerald-900/50' : isOwing ? 'bg-rose-50 dark:bg-rose-900/50' : 'bg-slate-100 dark:bg-slate-700';

          return (
            <div key={user.id} className={`p-4 rounded-lg ${bgColor}`}>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                <div className={`flex items-center space-x-1 font-bold ${statusColor}`}>
                  {isOwed && <TrendingUpIcon className="w-5 h-5" />}
                  {isOwing && <TrendingDownIcon className="w-5 h-5" />}
                  <span>{isOwed ? 'Is owed' : isOwing ? 'Owes' : 'Is settled up'}</span>
                </div>
                <p className={`text-lg font-bold ${statusColor}`}>
                  {Math.abs(user.balance).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};