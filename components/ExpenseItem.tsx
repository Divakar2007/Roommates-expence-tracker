
import React from 'react';
import { Expense, User, Category } from '../types';
import { GroceriesIcon } from './icons/GroceriesIcon';
import { RentIcon } from './icons/RentIcon';
import { UtilitiesIcon } from './icons/UtilitiesIcon';
import { EntertainmentIcon } from './icons/EntertainmentIcon';
import { OtherIcon } from './icons/OtherIcon';

interface ExpenseItemProps {
  expense: Expense;
  userMap: Map<string, User>;
}

const CategoryIcon: React.FC<{ category: Category; className?: string }> = ({ category, className = "w-6 h-6" }) => {
  switch (category) {
    case Category.Groceries:
      return <GroceriesIcon className={className} />;
    case Category.Rent:
      return <RentIcon className={className} />;
    case Category.Utilities:
      return <UtilitiesIcon className={className} />;
    case Category.Entertainment:
      return <EntertainmentIcon className={className} />;
    default:
      return <OtherIcon className={className} />;
  }
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, userMap }) => {
  const paidByUser = userMap.get(expense.paidBy);
  const date = new Date(expense.date);
  // Add a day to date to correct for timezone issues
  date.setDate(date.getDate() + 1);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
            <CategoryIcon category={expense.category} className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </div>
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-100">{expense.description}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {paidByUser?.name} paid
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-slate-800 dark:text-slate-100">
          {expense.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{formattedDate}</p>
      </div>
    </div>
  );
};