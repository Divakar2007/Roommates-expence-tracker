import React from 'react';
import { Expense, User } from '../types';
import { BalanceSummary } from './BalanceSummary';
import { ExpenseItem } from './ExpenseItem';
import { ActivityIcon } from './icons/ActivityIcon';

interface DashboardProps {
  usersWithBalances: (User & { balance: number })[];
  expenses: Expense[];
  users: User[];
  onAddRoommate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ usersWithBalances, expenses, users, onAddRoommate }) => {
  const userMap = new Map(users.map(u => [u.id, u]));

  return (
    <div className="space-y-6">
      <BalanceSummary usersWithBalances={usersWithBalances} onAddRoommate={onAddRoommate} />

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <ActivityIcon className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Activity</h2>
          </div>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {expenses.length > 0 ? (
            expenses.map(expense => (
              <ExpenseItem key={expense.id} expense={expense} userMap={userMap} />
            ))
          ) : (
             <p className="text-center py-10 text-slate-500">No expenses yet. Add one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};